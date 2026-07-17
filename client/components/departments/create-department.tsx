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
import {
   createDepartmentSchema,
   type CreateDepartmentFormValues,
} from '@/lib/validations/department.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Badge } from '../reui/badge';
import { ColorPicker } from '../ui/color-picker';

type CreateDepartmentProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSubmit?: (values: CreateDepartmentFormValues) => void | Promise<void>;
};

const CreateDepartment = ({
   open,
   onOpenChange,
   onSubmit,
}: CreateDepartmentProps) => {
   const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors, isSubmitting },
   } = useForm<CreateDepartmentFormValues>({
      resolver: zodResolver(createDepartmentSchema),
      defaultValues: {
         name: '',
         shortName: '',
         color: '',
      },
   });

   // Reset form whenever dialog is opened
   React.useEffect(() => {
      if (open) reset();
   }, [open, reset]);

   const handleFormSubmit = handleSubmit(async (values) => {
      await onSubmit?.(values);
      onOpenChange(false);
   });

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-120 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Create Department</DialogTitle>
               <DialogDescription className="sr-only" />
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
               <FieldGroup>
                  {/* Department Name */}
                  <Field>
                     <FieldLabel htmlFor="name">
                        Department Name
                        <span className="text-destructive">*</span>
                     </FieldLabel>
                     <Input
                        id="name"
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
                        <FieldLabel htmlFor="short-name">Short Name</FieldLabel>
                        <Badge variant="warning-outline" size="sm">
                           Optional
                        </Badge>
                     </div>
                     <Input
                        id="short-name"
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
                     {isSubmitting ? 'Creating…' : 'Create Department'}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default CreateDepartment;
