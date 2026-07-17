'use client';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DateFilter } from '@/types/dashboard.types';
import { CalendarDays, ChevronDown } from 'lucide-react';

const dateFilterLabels: Record<DateFilter, string> = {
   all: 'All Time',
   today: 'Today',
   yesterday: 'Yesterday',
   last_7_days: 'Last 7 Days',
   last_30_days: 'Last 30 Days',
   this_month: 'This Month',
};

interface FilterSectionProps {
   dateFilter: DateFilter;
   setDateFilter: (filter: DateFilter) => void;
}

export function FilterSection({
   dateFilter,
   setDateFilter,
}: FilterSectionProps) {
   return (
      <div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="outline" className="gap-2">
                  <CalendarDays />
                  <span>{dateFilterLabels[dateFilter]}</span>
                  <ChevronDown className="size-4 text-muted-foreground" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
               {Object.entries(dateFilterLabels).map(([key, label]) => (
                  <DropdownMenuItem
                     key={key}
                     onClick={() => setDateFilter(key as DateFilter)}
                     className={dateFilter === key ? 'bg-accent' : ''}
                  >
                     {label}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
}
