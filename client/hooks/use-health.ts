import { useQuery } from '@tanstack/react-query';
import { healthService } from '@/services/health.service';

export function useHealth() {
   return useQuery({
      queryKey: ['health'],
      queryFn: async () => {
         const { data } = await healthService.check();
         return data;
      },
      staleTime: 1000 * 30,
      retry: false,
   });
}
