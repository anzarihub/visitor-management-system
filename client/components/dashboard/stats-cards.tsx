'use client';

import {
   Timer,
   TrendingDown,
   TrendingUp,
   TriangleAlert,
   UserPlus,
   Users,
} from 'lucide-react';
import { useVisitStats } from '@/hooks/use-dashboard';
import type { DateFilter, VisitStats } from '@/types/dashboard.types';
import { Skeleton } from '@/components/ui/skeleton';
import { Pill, PillIndicator, PillStatus } from '../ui/pill';

const filterLabelMap: Record<DateFilter, string> = {
   all: 'All Time',
   today: 'Today',
   yesterday: 'Yesterday',
   last_7_days: 'Last 7 days',
   last_30_days: 'Last 30 days',
   this_month: 'This month',
};

const comparisonLabelMap: Record<DateFilter, string> = {
   all: 'Average across all time',
   today: 'vs yesterday',
   yesterday: 'vs day before',
   last_7_days: 'vs previous 7 days',
   last_30_days: 'vs previous 30 days',
   this_month: 'Average for this month',
};

function buildStats(data: VisitStats, dateFilter: DateFilter) {
   const comparisonLabel = comparisonLabelMap[dateFilter];
   const durationChange =
      dateFilter === 'all' || dateFilter === 'this_month'
         ? 0
         : data.averageVisitDurationChange;

   return [
      {
         title: 'Total Visits',
         value: data.totalVisits.toLocaleString(),
         subtitle: `During ${filterLabelMap[dateFilter]}`,
         icon: Users,
         showTrend: true,
         trendValue: data.totalVisitsChange,
         isLive: false,
      },
      {
         title: 'Currently Inside',
         value: data.currentlyInside.toLocaleString(),
         subtitle: 'Currently Inside Building',
         icon: UserPlus,
         showTrend: false,
         trendValue: 0,
         isLive: true,
      },
      {
         title: 'Average Visit Duration',
         value: data.averageVisitDuration,
         subtitle: comparisonLabel,
         trendValue: durationChange,
         icon: Timer,
         showTrend: false,
         isLive: false,
      },
      {
         title: 'Overstays',
         value: data.overstays.toLocaleString(),
         subtitle: 'Exceeded Visit Limit',
         icon: TriangleAlert,
         showTrend: false,
         trendValue: 0,
         isLive: true,
      },
   ];
}

function StatsSkeleton() {
   return (
      <div className="bg-card text-card-foreground rounded-xl border">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-x-0 lg:divide-x sm:divide-y-0 divide-border">
            {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="p-4 flex flex-col gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-40" />
               </div>
            ))}
         </div>
      </div>
   );
}

interface StatsCardsProps {
   dateFilter: DateFilter;
}

export function StatsCards({ dateFilter }: StatsCardsProps) {
   const { data, isPending, isError } = useVisitStats(dateFilter);

   if (isPending) return <StatsSkeleton />;

   if (isError) {
      return (
         <div className="bg-card rounded-xl border p-4 text-sm text-destructive">
            Failed to load stats. Please refresh the page.
         </div>
      );
   }

   const stats = buildStats(data, dateFilter);

   return (
      <div className="bg-card text-card-foreground rounded-xl border">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-x-0 lg:divide-x sm:divide-y-0 divide-border">
            {stats.map((stat, index) => (
               <div key={index} className="p-4 flex flex-col gap-4">
                  <div
                     className={`flex items-center gap-1.5 py-1 ${
                        stat.title === 'Overstays'
                           ? 'bg-destructive/10 text-destructive/80 rounded-full px-2 w-max'
                           : stat.isLive
                             ? 'w-max text-muted-foreground'
                             : 'text-muted-foreground'
                     }`}
                  >
                     <stat.icon className="size-4 sm:size-4.5" />
                     <span className="text-xs sm:text-sm font-medium">
                        {stat.title}
                     </span>
                     {stat.showTrend && (
                        <div className="flex items-center ml-auto gap-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 ">
                           <TrendingUp size={14} />
                           {stat.trendValue >= 0 ? '+' : ''}
                           {stat.trendValue}%
                        </div>
                     )}
                     {stat.isLive && (
                        <Pill
                           variant="secondary"
                           className="ml-1 gap-1.5 px-2 py-0.5"
                        >
                           <PillIndicator
                              variant={
                                 stat.title === 'Overstays' ? 'error' : 'info'
                              }
                              pulse
                           />
                           <span className="text-[10px] font-medium uppercase tracking-wide">
                              Live
                           </span>
                        </Pill>
                     )}
                  </div>
                  <p className="text-2xl font-semibold tracking-tight">
                     {stat.value}
                  </p>
                  {stat.title === 'Average Visit Duration' ? (
                     <div className="hidden sm:flex items-center gap-1 -mt-3">
                        {stat.trendValue !== 0 &&
                           (stat.trendValue > 0 ? (
                              <TrendingUp
                                 className="size-3 text-emerald-500"
                                 aria-hidden="true"
                              />
                           ) : (
                              <TrendingDown
                                 className="size-3 text-red-500"
                                 aria-hidden="true"
                              />
                           ))}
                        <span
                           className={`text-[13px] font-medium ${
                              stat.trendValue === 0
                                 ? 'text-muted-foreground'
                                 : stat.trendValue > 0
                                   ? 'text-emerald-600 dark:text-emerald-400'
                                   : 'text-red-600 dark:text-red-400'
                           }`}
                        >
                           {stat.trendValue !== 0 &&
                              (stat.trendValue > 0 ? '+' : '')}
                           {stat.trendValue !== 0 ? `${stat.trendValue} ` : ''}
                           {stat.subtitle}
                        </span>
                     </div>
                  ) : (
                     <p className="text-[13px] font-medium text-muted-foreground hidden sm:inline -mt-3">
                        {stat.subtitle}
                     </p>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
}
