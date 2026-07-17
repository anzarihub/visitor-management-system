import { startOfDay, startOfMonth, subDays } from 'date-fns';

import type { DateRange } from '../types/dashboard.types.js';
import type { DateFilter } from '../validations/dashboard.validation.js';

export function getDateRanges(filter: DateFilter): {
   current: DateRange | null;
   previous: DateRange | null;
} {
   const now = new Date();

   const todayStart = startOfDay(now);

   if (filter === 'all') {
      return {
         current: null,
         previous: null,
      };
   }

   if (filter === 'yesterday') {
      const start = subDays(todayStart, 1);

      const end = todayStart;

      return {
         current: {
            start,
            end,
         },

         previous: {
            start: subDays(start, 1),
            end: start,
         },
      };
   }

   const start =
      filter === 'today'
         ? todayStart
         : filter === 'last_7_days'
           ? subDays(todayStart, 7)
           : filter === 'last_30_days'
             ? subDays(todayStart, 30)
             : startOfMonth(now);

   const end = now;

   const duration = end.getTime() - start.getTime();

   return {
      current: {
         start,
         end,
      },

      previous: {
         start: new Date(start.getTime() - duration),

         end: start,
      },
   };
}

// Calculates percentage difference
export function percentChange(current: number, previous: number) {
   if (previous === 0) {
      return current > 0 ? 100 : 0;
   }

   return Math.round(((current - previous) / previous) * 100);
}

// Creates date range start for chart filters
export function getRangeStart(days: number) {
   return subDays(startOfDay(new Date()), days);
}

export function minuteDifference(current: number, previous: number) {
   return Math.round(current - previous);
}
