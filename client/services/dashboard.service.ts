import { api } from '@/lib/axios'; // your shared api client
import type { ApiResponse } from '@/types/api.types';
import type {
   DateFilter,
   DepartmentTimeRange,
   DepartmentVisitsData,
   GrowthPeriod,
   VisitGrowthDataPoint,
   VisitStats,
} from '@/types/dashboard.types';

export const dashboardService = {
   getStats(filter: DateFilter) {
      return api.get<ApiResponse<VisitStats>>('/dashboard/stats', {
         params: { filter },
      });
   },

   getVisitGrowth(period: GrowthPeriod) {
      return api.get<ApiResponse<VisitGrowthDataPoint[]>>(
         '/dashboard/visit-growth',
         {
            params: { period },
         },
      );
   },

   getDepartmentVisits(range: DepartmentTimeRange) {
      return api.get<ApiResponse<DepartmentVisitsData>>(
         '/dashboard/department-visits',
         {
            params: { range },
         },
      );
   },
};
