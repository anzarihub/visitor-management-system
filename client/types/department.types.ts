export type Department = {
   id: number;
   name: string;
   shortName?: string;
   color: string;
   isActive: boolean;
   createdAt: string;
   totalVisits: number;
};

export type CreateDepartmentPayload = {
   name: string;
   shortName?: string;
   color: string;
};

export type ToggleDepartmentStatusPayload = {
   id: number;
   isActive: boolean;
};

export type UpdateDepartmentPayload = {
   id: number;
   name: string;
   shortName?: string;
   color: string;
};
