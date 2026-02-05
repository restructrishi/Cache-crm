import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import authRouter from './modules/auth/auth.routes';
import leadsRouter from './modules/leads/leads.routes';
import superAdminRouter from './modules/super-admin/super-admin.routes';
import adminRouter from './modules/admin/users.routes';
import accountsRouter from './modules/accounts/accounts.routes';
import contactsRouter from './modules/contacts/contacts.routes';
import dealsRouter from './modules/deals/deals.routes';
import meetingsRouter from './modules/meetings/meetings.routes';
import pipelineRouter from './modules/pipeline/pipeline.routes';
import uploadRouter from './modules/upload/upload.routes';
import customerPoRouter from './modules/customer-po/customer-po.routes';
import deploymentRouter from './modules/deployment/deployment.routes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Allow frontend
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  // Serve static uploads
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // Mount isolated routes
  app.use('/api/auth', authRouter);
  app.use('/api/leads', leadsRouter);
  app.use('/api/super-admin', superAdminRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/accounts', accountsRouter);
  app.use('/api/contacts', contactsRouter);
  app.use('/api/deals', dealsRouter);
  app.use('/api/meetings', meetingsRouter);
  app.use('/api/pipeline', pipelineRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/customer-pos', customerPoRouter);
  app.use('/api/deployments', deploymentRouter);
  
  await app.listen(3000);
}
bootstrap();
