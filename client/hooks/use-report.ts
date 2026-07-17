import { reportService } from '@/services/report.service';
import type { ExportVisitLogParams } from '@/types/report.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

function downloadBlob(blob: Blob, filename: string) {
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = filename;
   a.click();
   URL.revokeObjectURL(url);
}

function parseFilename(contentDisposition?: string): string | null {
   if (!contentDisposition) return null;
   const match = contentDisposition.match(/filename="?([^"]+)"?/);
   return match?.[1] ?? null;
}

export const reportQueryKeys = {
   all: ['reports'] as const,
   stats: () => [...reportQueryKeys.all, 'stats'] as const,
} as const;
// ─── Queries

export function useReportStats() {
   return useQuery({
      queryKey: reportQueryKeys.stats(),
      queryFn: async () => {
         const { data } = await reportService.getStats();
         return data.data;
      },
   });
}

export function useExportVisitLog() {
   return useMutation<
      { blob: Blob; filename: string },
      Error,
      ExportVisitLogParams
   >({
      mutationFn: async (params) => {
         const response = await reportService.exportVisitLog(params);
         const date = new Date().toISOString().slice(0, 10);
         const filename =
            parseFilename(response.headers['content-disposition']) ??
            `visit-log-${date}.csv`;
         return { blob: response.data, filename };
      },
      onSuccess: ({ blob, filename }) => {
         downloadBlob(blob, filename);
         toast.success('Report downloaded successfully');
      },
      onError: () => {
         toast.error('Failed to export report. Please try again.');
      },
   });
}
