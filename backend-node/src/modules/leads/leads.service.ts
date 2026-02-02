import { PrismaClient, Lead } from '@prisma/client';

const prisma = new PrismaClient();

export const LeadsService = {
  async create(data: any) {
    return prisma.lead.create({ data });
  },

  async findAll(organizationId?: string) {
    const where = organizationId ? { organizationId } : {};
    return prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { 
        owner: { 
          select: { 
            fullName: true,
            email: true
          } 
        } 
      }
    });
  },

  async findOne(id: string, organizationId: string) {
    return prisma.lead.findFirst({
      where: { id, organizationId },
      include: { 
        owner: { 
          select: { 
            fullName: true,
            email: true
          } 
        } 
      }
    });
  },

  async update(id: string, organizationId: string, data: any) {
    // Check if exists first
    const lead = await prisma.lead.findFirst({ where: { id, organizationId } });
    if (!lead) return null;

    return prisma.lead.update({
      where: { id },
      data
    });
  },

  async remove(id: string, organizationId: string) {
    const lead = await prisma.lead.findFirst({ where: { id, organizationId } });
    if (!lead) return null;

    return prisma.lead.delete({
      where: { id }
    });
  }
};
