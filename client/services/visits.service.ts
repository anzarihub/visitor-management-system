import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type {
   ActiveVisitorsCountData,
   BadgeLookupData,
   CheckInPayload,
   CheckInData,
   CheckOutPayload,
   CheckOutData,
   Visit,
   VisitsPaginatedData,
   VisitsParams,
} from '@/types/visit.types';

export const visitsService = {
   getAll(params: VisitsParams) {
      return api.get<ApiResponse<VisitsPaginatedData>>('/visits', {
         params,
      });
   },

   getById(id: number) {
      return api.get<ApiResponse<Visit>>(`/visits/${id}`);
   },

   getActiveVisitByBadge(badgeNumber: number) {
      return api.get<ApiResponse<BadgeLookupData>>(
         `/visits/active/${badgeNumber}`,
      );
   },

   getActiveVisitorsCount() {
      return api.get<ApiResponse<ActiveVisitorsCountData>>(
         '/visits/active-count',
      );
   },

   checkIn(payload: CheckInPayload) {
      return api.post<ApiResponse<CheckInData>>('/visits/check-in', payload);
   },

   checkOut(payload: CheckOutPayload) {
      return api.post<ApiResponse<CheckOutData>>('/visits/check-out', payload);
   },

   checkOutById(id: number) {
      return api.patch<ApiResponse<Visit>>(`/visits/${id}/checkout`);
   },

   cancel(id: number) {
      return api.patch<ApiResponse<Visit>>(`/visits/${id}/cancel`);
   },
};
