'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getNavigationItem } from '@/lib/navigation';
import {
   Command,
   LayoutGrid,
   MoreVertical,
   Search,
   UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Input } from '../ui/input';
import { Pill, PillIndicator, PillStatus } from '../ui/pill';
import { useState } from 'react';
import { AppCommand } from './app-command';
import { useActiveVisitorsCount } from '@/hooks/use-visits';

export function AppHeader() {
   const [commandOpen, setCommandOpen] = useState(false);
   const pathname = usePathname();
   const currentNavItem = getNavigationItem(pathname);
   const Icon = currentNavItem?.icon ?? LayoutGrid;

   const { data, isPending } = useActiveVisitorsCount();

   return (
      <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 border-b bg-card sticky top-0 z-10 w-full">
         <SidebarTrigger className="-ml-1 sm:-ml-2" />
         <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <Icon className="size-4 sm:size-5 text-muted-foreground hidden sm:block" />
            <h1 className="text-sm sm:text-base font-medium truncate">
               {currentNavItem?.title ?? 'Visitor Management System'}
            </h1>
         </div>

         <div
            className="hidden lg:flex relative cursor-pointer"
            onClick={() => setCommandOpen(true)}
         >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />

            <Input
               readOnly
               placeholder="Search anything..."
               className="pl-10 pr-14 w-55 h-9 cursor-pointer"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-muted rounded px-1 py-0.5 text-xs">
               <Command className="size-3" />
               <span>K</span>
            </div>
         </div>
         <ThemeToggle />
         <div className="hidden sm:inline-flex">
            {isPending ? (
               <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 h-6">
                  <Skeleton className="size-2 rounded-full shrink-0" />
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-14" />
               </div>
            ) : (
               <Link href="/visits?status=active">
                  <Pill>
                     <PillIndicator variant="success" pulse />
                     <PillStatus>Active</PillStatus>
                     <span>{data?.activeCount ?? 0} visitors</span>
                  </Pill>
               </Link>
            )}
         </div>
         <Button asChild size="sm" className="font-normal">
            <Link href="/check-in">
               <UserPlus className="size-4" />
               <span className="hidden lg:flex font-sm">Check In</span>
            </Link>
         </Button>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden h-8 w-8"
               >
                  <MoreVertical className="size-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
               <DropdownMenuItem>
                  <Search className="size-4 mr-2" />
                  Search
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
         <AppCommand open={commandOpen} onOpenChange={setCommandOpen} />
      </header>
   );
}
