const express=require('express')
const orderController=require('../controller/orderContoller')
const authMiddleware=require('../Middleware/auth')

const orderRouter=express.Router()

orderRouter.post('/order/placeOrder',authMiddleware,orderController.placeOrder)
// orderRouter.post('/order/verify',orderController.verifyOrder)
module.exports=orderRouter;