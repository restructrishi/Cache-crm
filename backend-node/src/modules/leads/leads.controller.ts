import { Request, Response } from 'express';
import { LeadsService } from './leads.service';

export const LeadsController = {
  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) {
        console.error('Create Lead Failed: User not authenticated');
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { userId, organizationId } = user;
      
      // Strict organization check for regular users
      if (!organizationId) {
        console.error(`Create Lead Failed: User ${userId} has no organizationId`);
        return res.status(400).json({ message: 'User does not belong to an organization' });
      }

      // Extract only fields present in Prisma schema
      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        company, 
        source, 
        status 
      } = req.body;

      if (!company) {
        return res.status(400).json({ message: 'Company name is required' });
      }

      console.log(`Creating lead for Org: ${organizationId}, User: ${userId}`);

      const lead = await LeadsService.create({
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        phone: phone || null,
        company,
        source: source || null,
        status: status || 'New',
        organizationId,
        ownerId: userId // Force owner to be current user
      });

      return res.status(201).json(lead);
    } catch (error: any) {
      console.error('Create Lead Error:', error);
      return res.status(500).json({ message: 'Failed to create lead', error: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { organizationId, roles } = (req as any).user;
      
      // Allow SUPER_ADMIN to see all leads if they don't have an organizationId
      const isSuperAdmin = roles && (roles.includes('SUPER_ADMIN') || roles.includes('Super Admin'));
      
      if (!organizationId && !isSuperAdmin) {
         return res.status(400).json({ message: 'User does not belong to an organization' });
      }

      const leads = await LeadsService.findAll(organizationId || undefined);
      return res.json(leads);
    } catch (error: any) {
      console.error('List Leads Error:', error);
      return res.status(500).json({ message: 'Failed to fetch leads', error: error.message });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const leadId = Array.isArray(id) ? id[0] : id;
      const lead = await LeadsService.findOne(leadId, organizationId);
      
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      return res.json(lead);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch lead', error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const leadId = Array.isArray(id) ? id[0] : id;
      const updateData = req.body;
      
      // Prevent updating ownership or org via this endpoint for safety
      delete updateData.organizationId;
      delete updateData.ownerId;
      delete updateData.id;

      const lead = await LeadsService.update(leadId, organizationId, updateData);
      
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      return res.json(lead);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to update lead', error: error.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const leadId = Array.isArray(id) ? id[0] : id;
      
      const result = await LeadsService.remove(leadId, organizationId);
      
      if (!result) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      
      return res.json({ message: 'Lead deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to delete lead', error: error.message });
    }
  }
};
