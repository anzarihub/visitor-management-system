import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth-server';
import { canAccess } from '@/lib/access';
import { SettingsTabs } from '@/components/settings/settings-tabs';

export default async function SettingsPage() {
   const user = await getServerUser();

   if (!user || !canAccess(user.role, 'settings')) {
      redirect('/');
   }

   return (
      <div className="p-3 sm:p-4 md:p-6 bg-background">
         <SettingsTabs />
      </div>
   );
}
