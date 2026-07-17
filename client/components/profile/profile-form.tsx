'use client';

import { Button } from '@/components/ui/button';
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useCheckUsername } from '@/hooks/use-auth';
import { formatEthiopianPhone } from '@/lib/phone';
import {
   profileSchema,
   type ProfileFormValues,
} from '@/lib/validations/profile.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

type ProfileFormProps = {
   defaultValues: ProfileFormValues;
   onSubmit: (values: ProfileFormValues) => void | Promise<void>;
};

export const ProfileForm = ({ defaultValues, onSubmit }: ProfileFormProps) => {
   const {
      register,
      handleSubmit,
      setValue,
      watch,
      reset,
      formState: { errors, isSubmitting, isDirty, dirtyFields },
   } = useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      defaultValues,
   });

   const usernameValue = watch('username');
   const phoneValue = watch('phone');

   const isUsernameDirty = !!dirtyFields.username;
   const debouncedUsername = useDebounce(usernameValue, 500);

   const { data: usernameCheck, isFetching: checkingUsername } =
      useCheckUsername(debouncedUsername, isUsernameDirty);

   const usernameTaken =
      isUsernameDirty &&
      !checkingUsername &&
      usernameCheck?.available === false;

   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('phone', formatEthiopianPhone(e.target.value), {
         shouldDirty: true,
         shouldValidate: true,
      });
   };

   const submit = handleSubmit(async (values) => {
      await onSubmit(values);
      reset(values); // clears dirty state so Save disables again after success
   });

   return (
      <form onSubmit={submit} className="space-y-4 max-w-md">
         <FieldGroup className="gap-6">
            {/* Username */}
            <Field>
               <FieldLabel htmlFor="pf-username">Username</FieldLabel>
               <div className="relative">
                  <Input
                     id="pf-username"
                     aria-invalid={!!errors.username || usernameTaken}
                     {...register('username')}
                  />
                  {!errors.username && !isUsernameDirty && (
                     <CheckIcon className="absolute top-1/2 right-3 -translate-y-1/2 size-4 text-green-600" />
                  )}
                  {isUsernameDirty && checkingUsername && (
                     <Loader2 className="absolute top-1/2 right-3 -translate-y-1/2 size-4 text-muted-foreground animate-spin" />
                  )}
                  {isUsernameDirty &&
                     !checkingUsername &&
                     usernameCheck?.available && (
                        <CheckIcon className="absolute top-1/2 right-3 -translate-y-1/2 size-4 text-green-600" />
                     )}
                  {usernameTaken && (
                     <XIcon className="absolute top-1/2 right-3 -translate-y-1/2 size-4 text-destructive" />
                  )}
               </div>
               {errors.username && (
                  <FieldError>{errors.username.message}</FieldError>
               )}
               {usernameTaken && !errors.username && (
                  <FieldError>This username is already taken</FieldError>
               )}
            </Field>

            {/* Phone */}
            <Field>
               <FieldLabel htmlFor="pf-phone">Phone</FieldLabel>
               <Input
                  id="pf-phone"
                  type="tel"
                  placeholder="+251 9XX XXX XXX"
                  aria-invalid={!!errors.phone}
                  value={phoneValue ?? ''}
                  onChange={handlePhoneChange}
               />
               {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
            </Field>
         </FieldGroup>

         <div className="flex justify-end pt-2">
            <Button
               type="submit"
               disabled={
                  !isDirty || isSubmitting || checkingUsername || usernameTaken
               }
            >
               {isSubmitting ? 'Saving…' : 'Save changes'}
            </Button>
         </div>
      </form>
   );
};
