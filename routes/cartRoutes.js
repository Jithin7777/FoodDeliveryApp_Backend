const express=require('express')
const cartController=require('../controller/cartController')
const authMiddleware=require('../Middleware/auth')
const cartRouter=express.Router()


cartRouter.post('/cart/add',authMiddleware,cartController.addToCart)
cartRouter.post('/cart/remove',authMiddleware,cartController.removeFromUserCart)
cartRouter.post('/cart/get',authMiddleware,cartController.getUserCart)


module.exports=cartRouter;