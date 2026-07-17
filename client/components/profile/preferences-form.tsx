'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const options = [
   {
      value: 'light',
      label: 'Light',
      icon: Sun,
      hint: 'Bright interface for daytime use',
   },
   {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
      hint: 'Low-glare interface for night use',
   },
] as const;

export function PreferencesForm() {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = React.useState(false);
   React.useEffect(() => setMounted(true), []); // avoid hydration mismatch

   return (
      <div className="max-w-md">
         <p className="text-sm text-muted-foreground mb-4">
            Choose how the app looks. Your choice is saved on this device.
         </p>
         <div className="flex gap-3">
            {options.map(({ value, label, icon: Icon, hint }) => {
               const active = mounted && theme === value;
               return (
                  <button
                     key={value}
                     type="button"
                     onClick={() => setTheme(value)}
                     className={cn(
                        'relative flex-1 flex flex-col items-start gap-3 p-4 rounded-xl border text-left transition-colors',
                        active
                           ? 'border-primary bg-primary/5'
                           : 'border-border bg-card hover:bg-muted/50',
                     )}
                  >
                     <div
                        className={cn(
                           'h-9 w-9 rounded-lg flex items-center justify-center',
                           active
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground',
                        )}
                     >
                        <Icon className="size-4" />
                     </div>
                     <div>
                        <div className="text-sm font-semibold">{label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                           {hint}
                        </div>
                     </div>
                     {active && (
                        <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                           <Check className="size-3" />
                        </span>
                     )}
                  </button>
               );
            })}
         </div>
      </div>
   );
}
