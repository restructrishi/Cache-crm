import { Request, Response } from 'express';
import { CustomerPoService } from './customer-po.service';

export const CustomerPoController = {
  async findAll(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const pos = await CustomerPoService.findAll(organizationId);
      res.json(pos);
    } catch (error: any) {
      console.error('Error fetching POs:', error);
      res.status(500).json({ message: 'Failed to fetch Purchase Orders' });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const po = await CustomerPoService.findOne(id as string, organizationId);
      if (!po) return res.status(404).json({ message: 'Purchase Order not found' });
      res.json(po);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch Purchase Order' });
    }
  }
};
