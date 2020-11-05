import { Router } from "express";
const router = Router();
import UserController from "../controllers/user.controller";

router.post('/login', UserController.loginWithUsernameAndPassword);
router.post('/register', UserController.register);
router.get('/:userid', UserController.getOneUser);
router.put('/:userid', UserController.updateUser);

export default router;