const orderModel = require('../models/orderModel');
const user = require('../models/userModel');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:3000";

  try {
    // Create a new order
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // Save the new order to the database
    await newOrder.save();

    await user.findByIdAndUpdate(req.body.userId, { cartdata: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name, 
        },
        unit_amount: item.price * 100 * 80, 
      },
      quantity: item.quantity, 
    }));

    
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80, // Assuming delivery charges are 2 units
      },
      quantity: 1,
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment', 
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`, 
    });

    // Send session URL back to client
    res.json({ success: true, session_url: session.url }); 
  } catch (error) {
    console.log("Error placing order:", error);
    res.json({ success: false, message: 'Error placing order' });
  }
};

// Verify order payment
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") { 
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment not verified" });
    }
  } catch (error) {
    console.log("Error verifying order:", error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

// Get user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("Error fetching user orders:", error);
    res.json({ success: false, message: 'Error fetching orders' });
  }
};


// listing orders for admin panel
 const listOrders=async(req,res)=>{
  try {
    const orders=await orderModel.find({})
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
  }
 }

 // order status api

 const updateStatus=async(req,res)=>{
try {
  await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
  res.json({success:true,message:"Status Updated"})
} catch (error) {
  console.log("Error");
  res.json({success:false,message:"Error"})
  }
 }

module.exports = { placeOrder, verifyOrder, userOrders,listOrders,updateStatus };
