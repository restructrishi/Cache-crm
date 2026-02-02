import { Request, Response } from 'express';
import { AccountsService } from './accounts.service';

export const AccountsController = {
  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { userId, organizationId } = user;
      
      if (!organizationId) {
        return res.status(400).json({ message: 'User does not belong to an organization' });
      }

      const { 
        name, 
        industry, 
        website, 
        phone, 
        address,
        ownerId 
      } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Account name is required' });
      }

      console.log(`Creating account for Org: ${organizationId}, User: ${userId}`);

      const account = await AccountsService.create({
        name,
        industry: industry || null,
        website: website || null,
        phone: phone || null,
        address: address || null,
        organizationId,
        ownerId: ownerId || userId, // Default to creator if not specified
        createdBy: userId
      });

      return res.status(201).json(account);
    } catch (error: any) {
      console.error('Create Account Error:', error);
      return res.status(500).json({ message: 'Failed to create account', error: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { organizationId, roles } = (req as any).user;
      
      // Allow SUPER_ADMIN to see all accounts if they don't have an organizationId
      const isSuperAdmin = roles && (roles.includes('SUPER_ADMIN') || roles.includes('Super Admin'));
      
      if (!organizationId && !isSuperAdmin) {
         return res.status(400).json({ message: 'User does not belong to an organization' });
      }

      const accounts = await AccountsService.findAll(organizationId || undefined);
      return res.json(accounts);
    } catch (error: any) {
      console.error('List Accounts Error:', error);
      return res.status(500).json({ message: 'Failed to fetch accounts', error: error.message });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const accountId = Array.isArray(id) ? id[0] : id;
      const account = await AccountsService.findOne(accountId, organizationId);
      
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      
      return res.json(account);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch account', error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const accountId = Array.isArray(id) ? id[0] : id;
      const updateData = req.body;
      
      // Prevent updating ownership or org via this endpoint directly if needed, 
      // but for now we trust the body (except system fields could be sanitized if strict)
      // We will sanitize organizationId and createdBy to prevent tampering
      delete updateData.organizationId;
      delete updateData.createdBy;
      delete updateData.createdAt;

      const account = await AccountsService.update(accountId, organizationId, updateData);
      
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      
      return res.json(account);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to update account', error: error.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const accountId = Array.isArray(id) ? id[0] : id;
      
      const result = await AccountsService.remove(accountId, organizationId);
      
      if (!result) {
        return res.status(404).json({ message: 'Account not found' });
      }
      
      return res.json({ message: 'Account deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to delete account', error: error.message });
    }
  }
};
