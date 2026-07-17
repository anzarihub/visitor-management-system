'use client';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
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
import { useLogin } from '@/hooks/use-auth';
import {
   loginSchema,
   type LoginFormValues,
} from '@/lib/validations/auth.schema';
import { ApiErrorResponse } from '@/types/api.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { EyeIcon, EyeOffIcon, Lock, LogIn, User } from 'lucide-react';
import { JSX, SVGProps, useState } from 'react';
import { useForm } from 'react-hook-form';

const Logo = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
   <svg
      fill="currentColor"
      height="48"
      viewBox="0 0 40 48"
      width="40"
      {...props}
   >
      <clipPath id="a">
         <path d="m0 0h40v48h-40z" />
      </clipPath>
      <g clipPath="url(#a)">
         <path d="m25.0887 5.05386-3.933-1.05386-3.3145 12.3696-2.9923-11.16736-3.9331 1.05386 3.233 12.0655-8.05262-8.0526-2.87919 2.8792 8.83271 8.8328-10.99975-2.9474-1.05385625 3.933 12.01860625 3.2204c-.1376-.5935-.2104-1.2119-.2104-1.8473 0-4.4976 3.646-8.1436 8.1437-8.1436 4.4976 0 8.1436 3.646 8.1436 8.1436 0 .6313-.0719 1.2459-.2078 1.8359l10.9227 2.9267 1.0538-3.933-12.0664-3.2332 11.0005-2.9476-1.0539-3.933-12.0659 3.233 8.0526-8.0526-2.8792-2.87916-8.7102 8.71026z" />
         <path d="m27.8723 26.2214c-.3372 1.4256-1.0491 2.7063-2.0259 3.7324l7.913 7.9131 2.8792-2.8792z" />
         <path d="m25.7665 30.0366c-.9886 1.0097-2.2379 1.7632-3.6389 2.1515l2.8794 10.746 3.933-1.0539z" />
         <path d="m21.9807 32.2274c-.65.1671-1.3313.2559-2.0334.2559-.7522 0-1.4806-.102-2.1721-.2929l-2.882 10.7558 3.933 1.0538z" />
         <path d="m17.6361 32.1507c-1.3796-.4076-2.6067-1.1707-3.5751-2.1833l-7.9325 7.9325 2.87919 2.8792z" />
         <path d="m13.9956 29.8973c-.9518-1.019-1.6451-2.2826-1.9751-3.6862l-10.95836 2.9363 1.05385 3.933z" />
      </g>
   </svg>
);

const Login = () => {
   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
   const { mutate: login, isPending } = useLogin();

   const {
      register,
      handleSubmit,
      setValue,
      setFocus,
      formState: { errors },
   } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

   const onSubmit = (values: LoginFormValues) => {
      login(values, {
         onError: (error: AxiosError<ApiErrorResponse>) => {
            const code = error.response?.data?.code;

            if (code === 'INVALID_USERNAME') {
               setValue('username', '', { shouldDirty: true });
               setFocus('username');
            } else {
               // INVALID_PASSWORD, or unknown/network error → safest default
               setValue('password', '', { shouldDirty: true });
               setFocus('password');
            }
         },
      });
   };

   return (
      <div className="flex items-center justify-center min-h-dvh">
         <Card className="w-full max-w-md rounded-4xl px-6 py-6 pt-14 shadow-2xs">
            <CardHeader className="flex flex-col items-center space-y-2">
               <Logo />
               <div className="space-y-1 text-center">
                  <h2 className="text-balance text-2xl font-semibold">
                     Ethiopian Agricultural Transformation Institute
                  </h2>
                  <p className="text-pretty text-muted-foreground text-sm">
                     Visitor Management System
                  </p>
               </div>
            </CardHeader>

            <CardContent className="space-y-6">
               <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                  <FieldGroup>
                     {/* Username */}
                     <Field>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <InputGroup>
                           <InputGroupAddon align="inline-start">
                              <User className="size-4" aria-hidden="true" />
                           </InputGroupAddon>
                           <InputGroupInput
                              id="username"
                              placeholder="Enter your username"
                              type="text"
                              aria-invalid={!!errors.username}
                              {...register('username')}
                           />
                        </InputGroup>
                        {errors.username && (
                           <FieldError>{errors.username.message}</FieldError>
                        )}
                     </Field>

                     {/* Password */}
                     <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <InputGroup>
                           <InputGroupAddon align="inline-start">
                              <Lock className="size-4" aria-hidden="true" />
                           </InputGroupAddon>
                           <InputGroupInput
                              id="password"
                              placeholder="Enter your password"
                              type={isPasswordVisible ? 'text' : 'password'}
                              aria-invalid={!!errors.password}
                              {...register('password')}
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
                        {errors.password && (
                           <FieldError>{errors.password.message}</FieldError>
                        )}
                     </Field>
                  </FieldGroup>

                  <div className="space-y-4">
                     <Button
                        className="w-full"
                        type="submit"
                        disabled={isPending}
                     >
                        {isPending ? 'Signing in…' : 'Login'}
                        <LogIn className="ml-2 h-4 w-4" />
                     </Button>
                     <p className="text-pretty text-center text-sm text-muted-foreground">
                        Contact your system administrator if you've forgotten
                        your credentials.
                     </p>
                  </div>
               </form>
            </CardContent>

            <CardFooter className="flex justify-center border-t">
               <p className="text-pretty text-center text-sm text-muted-foreground">
                  Access restricted to authorized staff only
               </p>
            </CardFooter>
         </Card>
      </div>
   );
};

export default Login;
