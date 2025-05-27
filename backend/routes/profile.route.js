import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import * as profileController from "../controllers/profile.controller.js";
import * as postController from '../controllers/post.controller.js'
import { verifyToken } from "../middlewares/jwtVerify.js";

const router = Router();

router.post(
  "/upload",
  verifyToken,              // Pass the function reference without parentheses
  upload.single("file"),     // Multer middleware for single file
  profileController.uploadProfileImage // Controller
);
router.post('/add-bio', verifyToken, profileController.addBio);

router.post(
  '/change-profilepic',
  verifyToken,              // Pass the function reference without parentheses
  upload.single('file'),
  profileController.changeProfileImage
);
router.post('/uploadPost',upload.single('file'),verifyToken,postController.uploadPost)
router.get('/getPosts',verifyToken,postController.getAllPost)
router.get('/getpostFromUser',verifyToken,postController.getPostOFUser)
router.delete('/:id',verifyToken,postController.DeletePost)
router.put("/editPost/:id",verifyToken,postController.editPost)

export default router;
