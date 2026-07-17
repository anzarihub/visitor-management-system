'use client';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
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
import { useForceChangePassword } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import {
   forceChangePasswordSchema,
   type ForceChangePasswordFormValues,
} from '@/lib/validations/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const ChangePassword = () => {
   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
   const router = useRouter();

   const user = useAuthStore((state) => state.user);
   const { mutate: forceChangePassword, isPending } = useForceChangePassword();

   // Guard: if user doesn't need to change password, send them to dashboard
   useEffect(() => {
      if (user && !user.mustChangePassword) {
         router.replace('/');
      }
   }, [user, router]);

   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm<ForceChangePasswordFormValues>({
      resolver: zodResolver(forceChangePasswordSchema),
   });

   const newPassword = watch('newPassword');

   return (
      <div className="flex items-center justify-center min-h-dvh">
         <Card className="mx-auto w-full max-w-md rounded-4xl">
            <CardHeader>
               <CardTitle>Set a New Password</CardTitle>
               <CardDescription>
                  Your password has been reset by an administrator. For security
                  reasons, please create a new password before continuing.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form
                  onSubmit={handleSubmit((values) =>
                     forceChangePassword(values),
                  )}
                  className="grid gap-6"
               >
                  <FieldGroup>
                     {/* New password */}
                     <Field>
                        <FieldLabel htmlFor="new-password">
                           New Password
                        </FieldLabel>
                        <InputGroup>
                           <InputGroupInput
                              id="new-password"
                              placeholder="Enter your new password"
                              type={isPasswordVisible ? 'text' : 'password'}
                              aria-invalid={!!errors.newPassword}
                              {...register('newPassword')}
                           />
                           <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                 size="icon-sm"
                                 type="button"
                                 aria-label={
                                    isPasswordVisible
                                       ? 'Hide password'
                                       : 'Show password'
                                 }
                                 onClick={() => setIsPasswordVisible((v) => !v)}
                              >
                                 {isPasswordVisible ? (
                                    <EyeOffIcon aria-hidden="true" />
                                 ) : (
                                    <EyeIcon aria-hidden="true" />
                                 )}
                              </InputGroupButton>
                           </InputGroupAddon>
                        </InputGroup>
                        {errors.newPassword && (
                           <FieldError>{errors.newPassword.message}</FieldError>
                        )}
                     </Field>

                     {/* Confirm password */}
                     <Field>
                        <FieldLabel htmlFor="confirm-password">
                           Confirm New Password
                        </FieldLabel>
                        <InputGroup>
                           <InputGroupInput
                              id="confirm-password"
                              placeholder="Re-enter your new password"
                              type={isPasswordVisible ? 'text' : 'password'}
                              aria-invalid={!!errors.confirmPassword}
                              {...register('confirmPassword')}
                           />
                           <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                 size="icon-sm"
                                 type="button"
                                 aria-label={
                                    isPasswordVisible
                                       ? 'Hide password'
                                       : 'Show password'
                                 }
                                 onClick={() => setIsPasswordVisible((v) => !v)}
                              >
                                 {isPasswordVisible ? (
                                    <EyeOffIcon aria-hidden="true" />
                                 ) : (
                                    <EyeIcon aria-hidden="true" />
                                 )}
                              </InputGroupButton>
                           </InputGroupAddon>
                        </InputGroup>
                        {errors.confirmPassword && (
                           <FieldError>
                              {errors.confirmPassword.message}
                           </FieldError>
                        )}
                     </Field>
                  </FieldGroup>

                  <Button
                     type="submit"
                     className="w-full"
                     disabled={isPending || !newPassword}
                  >
                     {isPending ? 'Updating…' : 'Update Password'}
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   );
};

export default ChangePassword;
