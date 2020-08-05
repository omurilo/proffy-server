import { Router } from "express";
import ClassesController from "./controllers/ClassesController";
import SubscriptionsController from "./controllers/SubscriptionsController";

const routes = Router();

const classesController = new ClassesController();
const subscriptionsController = new SubscriptionsController();

routes.get("/classes", classesController.index);
routes.post("/classes", classesController.create);

routes.get("/subscriptions", subscriptionsController.index);
routes.post("/subscriptions", subscriptionsController.create);

export default routes;
