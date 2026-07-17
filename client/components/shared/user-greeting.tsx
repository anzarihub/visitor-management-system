'use client';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { format } from 'date-fns';

interface GreetingProps {
   className?: string;
   showEmoji?: boolean;
}

export function UserGreeting({ className, showEmoji = true }: GreetingProps) {
   const user = useAuthStore((state) => state.user);
   const hour = new Date().getHours();

   const greeting =
      hour < 12
         ? 'Good morning'
         : hour < 17
           ? 'Good afternoon'
           : 'Good evening';

   // Falls back gracefully if the store hasn't hydrated yet (e.g. on first
   // paint before /auth/me resolves) rather than rendering "undefined".
   const displayName = user?.firstName ?? 'there';

   return (
      <div>
         <h1
            className={cn('text-[17px] font-semibold leading-tight', className)}
         >
            {greeting}, {displayName}
            {showEmoji && ' 👋'}
         </h1>

         <p className="mt-0.5 text-xs text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d')}
         </p>
      </div>
   );
}
