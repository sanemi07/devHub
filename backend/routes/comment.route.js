import { Router } from "express";
import * as commentController from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/jwtVerify.js";
const router = Router();
router.post(
  "/createComment/:postId",
  verifyToken,
  commentController.createComment
);
router.get(
  "/getAllComment/:postId",
  verifyToken,
  commentController.getComments
);
router.get(
  "/getCommentById/:commentId", verifyToken,
  commentController.getCommentById);
router.put(
  "/editComment/:commentId",
  verifyToken,
  commentController.updateComment
);
router.delete(
  "/deleteComment/:commentId",
  verifyToken,
  commentController.deleteComment
);  
router.post(
  "/replyComment/:commentId",
  verifyToken,
  commentController.replyToComment
);
router.get(
  "/getReplies/:commentId",
  verifyToken,
  commentController.getReplies
);
router.delete(
  "/deleteReply/:replyId",
  verifyToken,
  commentController.deleteReply
);
export default router;