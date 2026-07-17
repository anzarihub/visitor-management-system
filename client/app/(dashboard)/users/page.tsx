import { redirect } from 'next/navigation';
import { UserCardGrid } from '@/components/users/user-card-grid';
import UsersToolbar from '@/components/users/users-toolbar';
import { canAccess } from '@/lib/access';
import { getServerUser } from '@/lib/auth-server';

export default async function UsersPage() {
   const user = await getServerUser();

   if (!user || !canAccess(user.role, 'users')) {
      redirect('/');
   }

   return (
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background w-full">
         <UsersToolbar />
         <UserCardGrid />
      </div>
   );
}
