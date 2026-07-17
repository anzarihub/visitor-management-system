export type ExportPeriod = '7d' | '30d' | '3m' | '6m' | 'all' | 'custom';
export type ExportFormat = 'csv';

export interface ReportStatsData {
   periodLabel: string; // e.g. "This month", always current month from backend
   totalVisits: number;
   dailyAverage: number;
   peakDay: {
      count: number;
      date: string;
      label: string; // e.g. "Mon May 5"
   };
   averageVisitDuration: number;
}

export type ExportVisitLogParams = {
   period: ExportPeriod;
   departmentId?: number;
   from?: string; // ISO date
   to?: string; // ISO date
};
