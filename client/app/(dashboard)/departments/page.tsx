import { DepartmentCardGrid } from '@/components/departments/department-card-grid';
import DepartmentsToolbar from '@/components/departments/departments-toolbar';

export default function DepartmentsPage() {
   return (
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-background w-full">
         <DepartmentsToolbar />
         <DepartmentCardGrid />
      </div>
   );
}
