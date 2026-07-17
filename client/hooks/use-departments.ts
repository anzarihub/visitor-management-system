import {
   QueryKey,
   useMutation,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type {
   CreateDepartmentPayload,
   Department,
   ToggleDepartmentStatusPayload,
   UpdateDepartmentPayload,
} from '@/types/department.types';
import { departmentsService } from '@/services/departments.service';
import type { ApiErrorResponse } from '@/types/api.types';

export const departmentQueryKeys = {
   all: ['departments'] as const,
   lists: () => [...departmentQueryKeys.all, 'list'] as const,
   list: (activeOnly?: boolean) =>
      [...departmentQueryKeys.lists(), { activeOnly: !!activeOnly }] as const,
   detail: (id: number) => [...departmentQueryKeys.all, 'detail', id] as const,
};

type ApiError = AxiosError<ApiErrorResponse>;

type ToggleDepartmentContext = {
   previousLists: [QueryKey, Department[] | undefined][];
};

export function useDepartments(activeOnly?: boolean) {
   return useQuery({
      queryKey: departmentQueryKeys.list(activeOnly),
      queryFn: async () => {
         const { data } = await departmentsService.getAll({ activeOnly });
         return data.data;
      },
   });
}

export function useDepartment(id: number) {
   return useQuery({
      queryKey: departmentQueryKeys.detail(id),
      queryFn: async () => {
         const { data } = await departmentsService.getById(id);
         return data.data;
      },
      enabled: !!id,
   });
}

export function useCreateDepartment() {
   const queryClient = useQueryClient();

   return useMutation<Department, ApiError, CreateDepartmentPayload>({
      mutationFn: async (values) => {
         const { data } = await departmentsService.create(values);
         return data.data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: departmentQueryKeys.lists(),
         });
      },
   });
}

export function useDeleteDepartment() {
   const queryClient = useQueryClient();

   return useMutation<void, ApiError, number>({
      mutationFn: async (id) => {
         await departmentsService.delete(id);
      },
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: departmentQueryKeys.lists(),
         });
      },
   });
}

export function useUpdateDepartment() {
   const queryClient = useQueryClient();

   return useMutation<Department, ApiError, UpdateDepartmentPayload>({
      mutationFn: async (payload) => {
         const { data } = await departmentsService.update(payload);
         return data.data;
      },
      onSuccess: (updated) => {
         queryClient.setQueriesData<Department[]>(
            { queryKey: departmentQueryKeys.lists() },
            (old) => old?.map((d) => (d.id === updated.id ? updated : d)),
         );
         queryClient.setQueryData(
            departmentQueryKeys.detail(updated.id),
            updated,
         );
      },
   });
}

export function useToggleDepartmentStatus() {
   const queryClient = useQueryClient();

   return useMutation<
      Department,
      ApiError,
      ToggleDepartmentStatusPayload,
      ToggleDepartmentContext
   >({
      mutationFn: async (payload) => {
         const { data } = await departmentsService.toggleStatus(payload);
         return data.data;
      },

      onMutate: async (payload) => {
         await queryClient.cancelQueries({
            queryKey: departmentQueryKeys.lists(),
         });

         const previousLists = queryClient.getQueriesData<Department[]>({
            queryKey: departmentQueryKeys.lists(),
         });

         // Reflect the new isActive flag everywhere the department currently appears
         queryClient.setQueriesData<Department[]>(
            { queryKey: departmentQueryKeys.lists() },
            (old) =>
               old?.map((d) =>
                  d.id === payload.id
                     ? { ...d, isActive: payload.isActive }
                     : d,
               ),
         );

         if (payload.isActive) {
            // Enabling: pull the full record from the unfiltered cache and
            // make sure it's present in the "active only" cache too
            const fullList = queryClient.getQueryData<Department[]>(
               departmentQueryKeys.list(false),
            );
            const dept = fullList?.find((d) => d.id === payload.id);

            if (dept) {
               queryClient.setQueryData<Department[]>(
                  departmentQueryKeys.list(true),
                  (old) => {
                     if (!old) return old;
                     const exists = old.some((d) => d.id === dept.id);
                     const updated = { ...dept, isActive: true };
                     return exists
                        ? old.map((d) => (d.id === dept.id ? updated : d))
                        : [...old, updated];
                  },
               );
            }
         } else {
            // Disabling: drop it from the "active only" cache immediately
            queryClient.setQueryData<Department[]>(
               departmentQueryKeys.list(true),
               (old) => old?.filter((d) => d.id !== payload.id),
            );
         }

         queryClient.setQueryData<Department>(
            departmentQueryKeys.detail(payload.id),
            (old) => (old ? { ...old, isActive: payload.isActive } : old),
         );

         return { previousLists };
      },

      onError: (_err, _payload, context) => {
         context?.previousLists?.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
         });
      },

      onSuccess: (updated) => {
         queryClient.setQueriesData<Department[]>(
            { queryKey: departmentQueryKeys.lists() },
            (old) => old?.map((d) => (d.id === updated.id ? updated : d)),
         );
         queryClient.setQueryData(
            departmentQueryKeys.detail(updated.id),
            updated,
         );
      },
   });
}
