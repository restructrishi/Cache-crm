import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ContactsService = {
  async create(data: any) {
    return prisma.contact.create({ data });
  },

  async findAll(organizationId?: string, accountId?: string) {
    const where: any = {};
    if (organizationId) where.organizationId = organizationId;
    if (accountId) where.accountId = accountId;

    return prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        account: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  },

  async findOne(id: string, organizationId: string) {
    return prisma.contact.findFirst({
      where: { id, organizationId },
      include: {
        account: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  },

  async update(id: string, organizationId: string, data: any) {
    const contact = await prisma.contact.findFirst({ where: { id, organizationId } });
    if (!contact) return null;

    return prisma.contact.update({
      where: { id },
      data
    });
  },

  async remove(id: string, organizationId: string) {
    const contact = await prisma.contact.findFirst({ where: { id, organizationId } });
    if (!contact) return null;

    return prisma.contact.delete({
      where: { id }
    });
  }
};
