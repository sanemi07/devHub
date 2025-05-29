import Comment from "../model/comment.model.js";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const postFound = await Post.findById(postId);
  if (!postFound) {
    return res.status(404).json({ message: "Post not found" });
  }

  const newComment = await Comment.create({
    content,
    author: user._id,
    post: postFound._id,
  });

  postFound.comments.push(newComment._id);
  await postFound.save();

  res.status(201).json({
    message: "Comment created successfully",
    comment: newComment,
  });
});

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  

  const postFound = await Post.findById(postId);
  if (!postFound) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comments = await Comment.find({ post: postFound._id })
  .populate("author", "name email")
  .populate({
    path: "replies",
    populate: {
      path: "author",
      select: "name email"
    }
  })
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);


  if (!comments || comments.length === 0) {
    return res.status(404).json({ message: "No comments found" });
  }

  res.status(200).json({
    message: "Comments retrieved successfully",
    comments,
  });
});
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const commentFound = await Comment.findById(commentId);
  if (!commentFound) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const postFound = await Post.findById(commentFound.post);
  if (!postFound) {
    return res.status(404).json({ message: "Post not found" });
  }

  const isAuthor = commentFound.author.toString() === user._id.toString();
  const isPostOwner = postFound.author.toString() === user._id.toString();

  if (!isAuthor && !isPostOwner) {
    return res.status(403).json({ message: "You are not authorized to delete this comment" });
  }

  postFound.comments = postFound.comments.filter(
    (comment) => comment.toString() !== commentId
  );
  await postFound.save();
  await commentFound.deleteOne();

  res.status(200).json({
    message: "Comment deleted successfully",
  });
});

export const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const commentFound = await Comment.findById(commentId);
    if (!commentFound) {
        return res.status(404).json({ message: "Comment not found" });
    }
    const postFound = await Post.findById(commentFound.post);
    if (!postFound) {
        return res.status(404).json({ message: "Post not found" });
    }
    const isAuthor = commentFound.author.toString() === user._id.toString();
    if (!isAuthor) {
        return res.status(403).json({ message: "You are not authorized to update this comment" });
    }
    commentFound.content = content;
    commentFound.updatedAt = Date.now();
    await commentFound.save();
    res.status(200).json({
        message: "Comment updated successfully",
        comment: commentFound,
    });

})
export const replyToComment=asyncHandler(async(Request,res)=>{
    const { commentId } = Request.params;
    const { content } = Request.body;

    const user = await User.findOne({ email: Request.user.email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const parentComment = await Comment.findById(commentId)
    if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
    }
    const newComment = await Comment.create({
        content,
        author: user._id,
        post: parentComment.post,
        parentComment: parentComment._id,
    });
    parentComment.replies.push(newComment._id);
    await parentComment.save();
    res.status(201).json({
        message: "Reply created successfully",
        comment: newComment,
    });
})
export const getReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const parentComment = await Comment.findById(commentId);
  if (!parentComment) {
    return res.status(404).json({ message: "Parent comment not found" });
  }

  const replies = await Comment.find({ parentComment: parentComment._id })
    .populate("author", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  if (!replies || replies.length === 0) {
    return res.status(404).json({ message: "No replies found" });
  }

  res.status(200).json({
    message: "Replies retrieved successfully",
    replies,
  });
});
export const deleteReply = asyncHandler(async (req, res) => {
  const { replyId } = req.params;
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const replyFound = await Comment.findById(replyId);
  if (!replyFound) {
    return res.status(404).json({ message: "Reply not found" });
  }

  const parentComment = await Comment.findById(replyFound.parentComment);
  if (!parentComment) {
    return res.status(404).json({ message: "Parent comment not found" });
  }

  const isAuthor = replyFound.author.toString() === user._id.toString();
  if (!isAuthor) {
    return res.status(403).json({ message: "You are not authorized to delete this reply" });
  }

  parentComment.replies = parentComment.replies.filter(
    (reply) => reply.toString() !== replyId
  );
  await parentComment.save();
  await replyFound.deleteOne();

  res.status(200).json({
    message: "Reply deleted successfully",
  });
});
export const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId)
    .populate("author", "name email") // populate author of the comment
    .populate({
      path: "replies",                // populate nested replies
      populate: {
        path: "author",               // populate each reply's author
        select: "name email"
      }
    });

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  res.status(200).json({
    message: "Comment retrieved successfully",
    comment,
  });
});


  

