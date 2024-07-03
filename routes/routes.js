const express=require('express')
const router=new express.Router()
const userController=require('../controller/userController')
const jwtMiddleware = require('../Middleware/jwtMiddleware')
const emailVerification=require('../controller/emailController')
const phoneContoller=require('../controller/phoneController')
router.post('/user/register',userController.register)
router.post('/user/login',userController.login)
// googleLogin
router.post("/api/googleLogin", userController.googleLogin);
//admin login
router.post('/admin',jwtMiddleware,userController.dummyAPI)


router.post("/emailOtp",emailVerification.sendEmail);
router.post("/emailverification",emailVerification.verifyOtp);
router.post("/phoneOtp",phoneContoller.sendPhoneOtp)
module.exports=router;