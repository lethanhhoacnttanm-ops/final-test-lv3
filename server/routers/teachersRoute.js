import Router from 'express';
import teacherController from '../controller/teacherController.js';
import { uploadCloud } from '../config/cloudinary.config.js';

const routerTeachers = Router();

routerTeachers.get('/', teacherController.getTeachers);
routerTeachers.post("/upload", uploadCloud.single('image'), teacherController.postUploadCloud);
routerTeachers.post('/', teacherController.postTeacher);
routerTeachers.put('/:id', teacherController.updateTeacher)
routerTeachers.delete('/:id', teacherController.deleteTeacher)

export default routerTeachers;