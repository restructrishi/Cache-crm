import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DeploymentService = {
  async create(data: any) {
    // Ensure default stage if not provided
    if (!data.stage) {
      data.stage = 'Request Initiation';
    }
    
    // Create initial log
    const initialLog = {
      action: 'CREATED',
      stage: data.stage,
      timestamp: new Date().toISOString(),
      userId: data.requestedBy,
      details: 'Deployment request initiated'
    };

    return prisma.deployment.create({
      data: {
        ...data,
        workflowLogs: [initialLog]
      }
    });
  },

  async findAll(organizationId?: string) {
    const where = organizationId ? { organizationId } : {};
    return prisma.deployment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        deal: {
          select: { name: true, id: true }
        },
        engineer: {
          select: { fullName: true, email: true }
        },
        requester: {
          select: { fullName: true, email: true }
        }
      }
    });
  },

  async findOne(id: string, organizationId: string) {
    return prisma.deployment.findFirst({
      where: { id, organizationId },
      include: {
        deal: true,
        engineer: true,
        requester: true,
        approver: true,
        tasks: {
          orderBy: { taskName: 'asc' } // or other order
        }
      }
    });
  },

  async update(id: string, organizationId: string, data: any, userId: string) {
    const deployment = await prisma.deployment.findFirst({ where: { id, organizationId } });
    if (!deployment) return null;

    // Handle logs if stage changes
    let logs = (deployment.workflowLogs as any[]) || [];
    if (data.stage && data.stage !== deployment.stage) {
      logs.push({
        action: 'STAGE_CHANGE',
        from: deployment.stage,
        to: data.stage,
        timestamp: new Date().toISOString(),
        userId,
        details: `Stage updated to ${data.stage}`
      });
      // Update workflowLogs in data
      data.workflowLogs = logs;
    }

    return prisma.deployment.update({
      where: { id },
      data
    });
  },

  async addTask(deploymentId: string, data: any) {
    return prisma.deploymentTask.create({
      data: {
        deploymentId,
        ...data
      }
    });
  },

  async updateTask(taskId: string, data: any) {
    return prisma.deploymentTask.update({
      where: { id: taskId },
      data
    });
  },

  async removeTask(taskId: string) {
    return prisma.deploymentTask.delete({
      where: { id: taskId }
    });
  }
};
