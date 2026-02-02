import { Request, Response } from 'express';
import { DealsService } from './deals.service';

export const DealsController = {
  async create(req: Request, res: Response) {
    try {
      const { organizationId, id: userId } = (req as any).user;
      // Default dealType if not provided
      const dealData = {
        ...req.body,
        organizationId,
        ownerId: req.body.ownerId || userId, // Default to creator if not specified
        dealType: req.body.dealType || 'New Business'
      };

      const deal = await DealsService.create(dealData);
      return res.status(201).json(deal);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to create deal', error: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const deals = await DealsService.findAll(organizationId);
      return res.json(deals);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch deals', error: error.message });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const dealId = Array.isArray(id) ? id[0] : id; // Handle array param
      const deal = await DealsService.findOne(dealId, organizationId);
      if (!deal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      return res.json(deal);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch deal', error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const dealId = Array.isArray(id) ? id[0] : id;
      const updatedDeal = await DealsService.update(dealId, organizationId, req.body);
      if (!updatedDeal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      return res.json(updatedDeal);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to update deal', error: error.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const dealId = Array.isArray(id) ? id[0] : id;
      const deletedDeal = await DealsService.remove(dealId, organizationId);
      if (!deletedDeal) {
        return res.status(404).json({ message: 'Deal not found' });
      }
      return res.json({ message: 'Deal deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to delete deal', error: error.message });
    }
  }
};
