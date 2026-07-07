import { Router } from "express";
import teacherPositionController from "../controller/teacherPositionController.js";

const routerTeacherPosition = Router();

routerTeacherPosition.get("/", teacherPositionController.getTeacherPositions);
routerTeacherPosition.post("/", teacherPositionController.postTeacherPosition);    

export default routerTeacherPosition;
