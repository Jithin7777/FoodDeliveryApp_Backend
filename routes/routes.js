const express=require('express')
const router=new express.Router()
const userController=require('../controller/userController')
const jwtMiddleware = require('../Middleware/jwtMiddleware')
const emailVerification=require('../controller/emailController')
const phoneContoller=require('../controller/phoneController')

// user register 
router.post('/user/register',userController.register)

// user login 
router.post('/user/login',userController.login)

// googleLogin
router.post("/api/googleLogin", userController.googleLogin);

//admin login
router.post('/admin',jwtMiddleware,userController.dummyAPI)

// emailOTP 
router.post("/emailOtp",emailVerification.sendEmail);

// email verification 
router.post("/emailverification",emailVerification.verifyOtp);

// phone otp 
router.post("/phoneOtp",phoneContoller.sendPhoneOtp)
router.post('/phoneotpverify',phoneContoller.verifyPhoneOtp)
module.exports=router;