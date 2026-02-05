import { Request, Response } from 'express';
import { DeploymentService } from './deployment.service';

export const DeploymentController = {
  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ message: 'User not authenticated' });

      const { userId, organizationId, roles, department } = user;

      // Permission Check: Only Deployment Team or Admins can create/edit
      const isAuthorized = roles.includes('SUPER_ADMIN') || 
                          roles.includes('ORG_ADMIN') || 
                          department === 'Deployment';

      if (!isAuthorized) {
        return res.status(403).json({ message: 'Insufficient permissions. Only Deployment Team can create deployments.' });
      }

      const { 
        dealId, 
        deploymentType, 
        environment, 
        priority, 
        description 
      } = req.body;

      const deployment = await DeploymentService.create({
        organizationId,
        dealId,
        deploymentType,
        environment,
        priority: priority || 'Medium',
        stage: 'Request Initiation',
        requestedBy: userId,
        status: 'Pending'
      });

      return res.status(201).json(deployment);
    } catch (error: any) {
      console.error('Create Deployment Error:', error);
      return res.status(500).json({ message: 'Failed to create deployment', error: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { organizationId, roles } = (req as any).user;
      
      // Allow SUPER_ADMIN to see all if no org
      const isSuperAdmin = roles && (roles.includes('SUPER_ADMIN') || roles.includes('Super Admin'));
      if (!organizationId && !isSuperAdmin) {
         return res.status(400).json({ message: 'User does not belong to an organization' });
      }

      const deployments = await DeploymentService.findAll(organizationId || undefined);
      return res.json(deployments);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch deployments', error: error.message });
    }
  },

  async findOne(req: Request, res: Response) {
    try {
      const { organizationId } = (req as any).user;
      const id = req.params.id as string;
      
      const deployment = await DeploymentService.findOne(id, organizationId);
      if (!deployment) {
        return res.status(404).json({ message: 'Deployment not found' });
      }
      
      return res.json(deployment);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to fetch deployment', error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { userId, organizationId, roles, department } = user;
      const id = req.params.id as string;

      // Permission Check
      const isAuthorized = roles.includes('SUPER_ADMIN') || 
                          roles.includes('ORG_ADMIN') || 
                          department === 'Deployment';

      if (!isAuthorized) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      const updated = await DeploymentService.update(id, organizationId, req.body, userId);
      if (!updated) {
        return res.status(404).json({ message: 'Deployment not found' });
      }

      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to update deployment', error: error.message });
    }
  },

  // Task Management
  async addTask(req: Request, res: Response) {
    try {
      const id = req.params.id as string; // deploymentId
      const taskData = req.body;
      
      const task = await DeploymentService.addTask(id, taskData);
      return res.json(task);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to add task', error: error.message });
    }
  },

  async updateTask(req: Request, res: Response) {
    try {
      const taskId = req.params.taskId as string;
      const taskData = req.body;
      
      const task = await DeploymentService.updateTask(taskId, taskData);
      return res.json(task);
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
  },

  async removeTask(req: Request, res: Response) {
    try {
      const taskId = req.params.taskId as string;
      await DeploymentService.removeTask(taskId);
      return res.json({ message: 'Task removed' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to remove task', error: error.message });
    }
  }
};
