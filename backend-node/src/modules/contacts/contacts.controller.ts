import { Request, Response } from 'express';
import { ContactsService } from './contacts.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const ContactsController = {
  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { organizationId } = user;
      
      if (!organizationId) {
        return res.status(400).json({ message: 'User does not belong to an organization' });
      }

      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        designation, 
        accountId 
      } = req.body;

      if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First name and Last name are required' });
      }

      // If accountId is provided, verify it belongs to the same organization
      if (accountId) {
        const account = await prisma.account.findFirst({
          where: { id: accountId, organizationId }
        });
        if (!account) {
          return res.status(400).json({ message: 'Invalid Account ID' });
        }
      }

      const contact = await ContactsService.create({
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        designation: designation || null,
        accountId: accountId || null,
        organizationId
      });

      return res.status(201).json(contact);
    } catch (error: any) {
      console.error('Create Contact Error:', error);
      return res.status(500).json({ message: 'Failed to create contact', error: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { organizationId, roles } = (req as any).user;
      const { accountId } = req.query;
      
      const isSuperAdmin = roles && (roles.includes('SUPER_ADMIN') || roles.includes('Super Admin'));
      
      if (!organizationId && !isSuperAdmin) {
         return res.status(400).json({ message: 'User does not belong to an organization' });
      }

      const contacts = await ContactsService.findAll(
        organizationId || undefined, 
        typeof accountId === 'string' ? accountId : undefined
      );
      return res.json(contacts);
    } catch (error: any) {
      console.error('List Contacts Error:', error);
      return res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const contactId = Array.isArray(id) ? id[0] : id;
      
      const contact = await ContactsService.findOne(contactId, organizationId);
      
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      return res.json(contact);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch contact', error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const contactId = Array.isArray(id) ? id[0] : id;
      const updateData = req.body;
      
      // Sanitize
      delete updateData.organizationId;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      // If updating accountId, verify it
      if (updateData.accountId) {
        const account = await prisma.account.findFirst({
          where: { id: updateData.accountId, organizationId }
        });
        if (!account) {
          return res.status(400).json({ message: 'Invalid Account ID' });
        }
      }

      const contact = await ContactsService.update(contactId, organizationId, updateData);
      
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      return res.json(contact);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to update contact', error: error.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const { id } = req.params;
      const contactId = Array.isArray(id) ? id[0] : id;
      
      const result = await ContactsService.remove(contactId, organizationId);
      
      if (!result) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      return res.json({ message: 'Contact deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to delete contact', error: error.message });
    }
  }
};
