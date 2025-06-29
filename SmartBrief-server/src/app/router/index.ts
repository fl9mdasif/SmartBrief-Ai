import { Router } from 'express';
import { userRoute } from '../modules/auth/route.auth';
import { SummaryRoutes } from '../modules/summery/route.summery';
import { AdminRoutes } from '../modules/admin/route.admin';
 
const router = Router();

const moduleRoute = [
  {
    path: '/summaries',
    route: SummaryRoutes,
  },
  {
    path: '/auth',
    route: userRoute,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
