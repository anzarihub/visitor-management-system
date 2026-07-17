'use client';

import { BarChart3, CalendarDays, Clock, TrendingUp } from 'lucide-react';
import { useReportStats } from '@/hooks/use-report';
import type { ReportStatsData } from '@/types/report.types';
import { Skeleton } from '@/components/ui/skeleton';

function buildReportStats(data: ReportStatsData) {
   return [
      {
         title: data.periodLabel,
         value: data.totalVisits.toLocaleString(),
         subtitle: 'Total visits',
         icon: TrendingUp,
      },
      {
         title: 'Daily average',
         value: data.dailyAverage.toLocaleString(),
         subtitle: 'Visitors per day',
         icon: BarChart3,
      },
      {
         title: 'Peak day',
         value: data.peakDay.count.toLocaleString(),
         subtitle: data.peakDay.label,
         icon: CalendarDays,
      },
      {
         title: 'Avg. duration',
         value: `${data.averageVisitDuration}`,
         subtitle: data.periodLabel,
         icon: Clock,
      },
   ];
}

function ReportStatsSkeleton() {
   return (
      <div className="bg-card text-card-foreground rounded-xl border">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-x-0 lg:divide-x sm:divide-y-0 divide-border">
            {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="p-4 flex flex-col gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-28" />
               </div>
            ))}
         </div>
      </div>
   );
}

export function ReportStatsCards() {
   const { data, isPending, isError } = useReportStats();

   if (isPending) return <ReportStatsSkeleton />;

   if (isError) {
      return (
         <div className="bg-card rounded-xl border p-4 text-sm text-destructive">
            Failed to load report stats. Please refresh the page.
         </div>
      );
   }

   const stats = buildReportStats(data);

   return (
      <div className="bg-card text-card-foreground rounded-xl border">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-x-0 lg:divide-x sm:divide-y-0 divide-border">
            {stats.map((stat, index) => (
               <div key={index} className="p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-1.5 py-1 text-muted-foreground">
                     <stat.icon className="size-4 sm:size-4.5" />
                     <span className="text-xs sm:text-sm font-medium">
                        {stat.title}
                     </span>
                  </div>
                  <p className="text-2xl font-semibold tracking-tight">
                     {stat.value}
                  </p>
                  <p className="sm:text-sm text-muted-foreground hidden sm:inline -mt-3">
                     {stat.subtitle}
                  </p>
               </div>
            ))}
         </div>
      </div>
   );
}
