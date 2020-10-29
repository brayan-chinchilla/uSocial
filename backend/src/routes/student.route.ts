import { Router } from "express";
const router = Router();
import { verifyToken } from "./auth.jwt";
import StudentController from "../controllers/student.controller";

router.get('/', verifyToken, StudentController.getAllStudents);
router.post('/', verifyToken, StudentController.addStudent);

export default router;