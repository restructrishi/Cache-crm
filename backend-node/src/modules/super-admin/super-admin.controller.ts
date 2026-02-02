import { Request, Response } from 'express';
import { SuperAdminService } from './super-admin.service';

export const SuperAdminController = {
  async createOrganization(req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: 'Request body is missing' });
      }

      // 1. Parse Payload
      const orgData = req.body.organization || req.body;
      const adminData = req.body.admin;

      // 2. Validate Organization Data
      if (!orgData?.name) return res.status(400).json({ message: 'Organization name is required' });
      if (!orgData?.domain) return res.status(400).json({ message: 'Organization domain is required' });

      // 3. Clean Org Payload
      const cleanOrgPayload = {
        name: orgData.name,
        domain: orgData.domain,
        address: orgData.address || null,
        phone: orgData.phone || null,
        subscriptionPlan: orgData.subscriptionPlan || 'FREE'
      };

      // 4. Prepare Admin Payload if exists
      let cleanAdminPayload: any = undefined;
      if (adminData && adminData.email) {
          cleanAdminPayload = {
            email: adminData.email,
            password: adminData.password, // Service handles hashing
            fullName: adminData.fullName || 'Admin'
          };
      }

      // 5. Execute Transaction
      const result = await SuperAdminService.createOrganization(cleanOrgPayload, cleanAdminPayload);
      
      return res.status(201).json(result);
    } catch (error: any) {
      console.error('Create Org Error:', error);
      if (error.message === 'Organization with this domain already exists') {
        return res.status(409).json({ message: error.message });
      }
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('email')) {
             return res.status(400).json({ message: 'Admin email already exists' });
        }
        if (error.meta?.target?.includes('domain')) {
            return res.status(400).json({ message: 'Organization domain already exists' });
        }
      }
      
      return res.status(500).json({ message: error.message || 'Failed to create organization' });
    }
  },

  async createOrgAdmin(req: Request, res: Response) {
    try {
      const user = await SuperAdminService.createOrgAdmin(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      console.error('Create Org Admin Error:', error);
      return res.status(500).json({ message: 'Failed to create org admin', error: error.message });
    }
  },

  async getAllOrganizations(req: Request, res: Response) {
    try {
      const orgs = await SuperAdminService.getAllOrganizations();
      return res.json(orgs);
    } catch (error: any) {
      console.error('List Orgs Error:', error);
      return res.status(500).json({ message: 'Failed to fetch organizations', error: error.message });
    }
  }
};
