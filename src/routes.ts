import { Router } from "express";
import CreateClasses from "./controllers/CreateClassesController";

const routes = Router();

const classesControler = new CreateClasses();

routes.get("/classes", classesControler.index);
routes.post("/classes", classesControler.create);

export default routes;
