import { NotFoundStacked } from '@/components/motion/not-found/stacked';

export default function NotFound() {
   return (
      <div className="flex min-h-dvh w-full items-center justify-center">
         <NotFoundStacked
            code="404"
            title="Oops! We Couldn't Find That Page"
            description="The page may have been moved, deleted, or the URL may be incorrect. You can go back or return to the dashboard to continue."
            homeHref="/dashboard"
            homeLabel="Go to Dashboard"
         />
      </div>
   );
}
