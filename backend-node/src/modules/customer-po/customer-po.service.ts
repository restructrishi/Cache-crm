import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CustomerPoService = {
  async findAll(organizationId: string) {
    return prisma.customerPo.findMany({
      where: { organizationId },
      include: {
        deal: {
          select: {
            id: true,
            name: true,
            owner: {
              select: { fullName: true }
            }
          }
        },
        quote: {
          select: { quoteNumber: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async findOne(id: string, organizationId: string) {
    return prisma.customerPo.findFirst({
      where: { id, organizationId },
      include: {
        deal: true,
        quote: true,
        vendorOrders: true
      }
    });
  }
};
