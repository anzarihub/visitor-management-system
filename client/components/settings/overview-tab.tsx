import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
   Building2,
   Clock3,
   Database,
   KeyRound,
   MonitorCog,
   Shield,
   ShieldCheck,
   Ticket,
   Users,
} from 'lucide-react';
import { format } from 'date-fns';
import type { SettingsWithStatus } from '@/types/setting.types';
import { Status, StatusBadge } from '../shared/status-badge';
import { SectionCard } from '../shared/section-card';

function formatDuration(minutes: number) {
   const hours = minutes / 60;
   if (hours % 1 === 0) return `${hours} Hours`;
   return `${hours.toFixed(1)} Hours`;
}

type OverviewItem = {
   label: string;
   value: React.ReactNode;
   icon: React.ReactNode;
   isStatus?: boolean;
};

function buildOverviewItems(settings: SettingsWithStatus): OverviewItem[] {
   return [
      {
         label: 'Organization',
         value: settings.orgName,
         icon: <Building2 className="size-4" />,
      },
      {
         label: 'Version',
         value: settings.systemVersion,
         icon: <MonitorCog className="size-4" />,
      },
      {
         label: 'Database',
         value: settings.database,
         icon: <Database className="size-4" />,
      },
      {
         label: 'Badge Prefix',
         value: `${settings.badgePrefix}`,
         icon: <Ticket className="size-4" />,
      },
      {
         label: 'Users',
         value: settings.totalUsers,
         icon: <Users className="size-4" />,
      },
      {
         label: 'Overstay Threshold',
         value: formatDuration(settings.overstayAfterMins),
         icon: <Clock3 className="size-4" />,
      },
      {
         label: 'Overstay Detection',
         value: settings.overstayEnabled ? (
            <Badge>Enabled</Badge>
         ) : (
            <Badge variant="secondary">Disabled</Badge>
         ),
         icon: <Shield className="size-4" />,
      },
      {
         label: 'Registered On',
         value: format(new Date(settings.createdAt), 'PPP'),
         icon: <Clock3 className="size-4" />,
      },
      {
         label: 'Status',
         value: settings.status,
         icon: <ShieldCheck className="size-4" />,
         isStatus: true,
      },
   ];
}

type OverviewTabProps = {
   settings: SettingsWithStatus;
};

export function OverviewTab({ settings }: OverviewTabProps) {
   const items = buildOverviewItems(settings);

   return (
      <SectionCard
         title="System Overview"
         description="Review the current organization, visitor management, and security configuration applied across the system."
      >
         <div className="divide-y">
            {items.map((item) => (
               <div
                  key={item.label}
                  className="flex items-center justify-between py-3"
               >
                  <div className="flex items-center gap-2 text-muted-foreground">
                     {item.icon}
                     <span>{item.label}</span>
                  </div>
                  {item.isStatus ? (
                     <StatusBadge status={item.value as Status} />
                  ) : (
                     <span className="font-normal text-right">
                        {item.value}
                     </span>
                  )}
               </div>
            ))}
         </div>
      </SectionCard>
   );
}
