import { usersService } from '@/services/users.service';
import type { ApiErrorResponse } from '@/types/api.types';
import {
   ChangeUserRolePayload,
   CreateUserPayload,
   ToggleUserStatusPayload,
   UpdateUserPayload,
   User,
} from '@/types/user.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const userQueryKeys = {
   all: ['users'] as const,
   lists: () => [...userQueryKeys.all, 'list'] as const,
   detail: (id: number) => [...userQueryKeys.all, 'detail', id] as const,
};

type ApiError = AxiosError<ApiErrorResponse>;

export function useUsers() {
   return useQuery({
      queryKey: userQueryKeys.lists(),
      queryFn: async () => {
         const { data } = await usersService.getAll();
         return data.data;
      },
   });
}

export function useUser(id: number) {
   return useQuery({
      queryKey: userQueryKeys.detail(id),
      queryFn: async () => {
         const { data } = await usersService.getById(id);
         return data.data;
      },
      enabled: !!id,
   });
}

export function useCreateUser() {
   const queryClient = useQueryClient();

   return useMutation<User, ApiError, CreateUserPayload>({
      mutationFn: async (values) => {
         const { data } = await usersService.create(values);
         return data.data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      },
   });
}

export function useUpdateUser() {
   const queryClient = useQueryClient();

   return useMutation<User, ApiError, UpdateUserPayload>({
      mutationFn: async (payload) => {
         const { data } = await usersService.update(payload);
         return data.data;
      },
      onSuccess(updatedUser) {
         queryClient.setQueryData(
            userQueryKeys.detail(updatedUser.id),
            updatedUser,
         );
         queryClient.setQueryData<User[]>(userQueryKeys.lists(), (prev) =>
            prev?.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
         );
      },
   });
}

export function useDeleteUser() {
   const queryClient = useQueryClient();

   return useMutation<void, ApiError, number>({
      mutationFn: async (id) => {
         await usersService.delete(id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      },
   });
}

export function useResetPassword() {
   return useMutation<{ tempPassword: string }, ApiError, number>({
      mutationFn: async (id) => {
         const { data } = await usersService.resetPassword(id);
         return data.data;
      },
   });
}

export function useChangeRole() {
   const queryClient = useQueryClient();

   return useMutation<User, ApiError, ChangeUserRolePayload>({
      mutationFn: async (payload) => {
         const { data } = await usersService.changeRole(payload);
         return data.data;
      },
      onSuccess: (updated) => {
         queryClient.setQueryData(userQueryKeys.detail(updated.id), updated);
         queryClient.setQueryData<User[]>(userQueryKeys.lists(), (prev) =>
            prev?.map((u) => (u.id === updated.id ? updated : u)),
         );
      },
   });
}

export function useToggleUserStatus() {
   const queryClient = useQueryClient();

   return useMutation<User, ApiError, ToggleUserStatusPayload>({
      mutationFn: async (payload) => {
         const { data } = await usersService.toggleStatus(payload);
         return data.data;
      },
      onSuccess: (updated) => {
         queryClient.setQueryData(userQueryKeys.detail(updated.id), updated);
         queryClient.setQueryData<User[]>(userQueryKeys.lists(), (prev) =>
            prev?.map((u) => (u.id === updated.id ? updated : u)),
         );
      },
   });
}
