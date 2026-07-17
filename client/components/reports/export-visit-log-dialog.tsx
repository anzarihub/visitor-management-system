'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import {
   Field,
   FieldDescription,
   FieldGroup,
   FieldLabel,
} from '@/components/ui/field';
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useDepartments } from '@/hooks/use-departments';
import { useExportVisitLog } from '@/hooks/use-report';
import type { ExportPeriod } from '@/types/report.types';
import { format, subDays } from 'date-fns';
import { CalendarIcon, FileSpreadsheet } from 'lucide-react';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { ExportCardButton } from './export-card-button';

const PERIOD_LABELS: Record<ExportPeriod, string> = {
   '7d': 'Last 7 Days',
   '30d': 'This Month',
   '3m': 'Last 3 Months',
   '6m': 'Last 6 Months',
   all: 'All Time',
   custom: 'Custom Range',
};

interface ExportVisitLogDialogProps {
   trigger?: React.ReactNode;
}

export function ExportVisitLogDialog({ trigger }: ExportVisitLogDialogProps) {
   const [open, setOpen] = React.useState(false);
   const [period, setPeriod] = React.useState<ExportPeriod>('7d');
   const [departmentId, setDepartmentId] = React.useState('all');
   const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
      from: subDays(new Date(), 7),
      to: new Date(),
   });

   const { data: departments, isLoading: loadingDepts } = useDepartments();
   const { mutate: exportLog, isPending } = useExportVisitLog();

   // Reset form state whenever the dialog is opened
   React.useEffect(() => {
      if (open) {
         setPeriod('7d');
         setDepartmentId('all');
         setDateRange({
            from: subDays(new Date(), 7),
            to: new Date(),
         });
      }
   }, [open]);

   const isCustomInvalid =
      period === 'custom' && (!dateRange?.from || !dateRange?.to);

   function handleExport() {
      exportLog(
         {
            period,
            departmentId:
               departmentId === 'all' ? undefined : Number(departmentId),
            from:
               period === 'custom' && dateRange?.from
                  ? format(dateRange.from, 'yyyy-MM-dd')
                  : undefined,
            to:
               period === 'custom' && dateRange?.to
                  ? format(dateRange.to, 'yyyy-MM-dd')
                  : undefined,
         },
         { onSuccess: () => setOpen(false) },
      );
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            {trigger ?? (
               <ExportCardButton
                  icon={<FileSpreadsheet className="size-4.5" />}
                  iconClassName="bg-amber-100 text-amber-500"
                  label="Export Visitor Log (CSV)"
               />
            )}
         </DialogTrigger>
         <DialogContent className="">
            <DialogHeader>
               <DialogTitle>Export Visitor Log (CSV)</DialogTitle>
            </DialogHeader>

            <FieldGroup>
               {/* Period */}
               <Field>
                  <FieldLabel>Report Period</FieldLabel>
                  <Select
                     value={period}
                     onValueChange={(v) => setPeriod(v as ExportPeriod)}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                     </SelectTrigger>
                     <SelectContent>
                        {(
                           Object.entries(PERIOD_LABELS) as [
                              ExportPeriod,
                              string,
                           ][]
                        ).map(([key, label]) => (
                           <SelectItem key={key} value={key}>
                              {label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <FieldDescription>
                     Select the date range for the report.
                  </FieldDescription>
               </Field>

               {/* Custom date range */}
               {period === 'custom' && (
                  <Field>
                     <FieldLabel>Custom Date Range</FieldLabel>
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button
                              variant="outline"
                              className="justify-start px-2.5 font-normal"
                           >
                              <CalendarIcon className="size-4" />
                              {dateRange?.from ? (
                                 dateRange.to ? (
                                    <>
                                       {format(dateRange.from, 'LLL dd, y')} –{' '}
                                       {format(dateRange.to, 'LLL dd, y')}
                                    </>
                                 ) : (
                                    format(dateRange.from, 'LLL dd, y')
                                 )
                              ) : (
                                 <span className="text-muted-foreground">
                                    Select date range
                                 </span>
                              )}
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                              mode="range"
                              defaultMonth={dateRange?.from}
                              selected={dateRange}
                              onSelect={setDateRange}
                              numberOfMonths={2}
                           />
                        </PopoverContent>
                     </Popover>
                  </Field>
               )}

               {/* Department */}
               <Field>
                  <FieldLabel>Department</FieldLabel>
                  {loadingDepts ? (
                     <Skeleton className="h-9 w-full rounded-md" />
                  ) : (
                     <Select
                        value={departmentId}
                        onValueChange={setDepartmentId}
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              <SelectItem value="all">
                                 All Departments
                              </SelectItem>
                              {departments?.map((dept) => (
                                 <SelectItem
                                    key={dept.id}
                                    value={String(dept.id)}
                                 >
                                    {dept.name}
                                 </SelectItem>
                              ))}
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                  )}
                  <FieldDescription>
                     Select the department to include in the report.
                  </FieldDescription>
               </Field>
            </FieldGroup>

            <DialogFooter>
               <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
               </DialogClose>
               <Button
                  onClick={handleExport}
                  disabled={isPending || isCustomInvalid}
               >
                  {isPending ? 'Exporting…' : 'Export CSV'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
