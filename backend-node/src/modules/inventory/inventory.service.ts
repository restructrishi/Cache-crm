import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const InventoryService = {
  async create(data: any) {
    return prisma.inventory.create({ data });
  },

  async findAll(organizationId?: string) {
    const where = organizationId ? { organizationId } : {};
    return prisma.inventory.findMany({
      where,
      orderBy: { lastUpdated: 'desc' }
    });
  },

  async findOne(id: string, organizationId: string) {
    return prisma.inventory.findFirst({
      where: { id, organizationId }
    });
  },

  async update(id: string, organizationId: string, data: any) {
    // Update lastUpdated automatically
    return prisma.inventory.update({
      where: { id },
      data: {
        ...data,
        lastUpdated: new Date()
      }
    });
  },

  async delete(id: string) {
    return prisma.inventory.delete({ where: { id } });
  }
};
