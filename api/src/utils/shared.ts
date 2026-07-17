import { differenceInMinutes } from 'date-fns';

// Calculates average visit duration
export function calculateAverageDuration(
   visits: {
      checkedInAt: Date;
      checkedOutAt: Date | null;
   }[],
) {
   if (!visits.length) {
      return 0;
   }

   const total = visits.reduce(
      (sum, visit) =>
         sum +
         differenceInMinutes(visit.checkedOutAt as Date, visit.checkedInAt),
      0,
   );

   return total / visits.length;
}

// Converts minutes into readable text
export function formatVisitDuration(minutes: number) {
   if (minutes < 60) {
      return `${Math.round(minutes)} min`;
   }

   const hours = Math.floor(minutes / 60);

   const remainingMinutes = Math.round(minutes % 60);

   return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
}
