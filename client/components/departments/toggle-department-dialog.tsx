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

type ToggleDepartmentDialogProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   isActive: boolean;
   departmentName: string;
   onConfirm: () => void;
   isPending?: boolean;
};

export function ToggleDepartmentDialog({
   open,
   onOpenChange,
   isActive,
   departmentName,
   onConfirm,
   isPending,
}: ToggleDepartmentDialogProps) {
   return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>
                  {isActive ? 'Disable Department?' : 'Enable Department?'}
               </AlertDialogTitle>
               <AlertDialogDescription>
                  {isActive
                     ? `${departmentName} will no longer be available for visitor assignments and check-ins until it is enabled again.`
                     : `${departmentName} will become available for visitor assignments and check-ins.`}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel disabled={isPending}>
                  Cancel
               </AlertDialogCancel>
               <AlertDialogAction
                  variant={isActive ? 'destructive' : 'default'}
                  onClick={onConfirm}
                  disabled={isPending}
               >
                  {isPending
                     ? isActive
                        ? 'Disabling…'
                        : 'Enabling…'
                     : isActive
                       ? 'Disable'
                       : 'Enable'}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
