import {Router} from 'express'
import {body} from 'express-validator'
import { loginUser, logOutUser, refreshAccessToken, registerUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/jwtVerify.js';
const router=Router();
router.post(
    '/register',
    [
      body('userName')
        .isLength({ min: 3 })
        .withMessage('Username should be at least 3 characters long'),
  
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
  
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters long'),
    ],
    registerUser
  );
  router.post(
    '/login',
    [
      
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
  
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters long'),
    ],
  loginUser
  );
  router.post('/logout',verifyToken,logOutUser)
  router.post('/refresh',refreshAccessToken)

export default router