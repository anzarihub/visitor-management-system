'use client';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuLabel,
   DropdownMenuPortal,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuSeparator,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
   DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
   useChangeRole,
   useResetPassword,
   useToggleUserStatus,
} from '@/hooks/use-users';
import type { User, UserRole } from '@/types/user.types';
import { Ellipsis } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { ResetPasswordDialog } from './reset-password-dialog';
import { TempPasswordDialog } from './temp-password-dialog';
import { ToggleStatusDialog } from './toggle-status-dialog';

export function getUserFullName(user: User) {
   return `${user.firstName} ${user.lastName}`;
}

type UserCardMenuProps = {
   user: User;
};

export function UserCardMenu({ user }: UserCardMenuProps) {
   const [role, setRole] = React.useState<UserRole>(user.role);

   // Reset password flow — two dialogs in sequence
   const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
   const [tempPassword, setTempPassword] = React.useState<string | null>(null);
   const [tempPasswordDialogOpen, setTempPasswordDialogOpen] =
      React.useState(false);

   // Toggle status flow
   const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);

   const { mutate: resetPassword, isPending: isResetting } = useResetPassword();
   const { mutate: changeRole } = useChangeRole();
   const { mutate: toggleStatus, isPending: isTogglingStatus } =
      useToggleUserStatus();

   const handleResetConfirm = () => {
      resetPassword(user.id, {
         onSuccess: ({ tempPassword }) => {
            setTempPassword(tempPassword);
            setResetDialogOpen(false);
            setTempPasswordDialogOpen(true);
         },
         onError: (error) => {
            toast.error(
               error.response?.data.message ??
                  'Failed to reset password. Please try again.',
            );
            setResetDialogOpen(false);
         },
      });
   };

   const handleRoleChange = (role: UserRole) => {
      setRole(role);
      changeRole(
         { id: user.id, role },
         {
            onSuccess: () =>
               toast.success(`${getUserFullName(user)}'s role updated`),
            onError: (error) => {
               toast.error(
                  error.response?.data.message ??
                     'Failed to update role. Please try again.',
               );
               setRole(user.role); // revert optimistic update
            },
         },
      );
   };

   const handleStatusConfirm = () => {
      toggleStatus(
         { id: user.id, isActive: !user.isActive },
         {
            onSuccess: () =>
               toast.success(
                  `${getUserFullName(user)} has been ${user.isActive ? 'deactivated' : 'activated'}`,
               ),
            onError: (error) =>
               toast.error(
                  error.response?.data.message ??
                     'Failed to update user status. Please try again.',
               ),
            onSettled: () => setStatusDialogOpen(false),
         },
      );
   };

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="sm">
                  <Ellipsis />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuGroup>
                  <DropdownMenuItem
                     onSelect={(e) => {
                        e.preventDefault();
                        setResetDialogOpen(true);
                     }}
                  >
                     Reset Password
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                     <DropdownMenuSubTrigger>
                        Change Role
                     </DropdownMenuSubTrigger>
                     <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                           <DropdownMenuGroup>
                              <DropdownMenuLabel className="text-muted-foreground">
                                 Roles
                              </DropdownMenuLabel>
                              <DropdownMenuRadioGroup
                                 value={role}
                                 onValueChange={(value) =>
                                    handleRoleChange(value as UserRole)
                                 }
                              >
                                 <DropdownMenuRadioItem value="admin">
                                    Admin
                                 </DropdownMenuRadioItem>
                                 <DropdownMenuRadioItem value="front_desk">
                                    Front Desk
                                 </DropdownMenuRadioItem>
                              </DropdownMenuRadioGroup>
                           </DropdownMenuGroup>
                        </DropdownMenuSubContent>
                     </DropdownMenuPortal>
                  </DropdownMenuSub>
               </DropdownMenuGroup>

               <DropdownMenuSeparator />

               <DropdownMenuGroup>
                  <DropdownMenuItem
                     variant={user.isActive ? 'destructive' : 'default'}
                     onSelect={(e) => {
                        e.preventDefault();
                        setStatusDialogOpen(true);
                     }}
                  >
                     {user.isActive ? 'Deactivate User' : 'Activate User'}
                  </DropdownMenuItem>
               </DropdownMenuGroup>
            </DropdownMenuContent>
         </DropdownMenu>

         <ResetPasswordDialog
            open={resetDialogOpen}
            onOpenChange={setResetDialogOpen}
            onConfirm={handleResetConfirm}
            isPending={isResetting}
         />

         <TempPasswordDialog
            open={tempPasswordDialogOpen}
            onOpenChange={setTempPasswordDialogOpen}
            tempPassword={tempPassword}
         />

         <ToggleStatusDialog
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            isActive={user.isActive}
            userName={getUserFullName(user)}
            onConfirm={handleStatusConfirm}
            isPending={isTogglingStatus}
         />
      </>
   );
}
