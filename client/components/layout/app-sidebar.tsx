'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import { navigation } from '@/lib/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useLogout } from '@/hooks/use-auth';
import { ChevronRight, ChevronsUpDown, LogOut, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from '../ui/alert-dialog';
import { SidebarExportMenu } from './sidebar-export-menu';
import { AppSidebarSkeleton } from './app-sidebar-skeleton';
import { getUserFullName } from '../users/user-card-menu';
import type { UserRole } from '@/types/user.types';

const avatarMap: Record<UserRole, string> = {
   admin: '/admin.svg',
   front_desk: '/front_desk.svg',
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const pathname = usePathname();

   const user = useAuthStore((state) => state.user);
   const isLoading = useAuthStore((state) => !state.isHydrated);

   const { mutate: logout, isPending: loggingOut } = useLogout();

   if (isLoading) {
      return <AppSidebarSkeleton {...props} />;
   }

   if (!user) {
      return null;
   }

   const filteredNavigation = navigation.filter(
      (item) => item.roles.includes(user.role) && !item.hidden,
   );

   const groupedNavigation = {
      Workspace: filteredNavigation.filter(
         (item) => item.group === 'Workspace',
      ),
      Administration: filteredNavigation.filter(
         (item) => item.group === 'Administration',
      ),
   };

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
               <SidebarExportMenu />
            </div>
         </SidebarHeader>

         <SidebarContent className="px-3 py-4 pt-0 sm:px-4 lg:px-5">
            {Object.entries(groupedNavigation)
               .filter(([_, items]) => items.length > 0)
               .map(([group, items]) => (
                  <SidebarGroup key={group} className="p-0">
                     <SidebarGroupLabel className="text-[11px] text-muted-foreground uppercase tracking-wider">
                        {group}
                     </SidebarGroupLabel>
                     <SidebarGroupContent>
                        <SidebarMenu>
                           {items.map((item) => (
                              <SidebarMenuItem key={item.title}>
                                 <SidebarMenuButton
                                    asChild
                                    isActive={pathname.startsWith(item.href)}
                                    className="h-9 sm:h-9.5"
                                 >
                                    <Link href={item.href}>
                                       <item.icon className="size-4 sm:size-5" />
                                       <span className="text-sm">
                                          {item.title}
                                       </span>
                                       {pathname.startsWith(item.href) && (
                                          <ChevronRight className="ml-auto size-4 text-muted-foreground opacity-60" />
                                       )}
                                    </Link>
                                 </SidebarMenuButton>
                              </SidebarMenuItem>
                           ))}
                        </SidebarMenu>
                     </SidebarGroupContent>
                  </SidebarGroup>
               ))}
         </SidebarContent>

         <SidebarFooter className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5">
            <Separator />
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors">
                     <Avatar className="size-7 sm:size-8">
                        <AvatarImage
                           src={avatarMap[user.role]}
                           alt="Profile picture"
                        />
                        <AvatarFallback>
                           {user.firstName[0]}
                           {user.lastName[0]}
                        </AvatarFallback>
                     </Avatar>
                     <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-sm">
                           {getUserFullName(user)}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                           {user.username}
                        </p>
                     </div>
                     <ChevronsUpDown className="size-4 text-muted-foreground shrink-0" />
                  </div>
               </DropdownMenuTrigger>

               <DropdownMenuContent align="end" className="w-50">
                  <DropdownMenuItem asChild>
                     <Link href="/profile">
                        <UserCircle className="size-4 mr-2" />
                        Profile
                     </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <AlertDialog>
                     <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                           variant="destructive"
                           onSelect={(e) => e.preventDefault()}
                        >
                           <LogOut className="size-4 mr-2" />
                           Log out
                        </DropdownMenuItem>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>Logout Account</AlertDialogTitle>
                           <AlertDialogDescription>
                              You will need to log in again to access your
                              account.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel variant="outline">
                              Cancel
                           </AlertDialogCancel>
                           <AlertDialogAction
                              disabled={loggingOut}
                              onClick={() => logout()}
                              variant="ghost"
                              className="border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                           >
                              {loggingOut ? 'Logging out…' : 'Log out'}
                           </AlertDialogAction>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarFooter>
      </Sidebar>
   );
}
