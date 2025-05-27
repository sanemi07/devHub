// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique:true,
      trim: true,
      required:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    profilePic: {
      type: String,
      default: '',
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    posts: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
          },
        ],
   googleId:{
    type:String
   }
   ,
   cloudinary_public_id: { type: String },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre('save', async function (next) {
   
    if (!this.isModified('password')) return next();
  
    try {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
      next();
    } catch (err) {
      next(err);
    }
  });

  userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      { email: this.email, id: this._id },
      process.env.JWTACCESS,
      { expiresIn: '24h' }
    );
  };
  userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      { email: this.email, id: this._id },
      process.env.JWTREFRESH,
      { expiresIn: '248h' }
    );
  };


const User = mongoose.model('User', userSchema);
export default User;
