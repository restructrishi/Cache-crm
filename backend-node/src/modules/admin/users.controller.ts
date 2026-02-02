import { Request, Response } from 'express';
import { AdminUsersService } from './users.service';

export const AdminUsersController = {
  async createUser(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const user = await AdminUsersService.createUser(organizationId, req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      console.error('Create User Error:', error);
      return res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
  },

  async listUsers(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const users = await AdminUsersService.listUsers(organizationId);
      return res.json(users);
    } catch (error: any) {
      console.error('List Users Error:', error);
      return res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
  },

  async updateUserStatus(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const userId = Array.isArray(id) ? id[0] : id;
      const { isActive } = req.body;
      
      const user = await AdminUsersService.updateUserStatus(organizationId, userId, isActive);
      return res.json(user);
    } catch (error: any) {
      console.error('Update Status Error:', error);
      return res.status(500).json({ message: 'Failed to update user status', error: error.message });
    }
  }
};
