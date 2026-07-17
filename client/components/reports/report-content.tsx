'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportVisitLogDialog } from './export-visit-log-dialog';
import { ReportStatsCards } from './report-stats-cards';
import { UserGreeting } from '../shared/user-greeting';

export function ReportContent() {
   return (
      <main className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background w-full">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <UserGreeting />
            <ExportVisitLogDialog
               trigger={
                  <Button variant="outline" className="gap-2">
                     <Download className="size-4" />
                     Download Report
                  </Button>
               }
            />
         </div>
         <ReportStatsCards />
      </main>
   );
}
