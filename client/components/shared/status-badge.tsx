import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

export type Status =
   | 'active'
   | 'completed'
   | 'cancelled'
   | 'overstay'
   | 'inactive';

const statusConfig: Record<
   Status,
   {
      label: string;
      bg: string;
      text: string;
      border: string;
   }
> = {
   active: {
      label: 'Active',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
   },
   completed: {
      label: 'Completed',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
   },
   cancelled: {
      label: 'Cancelled',
      bg: 'bg-red-50 dark:bg-red-950/30',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
   },
   inactive: {
      label: 'Inactive',
      bg: 'bg-red-50 dark:bg-red-950/30',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
   },
   overstay: {
      label: 'Overstay',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
   },
};

export function StatusBadge({ status }: { status: Status }) {
   const config = statusConfig[status];

   return (
      <Badge
         variant="outline"
         className={cn('py-0', config.bg, config.text, config.border)}
      >
         {config.label}
      </Badge>
   );
}
