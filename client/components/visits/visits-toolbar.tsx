import { UserGreeting } from '../shared/user-greeting';

const VisitsToolbar = () => {
   return (
      <div className="space-y-2">
         <UserGreeting />
         <p className="text-sm text-muted-foreground">
            Monitor visitor activity, track active visits, and quickly identify
            visits requiring attention.
         </p>
      </div>
   );
};

export default VisitsToolbar;
