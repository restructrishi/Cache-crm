import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async signup(dto: SignupDto) {
        // 1. Check if user exists (globally unique email per org? schema says unique(org_id, email) but usually SaaS email is unique globally or we need logic. 
        // Wait, typical SaaS: email unique globally if user table is shared. 
        // My schema: `unique(organization_id, email)`. So same email can exist in multiple orgs.
        // However, for Signup (new org), we create a new user. 
        // Let's create Organization first.

        // 2. Create Organization
        const organization = await this.prisma.organization.create({
            data: {
                name: dto.organizationName,
                subscriptionPlan: 'FREE',
            },
        });

        // 3. Create 'Org Admin' Role for this Org
        const adminRole = await this.prisma.role.create({
            data: {
                organizationId: organization.id,
                name: 'Org Admin',
                description: 'Administrator with full access to organization',
                isSystemRole: true,
            },
        });

        // 4. Create System Permissions (Sales, SCM, etc) - optional for now, usually seeded.

        // 5. Create User
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                organizationId: organization.id,
                email: dto.email,
                passwordHash: hashedPassword,
                fullName: dto.fullName,
                phone: dto.phone,
                userRoles: {
                    create: {
                        roleId: adminRole.id
                    }
                }
            },
        });

        return this.generateToken(user.id, user.email, organization.id);
    }

    async login(dto: LoginDto) {
        // We need organizationId to login? 
        // If email exists in multiple orgs, we might need a "Discovery" step or assume 1 org for now.
        // For simplicity: Find FIRST user with this email. 
        // REAL WORLD: User enters Email -> System shows list of Orgs -> User picks Org -> Password.
        // HERE: Simple SaaS, assume email is unique globally for now or just pick first.

        const user = await this.prisma.user.findFirst({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateToken(user.id, user.email, user.organizationId);
    }

    private async generateToken(userId: string, email: string, organizationId: string) {
        const payload = { sub: userId, email, organizationId };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: userId,
                email: email,
                organizationId: organizationId
            }
        };
    }
}
