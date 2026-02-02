import { Controller, Get, Query, Res, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { ExportAnalyticsDto, ExportFormat } from './dto/export-analytics.dto';
import { Response } from 'express';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardStats(@Request() req) {
    return this.analyticsService.getDashboardStats(req.user.organizationId);
  }

  @Get('export')
  async exportData(@Query() query: ExportAnalyticsDto, @Request() req, @Res() res) {
    const { type, format } = query;
    const organizationId = req.user.organizationId;
    const buffer = await this.analyticsService.exportData(organizationId, type, format);
    
    if (query.format === ExportFormat.CSV) {
      res.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${query.type}_report.csv"`,
      });
    } else {
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${query.type}_report.xlsx"`,
      });
    }
    
    res.send(buffer);
  }
}
