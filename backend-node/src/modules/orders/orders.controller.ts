import { Request, Response } from 'express';
import { OrdersService } from './orders.service';

export const OrdersController = {
  async create(req: Request, res: Response) {
    try {
      const { organizationId, id: userId } = (req as any).user;
      const { dealId, accountId } = req.body;

      let po;
      if (dealId) {
        po = await OrdersService.createFromDeal(organizationId, dealId, accountId, userId);
      } else {
        // Manual creation
        po = await OrdersService.create(organizationId, req.body, userId);
      }
      
      return res.status(201).json(po);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const query = req.query; // Pass query params (search, status)
      const orders = await OrdersService.findAll(organizationId, query);
      return res.status(200).json(orders);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const id = req.params.id as string;
      const order = await OrdersService.findOne(id, organizationId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json(order);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async updateStep(req: Request, res: Response) {
    try {
      const { organizationId, id: userId } = (req as any).user;
      const { id: purchaseOrderId, stepName } = req.params;
      const updatedStep = await OrdersService.updateStepByName(purchaseOrderId as string, stepName as string, organizationId, req.body, userId);
      return res.status(200).json(updatedStep);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  async uploadDocument(req: Request, res: Response) {
    try {
      const { organizationId, id: userId } = (req as any).user;
      const { id: purchaseOrderId } = req.params;
      const { stepId, type, fileName, fileUrl } = req.body;
      
      const doc = await OrdersService.addDocument(purchaseOrderId as string, stepId, organizationId, { type, fileName, fileUrl }, userId);
      return res.status(201).json(doc);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
};
