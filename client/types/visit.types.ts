import { ID_TYPE_OPTIONS } from '@/constants/visit';
import type { Department } from './department.types';

export type IdTypeValue = (typeof ID_TYPE_OPTIONS)[number]['value'];

export type VisitStatus = 'active' | 'overstay' | 'completed' | 'cancelled';
export type IdType =
   | 'national_id'
   | 'kebele_id'
   | 'passport'
   | 'drivers_license'
   | 'other';

export type Visit = {
   id: number;
   badge: string;
   visitorName: string;
   phone: string;
   idType: IdType;
   idNumber: string;
   host?: string;
   department?: Department | null;
   checkInTime: string;
   checkOutTime?: string;
   cancelledAt?: string;
   status: VisitStatus;
   note?: string;
};

export type DateFilter =
   | 'all'
   | 'today'
   | 'yesterday'
   | 'last7days'
   | 'last30days';

export type VisitsParams = {
   page: number;
   pageSize: number;
   search?: string;
   status?: VisitStatus | 'all';
   dateFilter?: DateFilter;
   departmentId?: string;
};

export type VisitsPaginatedData = {
   data: Visit[];
   total: number;
   page: number;
   pageSize: number;
   pageCount: number;
};

export type CheckInPayload = {
   fullName: string;
   phone?: string;
   idType: IdTypeValue;
   idNumber: string;
   host: string;
   department?: string | null;
   badgeNumber: number;
};

export type CheckInData = {
   id: number;
   badge: string;
   visitorName: string;
   host: string;
   department?: Department | null;
   checkInTime: string;
};

export type CheckOutPayload = {
   badgeNumber: number;
   notes?: string;
};

export type CheckOutData = {
   id: number;
   badge: string;
   visitorName: string;
   host: string;
   department: string;
   checkInTime: string;
   checkOutTime: string;
};

export type BadgeLookupData = {
   id: number;
   badge: string;
   visitorName: string;
   host: string;
   department: string;
   checkInTime: string;
};

export type ActiveVisitorsCountData = {
   activeCount: number;
};

export type CheckInResponse = CheckInData;
export type CheckOutResponse = CheckOutData;
export type BadgeLookupResponse = BadgeLookupData;
