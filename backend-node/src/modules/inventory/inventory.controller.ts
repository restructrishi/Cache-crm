import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';

export const InventoryController = {
  async create(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const data = { ...req.body, organizationId };
      const inventory = await InventoryService.create(data);
      return res.status(201).json(inventory);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to create inventory item', error: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const items = await InventoryService.findAll(organizationId);
      return res.json(items);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch inventory', error: error.message });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
      const item = await InventoryService.findOne(id as string, organizationId);
      if (!item) return res.status(404).json({ message: 'Inventory item not found' });
      return res.json(item);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch inventory item', error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
      const updated = await InventoryService.update(id as string, organizationId, req.body);
      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to update inventory item', error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
      await InventoryService.delete(id as string);
      return res.json({ message: 'Inventory item deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to delete inventory item', error: error.message });
    }
  }
};
