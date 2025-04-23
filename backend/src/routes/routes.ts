import { Application } from "express";
import userRoutes from "./user-routes";
import activityRoutes from "./activity-routes";
import authRoutes from "./auth-routes";


const routes = (app: Application) => {
    userRoutes(app);
    activityRoutes(app);
    authRoutes(app);
}

export default routes;