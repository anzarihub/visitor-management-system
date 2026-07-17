import {
   differenceInCalendarDays,
   differenceInMinutes,
   formatDistanceToNow,
} from 'date-fns';

export function formatLastLogin(lastLoginAt?: string | Date | null): string {
   if (!lastLoginAt) return 'never logged in';

   const date = new Date(lastLoginAt);
   const minutesAgo = differenceInMinutes(new Date(), date);
   const daysAgo = differenceInCalendarDays(new Date(), date);

   if (minutesAgo < 1) return 'Just now';
   if (daysAgo === 1) return 'Yesterday';

   return formatDistanceToNow(date, { addSuffix: true });
}
