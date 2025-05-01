import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import * as profileController from "../controllers/profile.controller.js";
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

export default router;
