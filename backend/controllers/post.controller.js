import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js"; // ✅ Add this import

export const uploadPost = asyncHandler(async (req, res) => {
 
  const author = await User.findOne({ email: req.user.email });
  const { content } = req.body;
  const localFilePath = req.file?.path;

  if (!author || !content) {
    return res.status(400).json({ msg: "All fields are necessary" });
  }

  let uploadedFile;
  if (localFilePath) {
    uploadedFile = await uploadOnCloudinary(localFilePath);

    if (!uploadedFile) {
      return res.status(500).json({ message: "Error uploading image to Cloudinary" });
    }
  }
 

  const post = await Post.create({
    author: author._id, // ✅ Save only the ID
    content,
    image: uploadedFile.url, // ✅ Assign correct URL
  });
  if(post){
    author.posts.push(post._id);
    await author.save()
  }

  res.status(201).json({
    success: true,
    message: "Post uploaded successfully",
    post,
  });
});
export const DeletePost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;

  const post = await Post.findById(postId);
  const user = await User.findOne({ email: req.user.email });

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.toString() !== user._id.toString()) {
    return res.status(403).json({ message: "Only the owner can delete the post" });
  }

  await Post.deleteOne({ _id: postId });

  return res.status(200).json({ message: "Post deleted successfully" });
});
 export const getAllPost = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  // Fetch paginated posts
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({
      path: 'author',
      select: '-password'
    })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination info
  const totalPosts = await Post.countDocuments();

  return res.status(200).json({
    msg: "Posts fetched successfully",
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts,
    posts
  });
});

export const getPostOFUser=asyncHandler(async(req,res)=>{

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
const author=await User.findOne({email:req.user.email})
  // Fetch paginated posts
  const posts = await Post.find({author:author._id})
    .sort({ createdAt: -1 })
    .populate({
      path: 'author',
      select: '-password'
    })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination info
  const totalPosts = await Post.countDocuments({author:author._id});

  return res.status(200).json({
    msg: "Posts fetched successfully",
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts,
    posts
  });
});
export const editPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const user = await User.findOne({ email: req.user.email });
  const { id: postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.toString() !== user._id.toString()) {
    return res.status(403).json({ message: "Only the owner can edit the post" });
  }

  post.content = content || post.content;
  await post.save();

  return res.status(200).json({ message: "Post edited successfully", post });
});
export const likePost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const user = await User.findOne({ email: req.user.email });
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.likes.includes(user._id)) {
    // User already liked the post, so we remove the like
    post.likes = post.likes.filter(like => like.toString() !== user._id.toString());
  } else {
    // User hasn't liked the post yet, so we add the like
    post.likes.push(user._id);
  }
  await post.save();
  return res.status(200).json({
    message: post.likes.includes(user._id) ? "Post liked successfully" : "Post unliked successfully",
    likesCount: post.likes.length
  });
})
