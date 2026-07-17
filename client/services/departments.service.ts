import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';

import type {
   CreateDepartmentPayload,
   Department,
   ToggleDepartmentStatusPayload,
   UpdateDepartmentPayload,
} from '@/types/department.types';

export const departmentsService = {
   getAll(params?: { activeOnly?: boolean }) {
      return api.get<ApiResponse<Department[]>>('/departments', {
         params,
      });
   },

   getById(id: number) {
      return api.get<ApiResponse<Department>>(`/departments/${id}`);
   },

   create(data: CreateDepartmentPayload) {
      return api.post<ApiResponse<Department>>('/departments', data);
   },

   update(payload: UpdateDepartmentPayload) {
      const { id, ...data } = payload;

      return api.patch<ApiResponse<Department>>(`/departments/${id}`, data);
   },

   delete(id: number) {
      return api.delete<ApiResponse<void>>(`/departments/${id}`);
   },

   toggleStatus(payload: ToggleDepartmentStatusPayload) {
      return api.patch<ApiResponse<Department>>(
         `/departments/${payload.id}/status`,
         {
            isActive: payload.isActive,
         },
      );
   },
};
