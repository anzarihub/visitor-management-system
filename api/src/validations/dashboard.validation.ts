import { z } from 'zod';

export const dashboardStatsSchema = z.object({
   query: z.object({
      filter: z.enum([
         'all',
         'today',
         'yesterday',
         'last_7_days',
         'last_30_days',
         'this_month',
      ]),
   }),
});

export const visitGrowthSchema = z.object({
   query: z.object({
      period: z.enum(['3m', '6m', '12m']),
   }),
});

export const departmentVisitsSchema = z.object({
   query: z.object({
      range: z.enum(['7days', '30days', '90days']),
   }),
});

export type DashboardStatsQuery = z.infer<typeof dashboardStatsSchema>['query'];

export type VisitGrowthQuery = z.infer<typeof visitGrowthSchema>['query'];

export type DepartmentVisitsQuery = z.infer<
   typeof departmentVisitsSchema
>['query'];

export type DateFilter = DashboardStatsQuery['filter'];

export type GrowthPeriod = VisitGrowthQuery['period'];

export type DepartmentTimeRange = DepartmentVisitsQuery['range'];
