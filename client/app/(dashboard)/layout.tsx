import { redirect } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getServerUser } from '@/lib/auth-server';

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const user = await getServerUser();

   if (!user) {
      redirect('/login');
   }
   return (
      <div>
         <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
         >
            <SidebarProvider className="bg-sidebar">
               <AppSidebar />
               <div className="h-screen overflow-hidden lg:p-2 w-full">
                  <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
                     <AppHeader />
                     <div className="flex-1 w-full overflow-auto">
                        <TooltipProvider>{children}</TooltipProvider>
                     </div>
                  </div>
               </div>
            </SidebarProvider>
         </ThemeProvider>
      </div>
   );
}
