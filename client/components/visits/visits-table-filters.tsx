'use client';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useDepartments } from '@/hooks/use-departments';
import { useDebounce } from '@/hooks/use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown, CircleDot, Search } from 'lucide-react';
import * as React from 'react';
import type { DateFilter, VisitStatus } from '@/types/visit.types';

const dateFilterLabels: Record<DateFilter, string> = {
   all: 'All Dates',
   today: 'Today',
   yesterday: 'Yesterday',
   last7days: 'Last 7 days',
   last30days: 'Last 30 days',
};

export const statusFilterLabels: Record<VisitStatus, string> = {
   active: 'Active',
   completed: 'Completed',
   cancelled: 'Cancelled',
   overstay: 'Overstay',
};

const statusFilterColors: Record<VisitStatus, string> = {
   active: 'text-emerald-600 dark:text-emerald-400',
   completed: 'text-blue-600 dark:text-blue-400',
   cancelled: 'text-red-600 dark:text-red-400',
   overstay: 'text-amber-600 dark:text-amber-400',
};

export function VisitsTableFilters() {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const search = searchParams.get('search') ?? '';
   const statusFilter =
      (searchParams.get('status') as VisitStatus | 'all') || 'all';
   const dateFilter = (searchParams.get('dateFilter') as DateFilter) || 'all';
   const departmentId = searchParams.get('departmentId')
      ? Number(searchParams.get('departmentId'))
      : 'all';

   const [searchInput, setSearchInput] = React.useState(search);
   const debouncedSearch = useDebounce(searchInput, 400);

   const { data: departments = [] } = useDepartments();

   const updateParams = React.useCallback(
      (updates: Record<string, string | number | null | undefined>) => {
         const params = new URLSearchParams(searchParams.toString());

         Object.entries(updates).forEach(([key, value]) => {
            if (
               value === null ||
               value === undefined ||
               value === '' ||
               value === 'all'
            ) {
               params.delete(key);
            } else {
               params.set(key, String(value));
            }
         });

         router.push(`${pathname}?${params.toString()}`, { scroll: false });
      },
      [pathname, router, searchParams],
   );

   // // Keep the input synced if the URL changes externally (back/forward, clear filters)
   // React.useEffect(() => {
   //    setSearchInput(search);
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [search]);

   // // Push debounced search to the URL
   // React.useEffect(() => {
   //    if (debouncedSearch === search) return;
   //    updateParams({ search: debouncedSearch, page: 1 });
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [debouncedSearch]);

   const lastPushedSearch = React.useRef(search);

   // Sync FROM the URL only when it changed for a reason other than
   // our own debounce push (e.g. back/forward nav, clearAllFilters)
   React.useEffect(() => {
      if (search !== lastPushedSearch.current) {
         setSearchInput(search);
         lastPushedSearch.current = search;
      }
   }, [search]);

   // Push debounced search TO the URL
   React.useEffect(() => {
      if (debouncedSearch === search) return;
      lastPushedSearch.current = debouncedSearch; // mark BEFORE the async push resolves
      updateParams({ search: debouncedSearch, page: 1 });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [debouncedSearch]);

   const clearAllFilters = () => {
      setSearchInput('');
      updateParams({
         search: null,
         status: null,
         dateFilter: null,
         departmentId: null,
         page: 1,
      });
   };

   const selectedDepartmentName =
      departmentId === 'all'
         ? 'More'
         : departments.find((d) => d.id === departmentId)?.name || 'More';

   return (
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-border p-4">
         <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative w-full md:w-auto">
               <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
               <Input
                  placeholder="Search visitor..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-8 h-9 w-full md:w-75"
               />
            </div>

            {/* Date filter */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                     <Calendar className="size-4" />
                     {dateFilterLabels[dateFilter]}
                     <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start">
                  {(Object.keys(dateFilterLabels) as DateFilter[]).map(
                     (key) => (
                        <DropdownMenuCheckboxItem
                           key={key}
                           checked={dateFilter === key}
                           onCheckedChange={() =>
                              updateParams({ dateFilter: key, page: 1 })
                           }
                        >
                           {dateFilterLabels[key]}
                        </DropdownMenuCheckboxItem>
                     ),
                  )}
               </DropdownMenuContent>
            </DropdownMenu>

            {/* Status filter */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                     <CircleDot className="size-4" />
                     {statusFilter === 'all'
                        ? 'All Status'
                        : statusFilterLabels[statusFilter]}
                     <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start">
                  <DropdownMenuCheckboxItem
                     checked={statusFilter === 'all'}
                     onCheckedChange={() =>
                        updateParams({ status: 'all', page: 1 })
                     }
                  >
                     All Status
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  {(Object.keys(statusFilterLabels) as VisitStatus[]).map(
                     (key) => (
                        <DropdownMenuCheckboxItem
                           key={key}
                           checked={statusFilter === key}
                           onCheckedChange={() =>
                              updateParams({ status: key, page: 1 })
                           }
                        >
                           <span className={statusFilterColors[key]}>
                              {statusFilterLabels[key]}
                           </span>
                        </DropdownMenuCheckboxItem>
                     ),
                  )}
               </DropdownMenuContent>
            </DropdownMenu>

            {/* Department + clear */}
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                     {selectedDepartmentName}
                     <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start">
                  <DropdownMenuLabel className="text-xs">
                     Department
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                     checked={departmentId === 'all'}
                     onCheckedChange={() =>
                        updateParams({ departmentId: 'all', page: 1 })
                     }
                  >
                     All Departments
                  </DropdownMenuCheckboxItem>
                  {departments.map((dept) => (
                     <DropdownMenuCheckboxItem
                        key={dept.id}
                        checked={departmentId === dept.id}
                        onCheckedChange={() =>
                           updateParams({ departmentId: dept.id, page: 1 })
                        }
                     >
                        {dept.name}
                     </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearAllFilters}>
                     Clear all filters
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   );
}
