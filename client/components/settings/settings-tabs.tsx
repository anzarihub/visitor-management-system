'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsWithStatus } from '@/hooks/use-settings';
import { GeneralTab } from './general-tab';
import { OverviewTab } from './overview-tab';

function SettingsSkeleton() {
   return (
      <div className="max-w-4xl space-y-4 p-6">
         <Skeleton className="h-6 w-40" />
         <Skeleton className="h-4 w-72" />
         <div className="space-y-3 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
               <Skeleton key={i} className="h-10 w-full" />
            ))}
         </div>
      </div>
   );
}

export function SettingsTabs() {
   const { data: settings, isError, isLoading } = useSettingsWithStatus();

   return (
      <Tabs defaultValue="general" className="w-full">
         <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
         </TabsList>

         {isLoading ? (
            <SettingsSkeleton />
         ) : isError || !settings ? (
            <p className="p-6 text-sm text-destructive">
               Failed to load settings. Please refresh the page.
            </p>
         ) : (
            <>
               <TabsContent value="general">
                  <GeneralTab settings={settings} />
               </TabsContent>

               <TabsContent value="overview">
                  <OverviewTab settings={settings} />
               </TabsContent>
            </>
         )}
      </Tabs>
   );
}
