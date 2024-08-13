const express=require('express')
const orderController=require('../controller/orderContoller')
const authMiddleware=require('../Middleware/auth')

const orderRouter=express.Router()

orderRouter.post('/order/placeOrder',authMiddleware,orderController.placeOrder)
orderRouter.post('/order/verify',orderController.verifyOrder)
orderRouter.post('/order/userorders',authMiddleware,orderController.userOrders)
orderRouter.get('/order/userorderslist',orderController.listOrders)
orderRouter.post('/order/orderstatus',orderController.updateStatus)

module.exports=orderRouter;