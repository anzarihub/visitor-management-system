export type GrowthPeriod = '3m' | '6m' | '12m';

export type DepartmentTimeRange = '7days' | '30days' | '90days';

export type DateFilter =
   | 'all'
   | 'today'
   | 'yesterday'
   | 'last_7_days'
   | 'last_30_days'
   | 'this_month';

/**
 * Dashboard summary card data
 */
export type VisitStats = {
   totalVisits: number;
   totalVisitsChange: number;
   currentlyInside: number;
   averageVisitDuration: string;
   averageVisitDurationChange: number;
   overstays: number;
};

/**
 * Visit growth chart point
 */
export type VisitGrowthDataPoint = {
   year: string;
   month: string;
   week: number;
   visits: number;
};

/**
 * Department visits chart item
 */
export type DepartmentVisitDataPoint = {
   name: string;
   shortName?: string;
   value: number;
   color: string;
};

export type DepartmentVisitsData = {
   data: DepartmentVisitDataPoint[];
   total: number;
};
