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
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useUpdateDepartment } from '@/hooks/use-departments';
import {
   createDepartmentSchema,
   type CreateDepartmentFormValues,
} from '@/lib/validations/department.schema';
import type { Department } from '@/types/department.types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Badge } from '../reui/badge';
import { ColorPicker } from '../ui/color-picker';

type EditDepartmentDialogProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   department: Department;
};

export function EditDepartmentDialog({
   open,
   onOpenChange,
   department,
}: EditDepartmentDialogProps) {
   const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors, isSubmitting },
   } = useForm<CreateDepartmentFormValues>({
      resolver: zodResolver(createDepartmentSchema),
      defaultValues: {
         name: department.name,
         shortName: department.shortName ?? '',
         color: department.color,
      },
   });

   const { mutate: updateDepartment } = useUpdateDepartment();

   // Reset form to the department's current values whenever dialog is opened
   React.useEffect(() => {
      if (open) {
         reset({
            name: department.name,
            shortName: department.shortName ?? '',
            color: department.color,
         });
      }
   }, [open, department, reset]);

   const handleFormSubmit = handleSubmit(async (values) => {
      updateDepartment(
         { id: department.id, ...values },
         {
            onSuccess: () => {
               toast.success(`${values.name} has been updated`);
               onOpenChange(false);
            },
            onError: (error) =>
               toast.error(
                  error.response?.data.message ??
                     'Failed to update department. Please try again.',
               ),
         },
      );
   });

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-120 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Edit Department</DialogTitle>
               <DialogDescription className="sr-only" />
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
               <FieldGroup>
                  {/* Department Name */}
                  <Field>
                     <FieldLabel htmlFor="edit-name">
                        Department Name
                     </FieldLabel>
                     <Input
                        id="edit-name"
                        aria-invalid={!!errors.name}
                        {...register('name')}
                     />
                     {errors.name && (
                        <FieldError>{errors.name.message}</FieldError>
                     )}
                  </Field>

                  {/* Short Name (optional) */}
                  <Field>
                     <div className="flex items-center justify-between gap-2">
                        <FieldLabel htmlFor="edit-short-name">
                           Short Name
                        </FieldLabel>
                        <Badge variant="warning-outline" size="sm">
                           Optional
                        </Badge>
                     </div>
                     <Input
                        id="edit-short-name"
                        aria-invalid={!!errors.shortName}
                        {...register('shortName')}
                     />
                     {errors.shortName && (
                        <FieldError>{errors.shortName.message}</FieldError>
                     )}
                  </Field>

                  {/* Color */}
                  <Field>
                     <FieldLabel>Department Color</FieldLabel>
                     <Controller
                        name="color"
                        control={control}
                        render={({ field }) => (
                           <ColorPicker
                              color={field.value}
                              onChange={field.onChange}
                           />
                        )}
                     />
                     {errors.color && (
                        <FieldError>{errors.color.message}</FieldError>
                     )}
                  </Field>
               </FieldGroup>

               <DialogFooter>
                  <DialogClose asChild>
                     <Button type="button" variant="outline">
                        Cancel
                     </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? 'Saving…' : 'Save Changes'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
