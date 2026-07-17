import { AlertTriangle, BadgeCheck, Clock3, XCircle } from 'lucide-react';
import { differenceInMinutes, format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { VisitStatus } from '@/types/visit.types';

type TimelineEvent = {
   title: string;
   description?: string;
   time: string;
   icon: React.ElementType;
};

interface VisitTimelineProps {
   status: VisitStatus;
   checkInTime: string; // ISO
   checkOutTime?: string; // ISO
   cancelledAt?: string; // ISO
}

const statusClasses: Record<VisitStatus, string> = {
   active:
      'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
   completed:
      'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
   cancelled:
      'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
   overstay:
      'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
};

const checkedInClasses = 'bg-gray-100 text-gray-700 border-gray-300';

const fmtTime = (iso: string) => format(new Date(iso), 'h:mm a');

export function formatDuration(start: Date, end: Date): string {
   const totalMinutes = differenceInMinutes(end, start);
   const hours = Math.floor(totalMinutes / 60);
   const minutes = totalMinutes % 60;

   if (hours === 0) return `${minutes}m`;
   if (minutes === 0) return `${hours}h`;
   return `${hours}h ${minutes}m`;
}

export function VisitTimeline({
   status,
   checkInTime,
   checkOutTime,
   cancelledAt,
}: VisitTimelineProps) {
   const checkIn = new Date(checkInTime);

   const events: TimelineEvent[] = [
      {
         title: 'Checked In',
         time: fmtTime(checkInTime),
         icon: BadgeCheck,
      },
   ];

   switch (status) {
      case 'active': {
         events.push({
            title: 'Currently Active',
            description: `${formatDuration(checkIn, new Date())} so far`,
            time: 'Live',
            icon: Clock3,
         });
         break;
      }

      case 'completed': {
         const checkOut = checkOutTime ? new Date(checkOutTime) : new Date();
         events.push({
            title: 'Checked Out',
            description: formatDuration(checkIn, checkOut),
            time: checkOutTime ? fmtTime(checkOutTime) : '',
            icon: BadgeCheck,
         });
         break;
      }

      case 'cancelled': {
         events.push({
            title: 'Visit Cancelled',
            time: cancelledAt ? fmtTime(cancelledAt) : '',
            icon: XCircle,
         });
         break;
      }

      case 'overstay': {
         const now = new Date();
         events.push({
            title: 'Overstay Detected',
            description: `${formatDuration(checkIn, now)} and counting`,
            time: format(now, 'h:mm a'),
            icon: AlertTriangle,
         });
         break;
      }
   }

   return (
      <div>
         {events.map((event, index) => {
            const Icon = event.icon;
            const isLast = index === events.length - 1;
            const isStatusEvent = index === 1;

            const iconClasses = isStatusEvent
               ? statusClasses[status]
               : checkedInClasses;

            const isActive =
               status === 'active' && event.title === 'Currently Active';

            return (
               <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                     <div
                        className={cn(
                           'flex size-8 shrink-0 items-center justify-center rounded-full border',
                           iconClasses,
                        )}
                     >
                        {isActive ? (
                           <div className="relative">
                              <div
                                 className="absolute inset-0 rounded-full 
                                 bg-green-500
                                 animate-ping"
                              />
                              <div className="relative size-2 rounded-full bg-green-500" />
                           </div>
                        ) : (
                           <Icon className="size-4" />
                        )}
                     </div>

                     {!isLast && (
                        <div className="w-px flex-1 bg-border shrink-0" />
                     )}
                  </div>

                  <div className="pb-4">
                     <p className="text-sm font-medium">{event.title}</p>

                     {event.description && (
                        <p className="text-xs text-muted-foreground">
                           {event.description}
                        </p>
                     )}

                     <p className="mt-1 text-xs text-muted-foreground">
                        {event.time}
                     </p>
                  </div>
               </div>
            );
         })}
      </div>
   );
}
