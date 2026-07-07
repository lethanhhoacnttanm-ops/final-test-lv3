import Router from 'express';
import teacherController from '../controller/teacherController.js';

const routerTeachers = Router();

routerTeachers.get('/', teacherController.getTeachers);
routerTeachers.post('/', teacherController.postTeacher);

export default routerTeachers;