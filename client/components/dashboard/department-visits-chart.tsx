'use client';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDepartmentVisits } from '@/hooks/use-dashboard';
import type { DepartmentTimeRange } from '@/types/dashboard.types';
import { Briefcase, MoreHorizontal, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';
import { Skeleton } from '../ui/skeleton';

const timeRangeLabels: Record<DepartmentTimeRange, string> = {
   '7days': 'Last 7 days',
   '30days': 'Last 30 days',
   '90days': 'Last 90 days',
};

const renderActiveShape = (props: unknown) => {
   const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props as {
         cx: number;
         cy: number;
         innerRadius: number;
         outerRadius: number;
         startAngle: number;
         endAngle: number;
         fill: string;
      };
   return (
      <g>
         <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 8}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
         />
      </g>
   );
};

function DepartmentChartSkeleton() {
   return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-xl border bg-card w-full xl:w-102.5">
         <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="size-8" />
         </div>
         <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Skeleton className="size-55 rounded-full shrink-0" />
            <div className="flex-1 w-full grid gap-4">
               {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4" />
               ))}
            </div>
         </div>
      </div>
   );
}

export function DepartmentVisitsChart() {
   const [timeRange, setTimeRange] = useState<DepartmentTimeRange>('30days');
   const [activeIndex, setActiveIndex] = useState<number | null>(null);
   const [showLabels, setShowLabels] = useState(true);

   const {
      data: chartData,
      isPending,
      isError,
   } = useDepartmentVisits(timeRange);

   if (isPending) return <DepartmentChartSkeleton />;

   if (isError) {
      return (
         <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-xl border bg-card w-full xl:w-102.5 items-center justify-center text-sm text-destructive">
            Failed to load department data.
         </div>
      );
   }

   const data = chartData.data;
   const total = chartData.total;

   return (
      <div className="flex flex-col gap-4 p-4 sm:p-6 rounded-xl border bg-card w-full xl:w-102.5">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-2.5">
               <Button
                  variant="outline"
                  size="icon"
                  className="size-7 sm:size-8"
               >
                  <Briefcase className="size-4 sm:size-4.5 text-muted-foreground" />
               </Button>
               <span className="text-sm sm:text-base font-medium">
                  Department Visits
               </span>
            </div>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant="ghost"
                     size="icon"
                     className="size-7 sm:size-8"
                  >
                     <MoreHorizontal className="size-4 text-muted-foreground" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-45">
                  <DropdownMenuLabel>Time Range</DropdownMenuLabel>
                  {(Object.keys(timeRangeLabels) as DepartmentTimeRange[]).map(
                     (range) => (
                        <DropdownMenuCheckboxItem
                           key={range}
                           checked={timeRange === range}
                           onCheckedChange={() => setTimeRange(range)}
                        >
                           {timeRangeLabels[range]}
                        </DropdownMenuCheckboxItem>
                     ),
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Display Options</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                     checked={showLabels}
                     onCheckedChange={setShowLabels}
                  >
                     Show labels
                  </DropdownMenuCheckboxItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative shrink-0 size-55">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="42%"
                        outerRadius="70%"
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                        activeIndex={
                           activeIndex !== null ? activeIndex : undefined
                        }
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                     >
                        {data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg sm:text-xl font-semibold">
                     {total.toLocaleString()}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                     Total Visits
                  </span>
               </div>
            </div>

            {showLabels && (
               <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-4">
                  {data.map((item, index) => (
                     <div
                        key={item.name}
                        className={`flex items-center gap-2 sm:gap-2.5 cursor-pointer transition-opacity ${
                           activeIndex !== null && activeIndex !== index
                              ? 'opacity-50'
                              : ''
                        }`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                     >
                        <div
                           className="w-1 h-4 sm:h-5 rounded-sm shrink-0"
                           style={{ backgroundColor: item.color }}
                        />
                        <span className="flex-1 text-xs sm:text-sm text-muted-foreground truncate">
                           {item.shortName ?? item.name}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold tabular-nums">
                           {item.value}
                        </span>
                     </div>
                  ))}
               </div>
            )}
         </div>

         <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Settings2 className="size-3" />
            <span>{timeRangeLabels[timeRange]}</span>
         </div>
      </div>
   );
}
