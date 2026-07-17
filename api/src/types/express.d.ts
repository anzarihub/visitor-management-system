import 'express-session';
import { Role } from '../generated/prisma/enums.ts';

declare module 'express-session' {
   interface SessionData {
      userId: number;
      role: Role;
   }
}

declare global {
   namespace Express {
      interface Request {
         validatedQuery?: unknown;
         validatedBody?: unknown;
         validatedParams?: unknown;
      }
   }
}

export {};
