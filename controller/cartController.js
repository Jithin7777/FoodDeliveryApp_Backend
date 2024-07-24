const User=require('../models/userModel')

// add items to user cart
const addToCart= async(req,res)=>{
try {
    // let userData=await User.findOne({_id:req.body.userId});
    let userData=await User.findById(req.body.userId)
    let cartData=await userData.cartData;
    if(!cartData[req.body.itemId]){
        cartData[req.body.itemId]=1
    }
    else{
        cartData[req.body.itemId] +=1;
    }
        await User.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({success:true,message:"Added To Cart"});
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
}
}


//Remove items from user cart

const removeFromUserCart=async(req,res)=>{

    try {
        let userData=await User.findById(req.body.userId)
        let cartData=await userData.cartData
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -= 1;
        }
        await User.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Removed from cart"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}


//fetch user cart data

const getUserCart=async(req,res)=>{
try {
let userData=await User.findById(req.body.userId)
let cartdata=await userData.cartData
res.json({success:true,cartdata})

} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
}
}

module.exports={addToCart,removeFromUserCart,getUserCart}