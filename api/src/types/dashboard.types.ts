export type DateRange = {
   start: Date;
   end: Date;
};

export type VisitGrowthItem = {
   year: string;
   month: string;
   week: number;
   visits: number;
};

export type DepartmentVisitItem = {
   name: string;
   color: string;
   value: number;
};
