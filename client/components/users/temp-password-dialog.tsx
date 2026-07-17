'use client';

import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import {
   InputGroup,
   InputGroupAddon,
   InputGroupButton,
   InputGroupInput,
} from '@/components/ui/input-group';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Check, Copy } from 'lucide-react';

type TempPasswordDialogProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   tempPassword: string | null;
};

export function TempPasswordDialog({
   open,
   onOpenChange,
   tempPassword,
}: TempPasswordDialogProps) {
   const [copy, isCopied] = useCopyToClipboard();

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="sm:max-w-md"
         >
            <DialogHeader>
               <DialogTitle>Temporary Password</DialogTitle>
               <DialogDescription>
                  Share this password with the user securely.
               </DialogDescription>
            </DialogHeader>

            <InputGroup>
               <InputGroupInput value={tempPassword ?? ''} readOnly />
               <InputGroupAddon align="inline-end">
                  <InputGroupButton
                     aria-label="Copy"
                     title="Copy"
                     size="icon-xs"
                     onClick={() => copy(tempPassword ?? '')}
                  >
                     {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  </InputGroupButton>
               </InputGroupAddon>
            </InputGroup>

            <DialogFooter className="sm:justify-start">
               <DialogClose asChild>
                  <Button type="button">Close</Button>
               </DialogClose>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
