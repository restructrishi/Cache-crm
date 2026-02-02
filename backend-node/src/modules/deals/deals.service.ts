import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DealsService = {
  async create(data: any) {
    // Ensure date is a Date object if provided
    if (data.expectedCloseDate) {
      data.expectedCloseDate = new Date(data.expectedCloseDate);
    }
    return prisma.deal.create({ data });
  },

  async findAll(organizationId?: string) {
    const where = organizationId ? { organizationId } : {};
    return prisma.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        account: {
            select: {
                id: true,
                name: true
            }
        },
        contact: {
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        },
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        orderPipeline: {
            select: {
                id: true,
                currentStage: true
            }
        }
      }
    });
  },

  async findOne(id: string, organizationId: string) {
    return prisma.deal.findFirst({
      where: { id, organizationId },
      include: {
        account: true,
        contact: true,
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        stageHistory: {
            orderBy: { changedAt: 'desc' }
        }
      }
    });
  },

  async update(id: string, organizationId: string, data: any) {
    const deal = await prisma.deal.findFirst({ where: { id, organizationId } });
    if (!deal) return null;

    if (data.expectedCloseDate) {
      data.expectedCloseDate = new Date(data.expectedCloseDate);
    }

    return prisma.deal.update({
      where: { id },
      data
    });
  },

  async remove(id: string, organizationId: string) {
    const deal = await prisma.deal.findFirst({ where: { id, organizationId } });
    if (!deal) return null;

    return prisma.deal.delete({
      where: { id }
    });
  }
};
