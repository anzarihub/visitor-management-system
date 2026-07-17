import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import type {
   DateFilter,
   DepartmentTimeRange,
   GrowthPeriod,
} from '@/types/dashboard.types';

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const dashboardQueryKeys = {
   all: ['dashboard'] as const,
   stats: (filter: DateFilter) =>
      [...dashboardQueryKeys.all, 'stats', filter] as const,
   statsAll: () => [...dashboardQueryKeys.all, 'stats'] as const,
   growth: (period: GrowthPeriod) =>
      [...dashboardQueryKeys.all, 'growth', period] as const,
   departments: (range: DepartmentTimeRange) =>
      [...dashboardQueryKeys.all, 'departments', range] as const,
   departmentsAll: () => [...dashboardQueryKeys.all, 'departments'] as const,
};

// ─── Stats hook (driven by global date filter from the store) ────────────────────────────────────────────────────────────────

export function useVisitStats(filter: DateFilter) {
   return useQuery({
      queryKey: dashboardQueryKeys.stats(filter),
      queryFn: async () => {
         const { data } = await dashboardService.getStats(filter);
         return data.data;
      },
   });
}

// ─── Growth chart hook ────────────────────────────────────────────────────────────────

export function useVisitGrowth(period: GrowthPeriod) {
   return useQuery({
      queryKey: dashboardQueryKeys.growth(period),
      queryFn: async () => {
         const { data } = await dashboardService.getVisitGrowth(period);
         return data.data;
      },
   });
}

// ─── Department visits chart hook────────────────────────────────────────────────────────────────

export function useDepartmentVisits(range: DepartmentTimeRange) {
   return useQuery({
      queryKey: dashboardQueryKeys.departments(range),
      queryFn: async () => {
         const { data } = await dashboardService.getDepartmentVisits(range);
         return data.data;
      },
   });
}
