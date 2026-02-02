import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'supersecretkey',
        });
    }

    async validate(payload: any) {
        console.log('JWT Payload:', payload);
        if (!payload.sub) {
            console.error('JWT Payload missing sub (userId)');
            throw new UnauthorizedException('Invalid token payload');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user) {
            console.error(`User not found for ID: ${payload.sub}`);
            throw new UnauthorizedException();
        }
        return user;
    }
}
