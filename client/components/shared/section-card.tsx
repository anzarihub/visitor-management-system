import * as React from 'react';

export function SectionCard({
   title,
   description,
   children,
}: {
   title: string;
   description: string;
   children: React.ReactNode;
}) {
   return (
      <div className="bg-card text-card-foreground rounded-xl border max-w-2xl">
         <div className="p-4 sm:p-6 border-b border-border">
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
         </div>
         <div className="p-4 sm:p-6">{children}</div>
      </div>
   );
}
