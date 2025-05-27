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
