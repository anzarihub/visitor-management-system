import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ExportCardButtonProps {
   icon: ReactNode;
   iconClassName?: string;
   label: string;
   onClick?: () => void;
}

export function ExportCardButton({
   icon,
   iconClassName,
   label,
   onClick,
}: ExportCardButtonProps) {
   return (
      <Button
         variant="ghost"
         onClick={onClick}
         className="h-11.5 w-full justify-start rounded-[10px] border border-border bg-sidebar hover:bg-sidebar-accent px-1.75 font-normal cursor-pointer"
      >
         <div
            className={cn(
               'flex size-8 items-center justify-center rounded-[6px] border border-border shrink-0',
               iconClassName,
            )}
         >
            {icon}
         </div>
         <span className="truncate text-[15px]">{label}</span>
      </Button>
   );
}
