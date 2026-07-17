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

type SaveSettingsDialogProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
   isPending?: boolean;
};

export function SaveSettingsDialog({
   open,
   onOpenChange,
   onConfirm,
   isPending,
}: SaveSettingsDialogProps) {
   return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Save System Settings?</AlertDialogTitle>
               <AlertDialogDescription>
                  The updated configuration will be applied across the visitor
                  management system. Some changes may affect active sessions,
                  visit monitoring, and security policies.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel disabled={isPending}>
                  Review Changes
               </AlertDialogCancel>
               <AlertDialogAction onClick={onConfirm} disabled={isPending}>
                  {isPending ? 'Saving…' : 'Save Settings'}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
