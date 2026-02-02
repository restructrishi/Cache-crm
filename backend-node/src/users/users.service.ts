import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto, organizationId: string) {
    console.log(`Creating user ${dto.email} for organization ${organizationId}`);
    
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        organizationId,
      },
    });

    if (existingUser) {
      console.warn(`Create User Failed: User ${dto.email} already exists in org ${organizationId}`);
      throw new ConflictException('User with this email already exists in this organization');
    }

    return this.prisma.$transaction(async (tx) => {
        // 1. Find default 'USER' role
        const userRole = await tx.role.findFirst({
            where: { organizationId, name: 'USER' }
        });

        if (!userRole) {
             console.error(`Create User Failed: Default 'USER' role not found for org ${organizationId}`);
             throw new ConflictException('Default USER role not found for this organization');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        // 2. Create User
        const user = await tx.user.create({
            data: {
                email: dto.email,
                passwordHash,
                department: dto.department,
                accessLevel: dto.accessLevel,
                organizationId,
                fullName: dto.email.split('@')[0], // Default name
                isActive: true
            }
        });

        // 3. Assign Role
        await tx.userRole.create({
            data: {
                userId: user.id,
                roleId: userRole.id
            }
        });

        console.log(`User created successfully: ${user.id}`);

        return {
            id: user.id,
            email: user.email,
            department: user.department,
            accessLevel: user.accessLevel,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        email: true,
        fullName: true,
        department: true,
        accessLevel: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
