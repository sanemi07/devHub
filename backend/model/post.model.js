import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Cloudinary URL (optional)
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    cloudinary_public_id: { type: String },
    
  },
  { timestamps: true } // includes createdAt and updatedAt
);
const Post=mongoose.model('Post',postSchema)

export default Post
