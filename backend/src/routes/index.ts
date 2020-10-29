import { Router } from "express";
const router = Router();

import userRoutes from "./user.route";
import studentRoutes from "./student.route";

router.use('/users', userRoutes);
router.use('/students', studentRoutes);

export default router;