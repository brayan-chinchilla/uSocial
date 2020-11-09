import { Router } from "express";
const router = Router();

import userRoutes from "./user.route";
import studentRoutes from "./student.route";
import postsRoutes from "./post.route";

router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/posts', postsRoutes)

export default router;