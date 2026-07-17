import { VisitsTable } from '@/components/visits/visits-table';
import { VisitsTableSkeleton } from '@/components/visits/visits-table-skeleton';
import VisitsToolbar from '@/components/visits/visits-toolbar';
import { Suspense } from 'react';

export default function VisitsPage() {
   return (
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background w-full">
         <VisitsToolbar />
         <Suspense fallback={<VisitsTableSkeleton rows={10} />}>
            <VisitsTable />
         </Suspense>
      </div>
   );
}
