import { uploadOnCloudinary } from "../config/cloudinary.js";
import User from "../model/user.model.js";
import { v2 as cloudinary } from 'cloudinary';

import { asyncHandler } from "../utils/asyncHandler.js";
import Post from "../model/post.model.js";

export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const localFilePath = req.file.path;
  const uploadedFile = await uploadOnCloudinary(localFilePath);

  if (!uploadedFile) {
    return res.status(500).json({ message: "Error uploading image to Cloudinary" });
  }

  const user = await User.findOne({email:req.user.email});

  // Optional: delete old image if one already exists
  

  user.profilePic = uploadedFile.secure_url;
  user.cloudinary_public_id = uploadedFile.public_id;
  await user.save();

  return res.status(201).json({
    message: "Uploaded successfully",
    user,
  });
});

export const changeProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const localFilePath = req.file.path;
  const uploadedFile = await uploadOnCloudinary(localFilePath);

  if (!uploadedFile) {
    return res.status(500).json({ message: "Error uploading new image to Cloudinary" });
  }

  const user = await User.findOne({email:req.user.email});

  // Delete previous image from Cloudinary if it exists
  if (user.cloudinary_public_id) {
    try {
      await cloudinary.uploader.destroy(user.cloudinary_public_id);
    } catch (err) {
      console.warn("Failed to delete old image:", err.message);
    }
  }

  user.profilePic = uploadedFile.secure_url;
  user.cloudinary_public_id = uploadedFile.public_id;
  await user.save();

  return res.status(200).json({
    message: "Profile image changed successfully",
    user,
  });
});
export const addBio=asyncHandler(async(req,res)=>{
  const {bio}=req.body;
  const user=await User.findOne({email:req.user.email});
  if(!user){
    return res.status(404).json({message:"User not found"});
  }
  user.bio=bio;
  await user.save();
  return res.status(200).json({
    message:"Bio added successfully",
    user
  })
})
export const post = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const localFilePath = req.file?.path;

  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let imageUrl = null;
  if (localFilePath) {
    const uploadedFile = await uploadOnCloudinary(localFilePath);
    if (!uploadedFile) {
      return res.status(500).json({ message: "Error uploading image to Cloudinary" });
    }
    imageUrl = uploadedFile.secure_url;
  }

  const newPost = await Post.create({
    author: user._id,
    content,
    image: imageUrl,
  });
  

  if (!newPost) {
    return res.status(400).json({ message: "Error uploading post" });
  }

  return res.status(201).json({
    message: "Posted successfully",
    post:newPost,
  });
});
export const followUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  

  const currentUser = await User.findOne({ email: req.user.email });
  if (!currentUser) {
    return res.status(404).json({ message: "Current user not found" });
  }

  const userToFollow = await User.findById(userId);
  

  if (!userToFollow) {
    return res.status(404).json({ message: "User to follow not found" });
  }

  if (currentUser.following.includes(userId)) {
    return res.status(400).json({ message: "You are already following this user" });
  }

  currentUser.following.push(userId);
  userToFollow.followers.push(currentUser._id);

  await currentUser.save();
  await userToFollow.save();

  return res.status(200).json({
    message: "Successfully followed the user",
    user: currentUser,
  });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.params.id; // Assuming userId is sent in the request body
  const currentUser = await User.findOne({ email: req.user.email });  
  if (!currentUser) {
    return res.status(404).json({ message: "Current user not found" });
  }
  const userToUnfollow = await User.findById(userId);
  if (!userToUnfollow) {
    return res.status(404).json({ message: "User to unfollow not found" });
  }
  if (!currentUser.following.includes(userId)) {
    return res.status(400).json({ message: "You are not following this user" });
  }

  currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
  userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());
  await currentUser.save();
  await userToUnfollow.save();
  return res.status(200).json({
    message: "Successfully unfollowed the user",
    user: currentUser,
  });
});
export const getUserPorfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).populate('posts');
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const totalFollowers = user.followers.length;
  const totalFollowing = user.following.length;

  return res.status(200).json({
    message: "User profile fetched successfully",
    user,
    totalFollowers,
    totalFollowing
  });
});
export const getProfile=asyncHandler(async (req, res) => {
  const { userId } = req.params.id; // Assuming userId is sent in the request body
  const user = await User.findById(userId).populate('posts');
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
   const totalFollowers = user.followers.length;
  const totalFollowing = user.following.length;
  return res.status(200).json({
    message: "User profile fetched successfully",
    user,
    totalFollowers,
    totalFollowing
  })
}); 
export const getFollowers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 followers per page
  const skip = (page - 1) * limit;
  const user = await User.findOne({ email: req.user.email }).populate('followers', '-password -__v').skip(skip).limit(limit);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({
    message: "Followers fetched successfully",
    followers: user.followers,
  });
}
);
export const getFollowing = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 following per page
  const skip = (page - 1) * limit;
  const user = await User.findOne({ email: req.user.email }).populate('following', '-password -__v').skip(skip).limit(limit);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({
    message: "Following fetched successfully",
    following: user.following,
  });
});

