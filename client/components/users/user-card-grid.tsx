'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useUsers } from '@/hooks/use-users';
import { UserCard } from './user-card';

function UserCardSkeleton() {
   return (
      <div className="rounded-xl border bg-card p-4 flex flex-col gap-4">
         <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-full" />
            <div className="flex flex-col gap-1.5">
               <Skeleton className="h-4 w-28" />
               <Skeleton className="h-3 w-20" />
            </div>
         </div>
         <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
         </div>
         <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
         </div>
         <Skeleton className="h-3 w-36" />
      </div>
   );
}

export function UserCardGrid() {
   const { data: users, isLoading, isError } = useUsers();

   if (isLoading) {
      return (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
               <UserCardSkeleton key={i} />
            ))}
         </div>
      );
   }

   if (isError) {
      return (
         <p className="text-sm text-destructive">
            Failed to load users. Please refresh the page.
         </p>
      );
   }

   if (!users?.length) {
      return <p className="text-sm text-muted-foreground">No users found.</p>;
   }

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {users.map((user) => (
            <UserCard key={user.id} user={user} />
         ))}
      </div>
   );
}
