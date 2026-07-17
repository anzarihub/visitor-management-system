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

type ResetPasswordDialogProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
   isPending?: boolean;
};

export function ResetPasswordDialog({
   open,
   onOpenChange,
   onConfirm,
   isPending,
}: ResetPasswordDialogProps) {
   return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Reset Password?</AlertDialogTitle>
               <AlertDialogDescription>
                  A temporary password will be generated for the user. They will
                  be required to change it after signing in.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel variant="outline" disabled={isPending}>
                  Cancel
               </AlertDialogCancel>
               <AlertDialogAction onClick={onConfirm} disabled={isPending}>
                  {isPending ? 'Generating…' : 'Generate'}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
