'use client';

import { Plus } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import CreateUser from './create-user';
import { useCreateUser, useUsers } from '@/hooks/use-users';
import type { CreateUserFormValues } from '@/lib/validations/user.schema';

const UsersToolbar = () => {
   const [open, setOpen] = React.useState(false);
   const { data: users = [] } = useUsers();
   const { mutateAsync: createUser } = useCreateUser();

   async function handleCreateUser(values: CreateUserFormValues) {
      try {
         await createUser(values);
         toast.success('User created successfully');
         setOpen(false);
      } catch (error) {
         const message =
            (error as import('axios').AxiosError<{ message: string }>)?.response
               ?.data?.message ?? 'Failed to create user. Please try again.';

         toast.error(message);
      }
   }

   return (
      <div>
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-base font-semibold">Users</h1>
               <p className="text-xs text-muted-foreground mt-0.5">
                  {users.length} users in the system
               </p>
            </div>
            <Button size="sm" onClick={() => setOpen(true)}>
               <Plus className="size-4" />
               <span className="hidden sm:inline-flex">Create User</span>
            </Button>
         </div>

         <CreateUser
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleCreateUser}
         />
      </div>
   );
};

export default UsersToolbar;
