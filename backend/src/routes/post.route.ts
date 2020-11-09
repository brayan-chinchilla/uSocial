import { Router } from "express";
const router = Router();
import PostController from "../controllers/post.controller";

router.post('', PostController.newPost);
router.post('/translate', PostController.translatePost)
router.post('/:username', PostController.getPosts);

export default router;