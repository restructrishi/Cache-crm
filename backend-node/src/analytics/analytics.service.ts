import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { ExportFormat, ExportType } from './dto/export-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(organizationId: string) {
    // 1. Leads Analytics
    const totalLeads = await this.prisma.lead.count({ where: { organizationId } });
    
    // Group by Status (simulated as we might not have status enum, using string)
    // Prisma doesn't support easy groupBy on string fields without raw query in some versions or it returns array.
    // Let's use groupBy if available or multiple counts.
    const leadsByStatus = await this.prisma.lead.groupBy({
      by: ['status'],
      where: { organizationId },
      _count: { status: true },
    });

    const leadsBySource = await this.prisma.lead.groupBy({
      by: ['source'],
      where: { organizationId },
      _count: { source: true },
    });

    // 2. Activity Analytics (Meetings)
    const totalMeetings = await this.prisma.meeting.count({ where: { organizationId } });
    
    // 3. User Productivity (Leads per user)
    // This is expensive to do in one query without raw SQL or aggregation.
    // For now, let's get counts per ownerId
    const leadsByUser = await this.prisma.lead.groupBy({
      by: ['ownerId'],
      where: { organizationId },
      _count: { id: true },
    });
    
    // Map ownerId to User Name (need to fetch users)
    const users = await this.prisma.user.findMany({
      where: { organizationId },
      select: { id: true, fullName: true, email: true }
    });

    const userMap = new Map(users.map(u => [u.id, u.fullName || u.email]));

    const productivity = leadsByUser.map(item => ({
      user: userMap.get(item.ownerId || '') || 'Unassigned',
      leads: item._count.id,
    }));

    return {
      leads: {
        total: totalLeads,
        byStatus: leadsByStatus.map(s => ({ name: s.status || 'Unknown', value: s._count.status })),
        bySource: leadsBySource.map(s => ({ name: s.source || 'Unknown', value: s._count.source })),
      },
      activities: {
        totalMeetings,
      },
      productivity,
    };
  }

  async exportData(organizationId: string, type: ExportType, format: ExportFormat) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    let data: any[] = [];
    if (type === ExportType.LEADS) {
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 30 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Company', key: 'company', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Source', key: 'source', width: 15 },
        { header: 'Created At', key: 'createdAt', width: 20 },
      ];
      const leads = await this.prisma.lead.findMany({
        where: { organizationId },
        include: {} // Adjust based on schema
      });
      // Map leads to rows
      data = leads.map(l => ({
        id: l.id,
        name: l.firstName ? `${l.firstName} ${l.lastName}` : 'N/A', // Adjust based on Lead model
        company: l.company || 'N/A',
        email: l.email || 'N/A',
        status: l.status,
        source: l.source,
        createdAt: l.createdAt.toISOString(),
      }));
    } else if (type === ExportType.ACTIVITIES) {
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 30 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Date', key: 'startTime', width: 20 },
      ];
      const meetings = await this.prisma.meeting.findMany({ where: { organizationId } });
      data = meetings.map(m => ({
        id: m.id,
        title: m.title,
        status: m.status,
        startTime: m.startTime?.toISOString(),
      }));
    } else if (type === ExportType.USERS) {
       worksheet.columns = [
        { header: 'ID', key: 'id', width: 30 },
        { header: 'Name', key: 'fullName', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Department', key: 'department', width: 20 },
        { header: 'Access Level', key: 'accessLevel', width: 20 },
        { header: 'Last Login', key: 'lastLogin', width: 20 },
      ];
      const users = await this.prisma.user.findMany({ where: { organizationId } });
      data = users.map(u => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        department: u.department,
        accessLevel: u.accessLevel,
        lastLogin: u.lastLogin?.toISOString(),
      }));
    }

    worksheet.addRows(data);

    if (format === ExportFormat.CSV) {
      const buffer = await workbook.csv.writeBuffer();
      return buffer;
    } else {
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    }
  }
}
