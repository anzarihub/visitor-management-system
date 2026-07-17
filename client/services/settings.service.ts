import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { Settings, UpdateGeneralPayload } from '@/types/setting.types';

export const settingsService = {
   get() {
      return api.get<ApiResponse<Settings>>('/settings');
   },

   updateGeneral(data: UpdateGeneralPayload) {
      return api.patch<ApiResponse<Settings>>('/settings/general', data);
   },
};
