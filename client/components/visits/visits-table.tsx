'use client';

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useVisits } from '@/hooks/use-visits';
import {
   ColumnDef,
   flexRender,
   getCoreRowModel,
   useReactTable,
} from '@tanstack/react-table';
import { differenceInMinutes, format } from 'date-fns';
import {
   AlertTriangle,
   BadgeCheck,
   Building2,
   CircleDashed,
   Clock,
   Clock3,
   Contact,
   Phone,
   Ticket,
   Timer,
   User,
   XCircle,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { VisitRowActions } from './visit-row-actions';
import { VisitsTableFilters, statusFilterLabels } from './visits-table-filters';
import { VisitsTablePagination } from './visits-table-pagination';
import VisitDetails from './visit-details';
import type { DateFilter, Visit, VisitStatus } from '@/types/visit.types';
import type { Department } from '@/types/department.types';
import { Skeleton } from '../ui/skeleton';
import { formatDuration } from './visit-timeline';

const statusConfig: Record<
   VisitStatus,
   { bg: string; text: string; border: string }
> = {
   active: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
   },
   completed: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
   },
   cancelled: {
      bg: 'bg-red-50 dark:bg-red-950/30',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
   },
   overstay: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
   },
};

const DEFAULT_PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

const getColumns = (
   onViewDetails: (visit: Visit) => void,
): ColumnDef<Visit>[] => [
   {
      id: 'select',
      header: ({ table }) => (
         <Checkbox
            checked={
               table.getIsAllPageRowsSelected() ||
               (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
               table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
         />
      ),
      cell: ({ row }) => (
         <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
         />
      ),
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: 'visitorName',
      header: () => (
         <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span>Visitor</span>
         </div>
      ),
      cell: ({ row }) => (
         <span className="text-sm font-medium">
            {row.getValue('visitorName')}
         </span>
      ),
   },
   {
      accessorKey: 'phone',
      header: () => (
         <div className="flex items-center gap-2">
            <Phone className="size-4 text-muted-foreground" />
            <span>Phone</span>
         </div>
      ),
      cell: ({ row }) => {
         const phone = row.getValue<string | null>('phone');

         return (
            <span className="text-sm font-medium text-muted-foreground">
               {phone ?? '—'}
            </span>
         );
      },
   },
   {
      accessorKey: 'badge',
      header: () => (
         <div className="flex items-center gap-2">
            <Ticket className="size-4 text-muted-foreground" />
            <span>Badge</span>
         </div>
      ),
      cell: ({ row }) => (
         <span className="text-sm font-medium text-muted-foreground">
            {row.getValue('badge')}
         </span>
      ),
   },
   {
      accessorKey: 'host',
      header: () => (
         <div className="flex items-center gap-2">
            <Contact className="size-4 text-muted-foreground" />
            <span>Host</span>
         </div>
      ),
      cell: ({ row }) => (
         <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-muted rounded text-muted-foreground">
            {row.getValue('host') ?? '! Unknown Host'}
         </span>
      ),
   },
   {
      accessorKey: 'department',
      header: () => (
         <div className="flex items-center gap-2">
            <Building2 className="size-4 text-muted-foreground" />
            <span>Department</span>
         </div>
      ),
      cell: ({ row }) => {
         const department = row.getValue('department') as
            | Department
            | null
            | undefined;
         return (
            <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-muted rounded text-muted-foreground">
               {department?.name ?? '! Unknown Department'}
            </span>
         );
      },
   },
   {
      id: 'checkIn',
      header: () => (
         <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span>Check In</span>
         </div>
      ),
      cell: ({ row }) => (
         <span className="text-sm text-muted-foreground">
            {format(new Date(row.original.checkInTime), 'h:mm a')}
         </span>
      ),
   },
   {
      id: 'duration',
      header: () => (
         <div className="flex items-center gap-2">
            <Timer className="size-4 text-muted-foreground" />
            <span>Duration</span>
         </div>
      ),
      cell: ({ row }) => {
         const visit = row.original;

         if (visit.status === 'cancelled') {
            return (
               <Badge variant="outline" className="gap-1">
                  <XCircle className="size-3" />
                  Cancelled
               </Badge>
            );
         }

         if (!visit.checkOutTime) {
            return (
               <Badge variant="outline" className="gap-1">
                  {visit.status === 'active' ? (
                     <Clock3 className="size-3" />
                  ) : (
                     <AlertTriangle className="size-3" />
                  )}
                  Ongoing
               </Badge>
            );
         }
         const checkIn = visit.checkInTime;
         const checkOut = visit.checkOutTime;

         return (
            <Badge variant="outline" className="gap-1">
               <BadgeCheck className="size-3" />
               {formatDuration(new Date(checkIn), new Date(checkOut))}
            </Badge>
         );
      },
   },
   {
      accessorKey: 'status',
      header: () => (
         <div className="flex items-center gap-2">
            <CircleDashed className="size-4 text-muted-foreground" />
            <span>Status</span>
         </div>
      ),
      cell: ({ row }) => {
         const status = row.getValue('status') as VisitStatus;
         const config = statusConfig[status];
         return (
            <div
               className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium',
                  config.bg,
                  config.border,
               )}
            >
               <span className={config.text}>{statusFilterLabels[status]}</span>
            </div>
         );
      },
   },
   {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
         <VisitRowActions visit={row.original} onViewDetails={onViewDetails} />
      ),
   },
];

// ---------------------------------------------------------------------------
// Table component
// ---------------------------------------------------------------------------

interface VisitsTableProps {
   showFilters?: boolean;
}

export function VisitsTable({ showFilters = true }: VisitsTableProps) {
   const searchParams = useSearchParams();

   const [open, setOpen] = React.useState(false);
   const [selectedVisitId, setSelectedVisitId] = React.useState<number | null>(
      null,
   );

   const page = Number(searchParams.get('page')) || 1;
   const pageSize = Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE;
   const search = searchParams.get('search') ?? undefined;
   const statusFilter =
      (searchParams.get('status') as VisitStatus | 'all') || 'all';
   const dateFilter = (searchParams.get('dateFilter') as DateFilter) || 'all';
   const departmentId = searchParams.get('departmentId') || undefined;

   const { data, isLoading, isError, isFetching } = useVisits({
      page,
      pageSize,
      search,
      status: statusFilter,
      dateFilter,
      departmentId,
   });

   const visits = data?.data ?? [];
   const pageCount = data?.pageCount ?? 0;
   const total = data?.total ?? 0;

   const handleViewDetails = React.useCallback((visit: Visit) => {
      setSelectedVisitId(visit.id);
      setOpen(true);
   }, []);

   const columns = React.useMemo(
      () => getColumns(handleViewDetails),
      [handleViewDetails],
   );

   const table = useReactTable({
      data: visits,
      columns,
      getCoreRowModel: getCoreRowModel(),
      manualPagination: true,
      pageCount,
   });

   return (
      <div className="rounded-xl border border-border bg-card">
         {showFilters && <VisitsTableFilters />}

         <div className="overflow-x-auto">
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id} className="bg-muted/50">
                        {headerGroup.headers.map((header) => (
                           <TableHead
                              key={header.id}
                              className="text-muted-foreground font-medium"
                           >
                              {header.isPlaceholder
                                 ? null
                                 : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext(),
                                   )}
                           </TableHead>
                        ))}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {isLoading ? (
                     Array.from({ length: pageSize }).map((_, i) => (
                        <TableRow key={i}>
                           {columns.map((_, j) => (
                              <TableCell key={j}>
                                 <Skeleton className="h-4 w-full" />
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : isError ? (
                     <TableRow>
                        <TableCell
                           colSpan={columns.length}
                           className="h-24 text-center text-destructive"
                        >
                           Failed to load visits. Please try again.
                        </TableCell>
                     </TableRow>
                  ) : visits.length ? (
                     table.getRowModel().rows.map((row) => (
                        <TableRow
                           key={row.id}
                           data-state={row.getIsSelected() && 'selected'}
                           className={cn(
                              isFetching && 'opacity-60 transition-opacity',
                           )}
                        >
                           {row.getAllCells().map((cell) => (
                              <TableCell key={cell.id}>
                                 {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                 )}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell
                           colSpan={columns.length}
                           className="h-24 text-center text-muted-foreground"
                        >
                           No visits found.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>

         <VisitsTablePagination
            total={total}
            pageCount={pageCount}
            isFetching={isFetching}
         />

         <VisitDetails
            open={open}
            onOpenChange={setOpen}
            visitId={selectedVisitId}
         />
      </div>
   );
}
