import { Controller, BadRequestException } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller()
export class PipelineController {
  
  static async create(req: any, res: any, next: any) {
    try {
      const prisma = new PrismaService();
      const service = new PipelineService(prisma);
      const { dealId, accountId } = req.body;
      const result = await service.create(dealId, accountId, req.user);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Pipeline Create Error:', error);
      if (error.status === 400 || error.response?.statusCode === 400 || error.message?.includes('Bad Request')) {
          return res.status(400).json({ message: error.message });
      }
      if (error.status === 404 || error.response?.statusCode === 404 || error.message?.includes('Not Found')) {
          return res.status(404).json({ message: error.message });
      }
      if (error.status === 403 || error.response?.statusCode === 403 || error.message?.includes('Forbidden')) {
          return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }

  static async findAll(req: any, res: any, next: any) {
    try {
      const prisma = new PrismaService();
      const service = new PipelineService(prisma);
      
      const { organizationId, roles } = req.user;
      const isSuperAdmin = roles && (roles.includes('SUPER_ADMIN') || roles.includes('Super Admin'));
      
      if (!organizationId && !isSuperAdmin) {
         return res.status(400).json({ message: 'User does not belong to an organization' });
      }

      // If Super Admin and no orgId in user, maybe allow query param?
      // For now, pass organizationId || undefined
      // But if Super Admin wants ALL, passing undefined to service should allow finding all.
      
      const result = await service.findAll(organizationId || undefined);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: any, res: any, next: any) {
    try {
      const prisma = new PrismaService();
      const service = new PipelineService(prisma);
      const result = await service.findOne(req.params.id, req.user);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateStep(req: any, res: any, next: any) {
    try {
      const prisma = new PrismaService();
      const service = new PipelineService(prisma);
      const { id, stepName } = req.params;
      const result = await service.updateStep(id, stepName, req.body, req.user);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
