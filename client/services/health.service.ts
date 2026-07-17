import { api } from '@/lib/axios';
import type { HealthStatus } from '@/types/health.types';

export const healthService = {
   check() {
      return api.get<HealthStatus>('/health');
   },
};
