'use client';

import { format } from 'date-fns';
import {
   Briefcase,
   Calendar,
   CircleDashed,
   Contact,
   Ellipsis,
   IdCard,
   Phone,
   Ticket,
   User,
} from 'lucide-react';
import Image from 'next/image';

import { StatusBadge } from '../shared/status-badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
   Sheet,
   SheetClose,
   SheetContent,
   SheetDescription,
   SheetFooter,
   SheetHeader,
   SheetTitle,
} from '../ui/sheet';
import { VisitActionsMenu } from './visit-actions-menu';
import { VisitTimeline } from './visit-timeline';
import { useVisit } from '@/hooks/use-visits';
import { Skeleton } from '../ui/skeleton';

type VisitDetailsProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   visitId: number | null;
};

function VisitDetailsSkeleton() {
   return (
      <div className="flex flex-col gap-4 p-4 pt-0 animate-pulse">
         <div className="flex flex-col gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
               <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Skeleton className="size-8 rounded-lg" />
                     <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24" />
               </div>
            ))}
         </div>
         <Separator />
         <Skeleton className="h-16 w-full rounded-lg" />
         <Separator />
         <Skeleton className="h-24 w-full rounded-lg" />
      </div>
   );
}

function formatIdType(idType: string) {
   return idType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

const VisitDetails = ({ open, onOpenChange, visitId }: VisitDetailsProps) => {
   const { data: visit, isLoading, isError } = useVisit(visitId!);

   return (
      <Sheet open={open} onOpenChange={onOpenChange}>
         <SheetContent
            showCloseButton={false}
            className="inset-y-5 right-5 h-auto rounded-xl overflow-y-auto"
         >
            <SheetHeader className="pb-0">
               <SheetTitle className="sr-only" />
               <SheetDescription className="sr-only" />

               <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                     <Image
                        src="/visitor.svg"
                        alt="Profile picture"
                        width={44}
                        height={44}
                        className="rounded-full size-11 border-2 border-border"
                     />
                     <div>
                        {isLoading ? (
                           <Skeleton className="h-4 w-32" />
                        ) : (
                           <p className="text-sm font-semibold">
                              {visit?.visitorName}
                           </p>
                        )}
                     </div>
                  </div>

                  {visit && (
                     <VisitActionsMenu
                        visit={visit}
                        align="end"
                        trigger={
                           <Button variant="ghost" size="sm">
                              <Ellipsis />
                           </Button>
                        }
                     />
                  )}
               </div>
               <Separator className="mt-2" />
            </SheetHeader>

            {/* Body */}
            {isLoading ? (
               <VisitDetailsSkeleton />
            ) : isError || !visit ? (
               <div className="p-4 text-sm text-destructive text-center">
                  Failed to load visit details. Please try again.
               </div>
            ) : (
               <div className="flex flex-col gap-4 p-4 pt-0">
                  {/* Visit info rows */}
                  <div className="flex flex-col gap-3">
                     <h4 className="font-semibold text-sm">
                        Visit Information
                     </h4>

                     {[
                        { icon: User, label: 'Name', value: visit.visitorName },
                        {
                           icon: Phone,
                           label: 'Phone',
                           value: visit.phone || 'N/A',
                        },
                        { icon: IdCard, label: 'Id', value: visit.idNumber },
                        {
                           icon: IdCard,
                           label: 'Id Type',
                           value: formatIdType(visit.idType),
                        },
                        {
                           icon: CircleDashed,
                           label: 'Status',
                           value: <StatusBadge status={visit.status} />,
                        },
                        { icon: Ticket, label: 'Badge', value: visit.badge },
                        {
                           icon: Contact,
                           label: 'Host',
                           value: visit.host || 'N/A',
                        },
                        {
                           icon: Briefcase,
                           label: 'Department',
                           value: visit.department?.name || 'N/A',
                        },
                        {
                           icon: Calendar,
                           label: 'Date',
                           value: format(
                              new Date(visit.checkInTime),
                              'dd MMM, yyyy',
                           ).toUpperCase(),
                        },
                     ].map(({ icon: Icon, label, value }) => (
                        <div
                           key={label}
                           className="flex items-center justify-between text-sm"
                        >
                           <div className="flex items-center gap-2 text-muted-foreground">
                              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                                 <Icon className="size-4" />
                              </div>
                              <span>{label}</span>
                           </div>
                           <span>{value}</span>
                        </div>
                     ))}
                  </div>

                  <Separator />

                  {/* Note */}
                  <div className="rounded-lg bg-muted p-2">
                     <p className="text-base font-semibold">Note</p>
                     <p className="text-xs text-muted-foreground">
                        {visit.note ?? 'No note was added for this visit.'}
                     </p>
                  </div>

                  <Separator />

                  {/* Timeline */}
                  <div className="flex flex-col gap-3">
                     <h4 className="font-semibold text-sm">
                        Activity Timeline
                     </h4>
                     <VisitTimeline
                        status={visit.status}
                        checkInTime={visit.checkInTime}
                        checkOutTime={visit.checkOutTime}
                        cancelledAt={visit.cancelledAt}
                     />
                  </div>
               </div>
            )}

            <SheetFooter>
               <SheetClose asChild>
                  <Button variant="outline">Close</Button>
               </SheetClose>
            </SheetFooter>
         </SheetContent>
      </Sheet>
   );
};

export default VisitDetails;
