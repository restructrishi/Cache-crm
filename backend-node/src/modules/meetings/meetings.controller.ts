import { Request, Response } from 'express';
import { MeetingsService } from './meetings.service';

export const MeetingsController = {
  async create(req: Request, res: Response) {
    try {
      console.log('Creating meeting payload:', JSON.stringify(req.body, null, 2));
      const { organizationId, id: userId } = (req as any).user;
      
      // Remove id if present to avoid Prisma errors on create
      const { id, ...rest } = req.body;

      const meetingData = {
        ...rest,
        organizationId,
        hostId: req.body.hostId || userId,
        status: 'Scheduled'
      };

      const meeting = await MeetingsService.create(meetingData);
      return res.status(201).json(meeting);
    } catch (error: any) {
      console.error('Create Meeting Error:', error);
      return res.status(500).json({ message: 'Failed to create meeting: ' + error.message, error: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const meetings = await MeetingsService.findAll(organizationId);
      return res.json(meetings);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch meetings', error: error.message });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const meetingId = Array.isArray(id) ? id[0] : id;
      const meeting = await MeetingsService.findOne(meetingId, organizationId);
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
      return res.json(meeting);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch meeting', error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const meetingId = Array.isArray(id) ? id[0] : id;
      const updatedMeeting = await MeetingsService.update(meetingId, organizationId, req.body);
      if (!updatedMeeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
      return res.json(updatedMeeting);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to update meeting', error: error.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const meetingId = Array.isArray(id) ? id[0] : id;
      const deletedMeeting = await MeetingsService.remove(meetingId, organizationId);
      if (!deletedMeeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
      return res.json({ message: 'Meeting deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to delete meeting', error: error.message });
    }
  },

  async createMom(req: Request, res: Response) {
    try {
        const { organizationId, id: userId } = (req as any).user;
        const { id } = req.params;
        const meetingId = Array.isArray(id) ? id[0] : id;
        
        const momData = {
            ...req.body,
            submittedBy: userId
        };

        const mom = await MeetingsService.createMom(meetingId, organizationId, momData);
        return res.status(201).json(mom);
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to create MOM', error: error.message });
    }
  }
};
