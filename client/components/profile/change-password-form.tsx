'use client';

import { Button } from '@/components/ui/button';
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from '@/components/ui/field';
import {
   InputGroup,
   InputGroupAddon,
   InputGroupButton,
   InputGroupInput,
} from '@/components/ui/input-group';
import {
   changePasswordSchema,
   type ChangePasswordFormValues,
} from '@/lib/validations/profile.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

type ChangePasswordFormProps = {
   onSubmit: (values: ChangePasswordFormValues) => void | Promise<void>;
};

export const ChangePasswordForm = ({ onSubmit }: ChangePasswordFormProps) => {
   const [visible, setVisible] = React.useState({
      current: false,
      new: false,
      confirm: false,
   });

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
   } = useForm<ChangePasswordFormValues>({
      resolver: zodResolver(changePasswordSchema),
   });

   const toggleVisibility = (field: keyof typeof visible) => {
      setVisible((v) => ({ ...v, [field]: !v[field] }));
   };
   const getType = (field: keyof typeof visible) =>
      visible[field] ? 'text' : 'password';
   const getIcon = (field: keyof typeof visible) =>
      visible[field] ? EyeOffIcon : EyeIcon;

   const submit = handleSubmit(async (values) => {
      await onSubmit(values);
      reset();
   });

   return (
      <form onSubmit={submit} className="space-y-4 max-w-md">
         <FieldGroup>
            {/* Current password */}
            <Field>
               <FieldLabel htmlFor="cp-current">Current Password</FieldLabel>
               <InputGroup>
                  <InputGroupInput
                     id="cp-current"
                     placeholder="Enter your current password"
                     type={getType('current')}
                     aria-invalid={!!errors.currentPassword}
                     {...register('currentPassword')}
                  />
                  <InputGroupAddon align="inline-end">
                     <InputGroupButton
                        size="icon-sm"
                        type="button"
                        aria-label={
                           visible.current ? 'Hide password' : 'Show password'
                        }
                        onClick={() => toggleVisibility('current')}
                     >
                        {React.createElement(getIcon('current'), {
                           'aria-hidden': true,
                        })}
                     </InputGroupButton>
                  </InputGroupAddon>
               </InputGroup>
               {errors.currentPassword && (
                  <FieldError>{errors.currentPassword.message}</FieldError>
               )}
            </Field>

            {/* New password */}
            <Field>
               <FieldLabel htmlFor="cp-new">New Password</FieldLabel>
               <InputGroup>
                  <InputGroupInput
                     id="cp-new"
                     placeholder="Enter your new password"
                     type={getType('new')}
                     aria-invalid={!!errors.newPassword}
                     {...register('newPassword')}
                  />
                  <InputGroupAddon align="inline-end">
                     <InputGroupButton
                        size="icon-sm"
                        type="button"
                        aria-label={
                           visible.new ? 'Hide password' : 'Show password'
                        }
                        onClick={() => toggleVisibility('new')}
                     >
                        {React.createElement(getIcon('new'), {
                           'aria-hidden': true,
                        })}
                     </InputGroupButton>
                  </InputGroupAddon>
               </InputGroup>
               {errors.newPassword && (
                  <FieldError>{errors.newPassword.message}</FieldError>
               )}
            </Field>

            {/* Confirm new password */}
            <Field>
               <FieldLabel htmlFor="cp-confirm">
                  Confirm New Password
               </FieldLabel>
               <InputGroup>
                  <InputGroupInput
                     id="cp-confirm"
                     placeholder="Re-enter your new password"
                     type={getType('confirm')}
                     aria-invalid={!!errors.confirmPassword}
                     {...register('confirmPassword')}
                  />
                  <InputGroupAddon align="inline-end">
                     <InputGroupButton
                        size="icon-sm"
                        type="button"
                        aria-label={
                           visible.confirm ? 'Hide password' : 'Show password'
                        }
                        onClick={() => toggleVisibility('confirm')}
                     >
                        {React.createElement(getIcon('confirm'), {
                           'aria-hidden': true,
                        })}
                     </InputGroupButton>
                  </InputGroupAddon>
               </InputGroup>
               {errors.confirmPassword && (
                  <FieldError>{errors.confirmPassword.message}</FieldError>
               )}
            </Field>
         </FieldGroup>

         <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSubmitting}>
               {isSubmitting ? 'Updating…' : 'Update password'}
            </Button>
         </div>
      </form>
   );
};
