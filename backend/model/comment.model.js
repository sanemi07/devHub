import mongoose from 'mongoose';
const commentSchema=new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },},{timestamps: true});
    const comment=mongoose.model('Comment',commentSchema)
export default comment;
