import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type {
   ChangeUserRolePayload,
   CreateUserPayload,
   ResetPasswordData,
   ToggleUserStatusPayload,
   UpdateUserPayload,
   User,
} from '@/types/user.types';

export const usersService = {
   getAll() {
      return api.get<ApiResponse<User[]>>('/users');
   },

   getById(id: number) {
      return api.get<ApiResponse<User>>(`/users/${id}`);
   },

   create(payload: CreateUserPayload) {
      return api.post<ApiResponse<User>>('/users', payload);
   },

   update(payload: UpdateUserPayload) {
      const { id, ...data } = payload;

      return api.put<ApiResponse<User>>(`/users/${id}`, data);
   },

   delete(id: number) {
      return api.delete<ApiResponse<null>>(`/users/${id}`);
   },

   resetPassword(id: number) {
      return api.post<ApiResponse<ResetPasswordData>>(
         `/users/${id}/reset-password`,
      );
   },

   changeRole(payload: ChangeUserRolePayload) {
      return api.patch<ApiResponse<User>>(`/users/${payload.id}/role`, {
         role: payload.role,
      });
   },

   toggleStatus(payload: ToggleUserStatusPayload) {
      return api.patch<ApiResponse<User>>(`/users/${payload.id}/status`, {
         isActive: payload.isActive,
      });
   },
};
