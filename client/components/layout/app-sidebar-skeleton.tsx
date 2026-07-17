import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';

export function AppSidebarSkeleton({
   ...props
}: React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar collapsible="offcanvas" className="lg:border-r-0!" {...props}>
         <SidebarHeader className="p-3 sm:p-4 lg:p-5 pb-0">
            <div className="flex flex-col items-center gap-2">
               <Image
                  src="/logo.png"
                  alt="Ethiopian Agricultural Transformation Institution Logo"
                  width={370}
                  height={136}
                  className="h-7 w-auto"
               />
               <span className="text-muted-foreground text-xs">
                  Visitor Management System
               </span>
            </div>
            <div className="mt-4">
               <Skeleton className="h-8 w-full rounded-md" />
            </div>
         </SidebarHeader>

         <SidebarContent className="px-3 py-4 pt-0 sm:px-4 lg:px-5">
            <SidebarGroup className="p-0">
               <SidebarGroupLabel>
                  <Skeleton className="h-3 w-20" />
               </SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {Array.from({ length: 4 }).map((_, i) => (
                        <SidebarMenuItem key={`workspace-skel-${i}`}>
                           <div className="flex items-center gap-2 h-9 sm:h-9.5 px-2">
                              <Skeleton className="size-4 sm:size-5 rounded-sm shrink-0" />
                              <Skeleton className="h-3.5 w-24" />
                           </div>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="p-0 mt-4">
               <SidebarGroupLabel>
                  <Skeleton className="h-3 w-28" />
               </SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {Array.from({ length: 3 }).map((_, i) => (
                        <SidebarMenuItem key={`admin-skel-${i}`}>
                           <div className="flex items-center gap-2 h-9 sm:h-9.5 px-2">
                              <Skeleton className="size-4 sm:size-5 rounded-sm shrink-0" />
                              <Skeleton className="h-3.5 w-28" />
                           </div>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5">
            <Separator />
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
               <Skeleton className="size-7 sm:size-8 rounded-full shrink-0" />
               <div className="flex-1 min-w-0 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-16" />
               </div>
               <Skeleton className="size-4 shrink-0" />
            </div>
         </SidebarFooter>
      </Sidebar>
   );
}
