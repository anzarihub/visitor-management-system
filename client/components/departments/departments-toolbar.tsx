'use client';

import { Plus } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import CreateDepartment from './create-department';
import { useCreateDepartment, useDepartments } from '@/hooks/use-departments';
import type { CreateDepartmentFormValues } from '@/lib/validations/department.schema';

const DepartmentsToolbar = () => {
   const [open, setOpen] = React.useState(false);
   const { data: departments = [] } = useDepartments();
   const { mutateAsync: createDepartment } = useCreateDepartment();

   async function handleCreateDepartment(values: CreateDepartmentFormValues) {
      try {
         await createDepartment(values);
         toast.success('Department created successfully');
         setOpen(false); // ← moved here: only close on success
      } catch (error) {
         const message =
            (error as import('axios').AxiosError<{ message: string }>)?.response
               ?.data?.message ??
            'Failed to create department. Please try again.';

         toast.error(message);
         throw error; // ← propagate so the dialog knows not to close
      }
   }

   return (
      <div>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
               <h1 className="text-base font-semibold">Departments</h1>
               <Badge>{departments.length}</Badge>
            </div>
            <Button size="sm" onClick={() => setOpen(true)}>
               <Plus className="size-4" />
               <span className="hidden sm:inline-flex">New Department</span>
            </Button>
         </div>

         <CreateDepartment
            open={open}
            onOpenChange={setOpen}
            onSubmit={handleCreateDepartment}
         />
      </div>
   );
};

export default DepartmentsToolbar;
