'use client';

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   useCancelVisit,
   useCheckOutVisit,
   useCheckOutVisitById,
} from '@/hooks/use-visits';
import type { Visit } from '@/types/visit.types';
import { Copy, Eye, LogOut, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

interface VisitActionsMenuProps {
   visit: Visit;
   trigger: React.ReactNode;
   align?: 'start' | 'end';

   onViewDetails?: (visit: Visit) => void;
   onCheckOutSuccess?: () => void;
   onCancelSuccess?: () => void;
}

export function VisitActionsMenu({
   visit,
   trigger,
   align = 'end',
   onViewDetails,
   onCheckOutSuccess,
   onCancelSuccess,
}: VisitActionsMenuProps) {
   const [checkOutOpen, setCheckOutOpen] = React.useState(false);
   const [cancelOpen, setCancelOpen] = React.useState(false);

   const { mutate: checkOut, isPending: isCheckingOut } =
      useCheckOutVisitById();
   const { mutate: cancelVisit, isPending: isCancelling } = useCancelVisit();

   const isFinal = visit.status === 'completed' || visit.status === 'cancelled';

   const handleCheckOut = () => {
      checkOut(visit.id, {
         onSuccess: () => {
            toast.success(`${visit.visitorName} checked out`);
            setCheckOutOpen(false);
            onCheckOutSuccess?.();
         },
         onError: () =>
            toast.error('Failed to check out visitor. Please try again.'),
      });
   };

   const handleCancel = () => {
      cancelVisit(visit.id, {
         onSuccess: () => {
            toast.success(`${visit.visitorName}'s visit cancelled`);
            setCancelOpen(false);
            onCancelSuccess?.();
         },
         onError: () =>
            toast.error('Failed to cancel visit. Please try again.'),
      });
   };

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger
               asChild
               disabled={isCheckingOut || isCancelling}
            >
               {trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align}>
               <DropdownMenuLabel>Actions</DropdownMenuLabel>

               <DropdownMenuItem
                  onClick={() => {
                     const badgeNumber = visit.badge.split('-').pop();
                     navigator.clipboard.writeText(badgeNumber ?? visit.badge);
                  }}
               >
                  <Copy className="size-4 mr-2" />
                  Copy Badge
               </DropdownMenuItem>

               {onViewDetails && (
                  <>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => onViewDetails(visit)}>
                        <Eye className="size-4 mr-2" />
                        View Details
                     </DropdownMenuItem>
                  </>
               )}

               {!isFinal && (
                  <>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        asChild
                     >
                        <button
                           className="flex w-full items-center px-2 py-1.5 text-sm"
                           onClick={() => setCheckOutOpen(true)}
                        >
                           <LogOut className="size-4 mr-2" />
                           Check Out
                        </button>
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        variant="destructive"
                        onSelect={(e) => e.preventDefault()}
                        asChild
                     >
                        <button
                           className="flex w-full items-center px-2 py-1.5 text-sm"
                           onClick={() => setCancelOpen(true)}
                        >
                           <Trash2 className="size-4 mr-2" />
                           Cancel Visit
                        </button>
                     </DropdownMenuItem>
                  </>
               )}
            </DropdownMenuContent>
         </DropdownMenu>

         {/* Check Out confirmation */}
         <AlertDialog open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Visitor Check-Out</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to check out{' '}
                     <span className="font-semibold text-foreground">
                        {visit.visitorName}
                     </span>
                     ? The visit will be marked as completed, and the visitor
                     will be removed from the active visitor list.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Keep Visit Active</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleCheckOut}
                     disabled={isCheckingOut}
                  >
                     {isCheckingOut ? 'Checking out…' : 'Check Out'}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>

         {/* Cancel confirmation */}
         <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>
                     Confirm Visit Cancellation
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to cancel{' '}
                     <span className="font-semibold text-foreground">
                        {visit.visitorName}
                     </span>
                     's visit? This action cannot be undone.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Go Back</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleCancel}
                     disabled={isCancelling}
                  >
                     {isCancelling ? 'Cancelling…' : 'Cancel Visit'}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}
