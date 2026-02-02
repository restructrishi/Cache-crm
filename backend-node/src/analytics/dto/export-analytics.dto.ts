import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ExportType {
  LEADS = 'leads',
  ACTIVITIES = 'activities',
  USERS = 'users',
}

export enum ExportFormat {
  CSV = 'csv',
  EXCEL = 'xlsx',
}

export class ExportAnalyticsDto {
  @IsEnum(ExportType)
  type: ExportType;

  @IsEnum(ExportFormat)
  format: ExportFormat;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
