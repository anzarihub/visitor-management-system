'use client';

import {
   CommandDialog,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from '@/components/ui/command';
import { navigation } from '@/lib/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
   Download,
   FileText,
   LogOut,
   ShieldAlert,
   UserCircle,
   UserPlus,
} from 'lucide-react';
import { useLogout } from '@/hooks/use-auth';

type AppCommandProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
};

export function AppCommand({ open, onOpenChange }: AppCommandProps) {
   const router = useRouter();
   const user = useAuthStore((state) => state.user);
   const { mutate: logout } = useLogout();

   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onOpenChange(!open);
         }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
   }, [open, onOpenChange]);

   function go(href: string) {
      router.push(href);
      onOpenChange(false);
   }

   function run(fn: () => void) {
      onOpenChange(false);
      fn();
   }

   const filteredNav = user
      ? navigation.filter((item) => item.roles.includes(user.role))
      : [];

   const workspaceItems = filteredNav.filter(
      (i) => i.group === 'Workspace' && i.href !== '/profile',
   );
   const adminItems = filteredNav.filter((i) => i.group === 'Administration');

   const isFrontDesk = user?.role === 'front_desk';

   return (
      <CommandDialog open={open} onOpenChange={onOpenChange}>
         <CommandInput placeholder="Search pages and actions..." />
         <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {workspaceItems.length > 0 && (
               <CommandGroup heading="Workspace">
                  {workspaceItems.map((item) => (
                     <CommandItem
                        key={item.href}
                        value={item.title}
                        onSelect={() => go(item.href)}
                     >
                        <item.icon />
                        <span>{item.title}</span>
                     </CommandItem>
                  ))}
               </CommandGroup>
            )}

            {adminItems.length > 0 && (
               <>
                  <CommandSeparator />
                  <CommandGroup heading="Administration">
                     {adminItems.map((item) => (
                        <CommandItem
                           key={item.href}
                           value={item.title}
                           onSelect={() => go(item.href)}
                        >
                           <item.icon />
                           <span>{item.title}</span>
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </>
            )}

            <CommandSeparator />
            <CommandGroup heading="Quick Actions">
               <CommandItem
                  value="check in visitor"
                  onSelect={() => go('/check-in')}
               >
                  <UserPlus />
                  <span>Check In Visitor</span>
               </CommandItem>
               {!isFrontDesk && (
                  <CommandItem
                     value="export csv"
                     onSelect={() => go('/reports')}
                  >
                     <Download />
                     <span>Export Visit Log (CSV)</span>
                  </CommandItem>
               )}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Account">
               <CommandItem value="profile" onSelect={() => go('/profile')}>
                  <UserCircle />
                  <span>Profile</span>
               </CommandItem>
               <CommandItem
                  value="logout sign out"
                  onSelect={() => run(() => logout())}
               >
                  <LogOut />
                  <span>Log Out</span>
               </CommandItem>
            </CommandGroup>
         </CommandList>
      </CommandDialog>
   );
}
