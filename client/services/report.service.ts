import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import type {
   ExportVisitLogParams,
   ReportStatsData,
} from '@/types/report.types';

export const reportService = {
   getStats() {
      return api.get<ApiResponse<ReportStatsData>>('/reports/stats');
   },
   exportVisitLog(params: ExportVisitLogParams) {
      return api.get<Blob>('/reports/export', { params, responseType: 'blob' });
   },
};
