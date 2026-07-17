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

type ToggleStatusDialogProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   isActive: boolean;
   userName: string;
   onConfirm: () => void;
   isPending?: boolean;
};

export function ToggleStatusDialog({
   open,
   onOpenChange,
   isActive,
   userName,
   onConfirm,
   isPending,
}: ToggleStatusDialogProps) {
   return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>
                  {isActive ? 'Deactivate User?' : 'Activate User?'}
               </AlertDialogTitle>
               <AlertDialogDescription>
                  {isActive
                     ? `${userName}'s account will be deactivated and they will lose access to the system.`
                     : `${userName}'s account will be reactivated and they will regain access to the system.`}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel variant="outline" disabled={isPending}>
                  Cancel
               </AlertDialogCancel>
               <AlertDialogAction
                  variant={isActive ? 'destructive' : 'default'}
                  onClick={onConfirm}
                  disabled={isPending}
               >
                  {isPending
                     ? isActive
                        ? 'Deactivating…'
                        : 'Activating…'
                     : isActive
                       ? 'Deactivate User'
                       : 'Activate User'}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
