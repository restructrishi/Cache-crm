import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const OrdersService = {
  // Create PO from Deal (Automated)
  async createFromDeal(organizationId: string, dealId: string, accountId: string, userId: string) {
    const defaultSteps = this.getDefaultSteps();

    const po = await prisma.purchaseOrder.create({
      data: {
        organizationId,
        dealId,
        accountId,
        poNumber: `PO-${Date.now()}`, 
        currentStage: 'Customer PO Received',
        status: 'In Progress',
        steps: {
          create: defaultSteps.map(step => ({
            stepName: step.stepName,
            assignedRole: step.assignedRole,
            status: step.status
          }))
        }
      },
      include: {
        steps: true
      }
    });

    return po;
  },

  // Create PO Manually (Manual Entry)
  async create(organizationId: string, data: any, userId: string) {
    const defaultSteps = this.getDefaultSteps();

    // Use transaction to ensure data integrity
    return prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          organizationId,
          poNumber: data.poNumber || `PO-${Date.now()}`,
          poDate: data.poDate ? new Date(data.poDate) : new Date(),
          vendorName: data.vendorName,
          vendorEmail: data.vendorEmail,
          vendorPhone: data.vendorPhone,
          accountId: data.accountId || null, // Optional link to Account
          amount: data.totalAmount, // Total from items
          currentStage: 'Customer PO Received',
          status: 'In Progress',
          notes: data.notes,
          terms: data.terms,
          steps: {
            create: defaultSteps.map(step => ({
              stepName: step.stepName,
              assignedRole: step.assignedRole,
              status: step.status
            }))
          },
          items: {
            create: (data.items || []).map((item: any) => ({
              description: item.description,
              quantity: parseInt(item.quantity),
              unitPrice: parseFloat(item.unitPrice),
              totalPrice: parseFloat(item.totalPrice)
            }))
          }
        },
        include: {
          steps: true,
          items: true
        }
      });

      // Log creation
      await tx.auditLog.create({
        data: {
          organizationId,
          userId,
          action: 'CREATE_PO',
          entityTable: 'purchase_orders',
          entityId: po.id,
          details: { poNumber: po.poNumber, vendor: po.vendorName }
        }
      });

      return po;
    });
  },

  async findAll(organizationId: string, query: any = {}) {
    const where: any = { organizationId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { poNumber: { contains: query.search, mode: 'insensitive' } },
        { vendorName: { contains: query.search, mode: 'insensitive' } },
        { deal: { name: { contains: query.search, mode: 'insensitive' } } }
      ];
    }

    return prisma.purchaseOrder.findMany({
      where,
      include: {
        deal: { select: { name: true } },
        account: { select: { name: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async findOne(id: string, organizationId: string) {
    return prisma.purchaseOrder.findFirst({
      where: { id, organizationId },
      include: {
        steps: {
          include: {
            documents: true,
            assignedUser: { select: { id: true, fullName: true, email: true } }
          },
          orderBy: { createdAt: 'asc' } 
        },
        items: true,
        documents: true,
        deal: true,
        account: true
      }
    });
  },

  async updateStep(stepId: string, organizationId: string, data: any, userId: string) {
    const step = await prisma.poStep.findFirst({
      where: { id: stepId, purchaseOrder: { organizationId } }
    });

    if (!step) throw new Error('Step not found or access denied');

    return prisma.poStep.update({
      where: { id: stepId },
      data: {
        status: data.status,
        data: data.data, 
        assignedUserId: userId, 
        completedAt: data.status === 'Completed' ? new Date() : undefined,
        updatedAt: new Date()
      }
    });
  },

  async updateStepByName(purchaseOrderId: string, stepName: string, organizationId: string, data: any, userId: string) {
    const step = await prisma.poStep.findFirst({
      where: { 
        purchaseOrder: { id: purchaseOrderId, organizationId },
        stepName: stepName
      }
    });

    if (!step) throw new Error('Step not found');

    return this.updateStep(step.id, organizationId, data, userId);
  },

  async addDocument(purchaseOrderId: string, stepId: string | null, organizationId: string, fileData: any, userId: string) {
     const doc = await prisma.poDocument.create({
       data: {
         purchaseOrderId,
         stepId,
         type: fileData.type,
         fileName: fileData.fileName,
         fileUrl: fileData.fileUrl,
         uploadedBy: userId
       }
     });

     // Log upload
     await prisma.auditLog.create({
        data: {
          organizationId,
          userId,
          action: 'UPLOAD_PO_DOC',
          entityTable: 'purchase_orders',
          entityId: purchaseOrderId,
          details: { fileName: fileData.fileName, stepId }
        }
      });

     return doc;
  },

  getDefaultSteps() {
    return [
      { stepName: 'Customer PO Received', assignedRole: 'SALES', status: 'Pending' },
      { stepName: 'Internal Approval', assignedRole: 'FINANCE', status: 'Pending' },
      { stepName: 'Vendor PO', assignedRole: 'SCM', status: 'Pending' },
      { stepName: 'Delivery & Logistics', assignedRole: 'SCM', status: 'Pending' },
      { stepName: 'Physical Verification', assignedRole: 'FIELD_ENGINEER', status: 'Pending' },
      { stepName: 'Deployment', assignedRole: 'DEPLOYMENT', status: 'Pending' },
      { stepName: 'Invoice', assignedRole: 'FINANCE', status: 'Pending' },
      { stepName: 'Closure', assignedRole: 'ADMIN', status: 'Pending' }
    ];
  }
};
