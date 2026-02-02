import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const AccountsService = {
  async create(data: any) {
    return prisma.account.create({ data });
  },

  async findAll(organizationId?: string) {
    const where = organizationId ? { organizationId } : {};
    return prisma.account.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            fullName: true,
            email: true
          }
        },
        creator: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    });
  },

  async findOne(id: string, organizationId: string) {
    return prisma.account.findFirst({
      where: { id, organizationId },
      include: {
        owner: {
          select: {
            fullName: true,
            email: true
          }
        },
        creator: {
          select: {
            fullName: true,
            email: true
          }
        },
        contacts: true,
        deals: true
      }
    });
  },

  async update(id: string, organizationId: string, data: any) {
    // Check if exists first
    const account = await prisma.account.findFirst({ where: { id, organizationId } });
    if (!account) return null;

    return prisma.account.update({
      where: { id },
      data
    });
  },

  async remove(id: string, organizationId: string) {
    const account = await prisma.account.findFirst({ where: { id, organizationId } });
    if (!account) return null;

    return prisma.account.delete({
      where: { id }
    });
  }
};
