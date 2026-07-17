'use client';

import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import type { Visit } from '@/types/visit.types';
import { VisitActionsMenu } from './visit-actions-menu';

interface VisitRowActionsProps {
   visit: Visit;
   onViewDetails: (visit: Visit) => void;
}

export function VisitRowActions({
   visit,
   onViewDetails,
}: VisitRowActionsProps) {
   return (
      <VisitActionsMenu
         visit={visit}
         onViewDetails={onViewDetails}
         align="end"
         trigger={
            <Button variant="ghost" className="h-8 w-8 p-0">
               <span className="sr-only">Open menu</span>
               <MoreHorizontal className="h-4 w-4" />
            </Button>
         }
      />
   );
}
