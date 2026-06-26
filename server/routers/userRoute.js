import { userController } from "../controller/userContorller.js";
import Router from 'express';

const routerUser = Router();

routerUser.get("/", userController.getUser);

routerUser.post("/", userController.creatUser);

export default routerUser