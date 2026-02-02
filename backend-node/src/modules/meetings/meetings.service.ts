import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const MeetingsService = {
  async create(data: any) {
    // Ensure dates are Date objects
    if (data.startTime) data.startTime = new Date(data.startTime);
    if (data.endTime) data.endTime = new Date(data.endTime);
    
    return prisma.meeting.create({ data });
  },

  async findAll(organizationId?: string) {
    const where = organizationId ? { organizationId } : {};
    return prisma.meeting.findMany({
      where,
      orderBy: { startTime: 'desc' },
      include: {
        host: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        deal: {
          select: {
            id: true,
            name: true
          }
        },
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true
          }
        },
        mom: true
      }
    });
  },

  async findOne(id: string, organizationId: string) {
    return prisma.meeting.findFirst({
      where: { id, organizationId },
      include: {
        host: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        deal: true,
        lead: true,
        mom: {
            include: {
                actionItems: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                fullName: true
                            }
                        }
                    }
                },
                submittedByUser: {
                    select: {
                        id: true,
                        fullName: true
                    }
                }
            }
        }
      }
    });
  },

  async update(id: string, organizationId: string, data: any) {
    const meeting = await prisma.meeting.findFirst({ where: { id, organizationId } });
    if (!meeting) return null;

    if (data.startTime) data.startTime = new Date(data.startTime);
    if (data.endTime) data.endTime = new Date(data.endTime);

    return prisma.meeting.update({
      where: { id },
      data
    });
  },

  async remove(id: string, organizationId: string) {
    const meeting = await prisma.meeting.findFirst({ where: { id, organizationId } });
    if (!meeting) return null;

    return prisma.meeting.delete({
      where: { id }
    });
  },

  // MOM Specific methods
  async createMom(meetingId: string, organizationId: string, data: any) {
    const meeting = await prisma.meeting.findFirst({ where: { id: meetingId, organizationId } });
    if (!meeting) throw new Error('Meeting not found');

    // Create MOM
    const mom = await prisma.meetingMom.create({
        data: {
            meetingId,
            summary: data.summary,
            discussionPoints: data.discussionPoints,
            nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null,
            submittedBy: data.submittedBy,
            actionItems: {
                create: (data.actionItems || []).map((item: any) => ({
                    organizationId,
                    description: item.description,
                    ownerId: item.ownerId,
                    dueDate: item.dueDate ? new Date(item.dueDate) : null,
                    status: 'Pending'
                }))
            }
        }
    });

    // Update meeting status
    await prisma.meeting.update({
        where: { id: meetingId },
        data: { 
            momSubmitted: true,
            status: 'Completed'
        }
    });

    return mom;
  }
};
