import { Router } from "express";
const router = Router();
import UserController from "../controllers/user.controller";

router.post('/login', UserController.loginWithUsernameAndPassword);
router.post('/register', UserController.register);

export default router;