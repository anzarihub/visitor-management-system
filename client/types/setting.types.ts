import type { Status } from '@/components/shared/status-badge';

export type Settings = {
   // General
   orgName: string;
   badgePrefix: string;

   // Visitor Rules
   overstayEnabled: boolean;
   overstayAfterMins: number;

   // System Info (read-only)
   systemVersion: string;
   database: string;
   totalUsers: number;
   createdAt: string;
};

export type SettingsWithStatus = Settings & { status: Status };

export type UpdateGeneralPayload = Pick<
   Settings,
   'orgName' | 'badgePrefix' | 'overstayEnabled' | 'overstayAfterMins'
>;
