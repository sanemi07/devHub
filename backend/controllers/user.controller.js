import { asyncHandler } from "../utils/asyncHandler.js"
import {validationResult} from 'express-validator'
import * as userService from '../services/user.servide.js'
import User from "../model/user.model.js"
import jwt from 'jsonwebtoken'

export const registerUser=asyncHandler(async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({message:"error in the input "})
    }
    const{userName,email,password}=req.body
    if(!userName||!email||!password){
        return res.status(400).json({message:"all the fields are required "})
    }
    const user=(await userService.createUser({userName,email,password,isblackListed:true}))
    
    const accessToken=await user.generateAccessToken()
    const refreshToken=await user.generateRefreshToken()
    const userObj = user.toObject();
delete userObj.password;

    res
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
    
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(201)
    .json({ user,message: 'User registered successfully' });



})
export const loginUser=asyncHandler(async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({message:"error in the input "})
    }
    const{email,password}=req.body
    if(!email ||!password){
        return res.status(400).json({message:"all the fields are required "})
    }
    const user=await User.findOne({email})
    if(!user){
        return res.status(401).json({message:"user not registered"})
    }
    const isValid=await user.comparePassword(password)
    if(!isValid){
        return res.status(400).json({message:"incorrect passsword"})
    }
    
    const accessToken=await user.generateAccessToken()
    const refreshToken=await user.generateRefreshToken()
    const userObj = user.toObject();
delete userObj.password;

    res
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
    
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(201)
    .json({ user,message: 'User loggedin successfully' });


})
export const logOutUser=asyncHandler(async(req,res,next)=>{
    const token=req.cookies.accessToken || req.headers.authorization.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
      }
      res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: true, // set to true if using HTTPS
      });
    
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
      });
    
      return res.status(200).json({ message: 'Logged out successfully' });  
})
export const refreshAccessToken=asyncHandler(async(req,res,next)=>{
    const token=req.cookies.refreshToken
    if(!token){
        return res.status(400).json({message:"refreshtoken expired login again "})
    }
    
     const decoded =  jwt.verify(token, process.env.JWTREFRESH);
     if(!decoded){
        return res.status(401).json({message:"error decoding token"})
     }
    const user=await User.findOne({email:decoded.email}) 
    const accesToken=await user.generateAccessToken()
    if(!accesToken){
        return res.status(401).json({message:"error generating accessToken"})
    }
    res.status(200).json({accesToken,message:"token refreshed"})

})
