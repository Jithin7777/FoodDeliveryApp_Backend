// const { Message } = require('twilio/lib/twiml/MessagingResponse')
const orderSchema=require('../models/orderModel')
const user=require('../models/userModel')
const Stripe=require('stripe')



const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

//placing user order from frontend

const placeOrder=async(req,res)=>{
    const frontend_url=" http://localhost:3000"
try {
    const newOrder=new orderSchema({
        userId:req.body.userId,
        items:req.body.items,
        amount:req.body.amount,
        address:req.body.address 

    })
    await newOrder.save();
    await user.findByIdAndUpdate(req.body.userId,{cartdata:{}})
    const line_items=req.body.items.map(()=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:item.name
            },
            unit_amount:item.price*100*80
        },
        quantity:item.quantity
    }))

    line_items.push({
        price_data:{
            currency:"inr",
            product_data:{
                name:"Delivery Charges"
            },
            unit_amount:2*100*80
        },
        quantity:1
    })

    const session=await stripe.checkout.sessions.create({
        line_items:line_items,
        mode:'payments',
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?false=true&orderId=${newOrder._id}`,

    })

    res.json({success:true,session_url:session_url})
} catch (error) {
    console.log(error);
    res.json({success:false,message:'error'})
}
}

module.exports={placeOrder}