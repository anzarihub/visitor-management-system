import { UserRole } from '@/types/user.types';
import {
   Briefcase,
   ChartColumn,
   ClipboardList,
   LayoutGrid,
   LucideIcon,
   Settings,
   UserCheck,
   UserCircle,
   UserPlus,
   Users,
} from 'lucide-react';

type NavigationItem = {
   title: string;
   icon: LucideIcon;
   href: string;
   group: 'Operations' | 'Administration' | 'Workspace';
   roles: UserRole[];
   isGradient?: boolean;
   isRoot?: boolean;
   hidden?: boolean; // excluded from sidebar rendering, still resolvable by getNavigationItem
};

export const navigation: NavigationItem[] = [
   {
      title: 'Dashboard',
      icon: LayoutGrid,
      href: '/dashboard',
      isRoot: true,
      group: 'Workspace',
      roles: ['admin', 'front_desk'],
   },
   {
      title: 'Visits',
      icon: ClipboardList,
      href: '/visits',
      group: 'Workspace',
      roles: ['admin', 'front_desk'],
   },
   {
      title: 'Check In',
      icon: UserPlus,
      href: '/check-in',
      group: 'Workspace',
      roles: ['admin', 'front_desk'],
   },
   {
      title: 'Check Out',
      icon: UserCheck,
      href: '/check-out',
      group: 'Workspace',
      roles: ['admin', 'front_desk'],
   },
   {
      title: 'Departments',
      icon: Briefcase,
      href: '/departments',
      group: 'Workspace',
      roles: ['admin', 'front_desk'],
   },
   {
      title: 'Reports',
      icon: ChartColumn,
      href: '/reports',
      group: 'Workspace',
      roles: ['admin', 'front_desk'],
   },
   {
      title: 'Users',
      icon: Users,
      href: '/users',
      group: 'Administration',
      roles: ['admin'],
   },
   {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
      group: 'Administration',
      roles: ['admin'],
   },
   {
      title: 'Profile',
      icon: UserCircle,
      href: '/profile',
      group: 'Workspace',
      roles: ['admin', 'front_desk'],
      hidden: true,
   },
];

export const getNavigationItem = (pathname: string) => {
   return navigation.find(
      (item) => item.href === pathname || pathname.startsWith(`${item.href}/`),
   );
};
