const mongoose=require('mongoose')
const phoneSchema=new mongoose.Schema({
    phone:{
        type:String
    },
    otp:{
        type:String
    },
    createdAt: Date,
    expiresAt: Date,
})

module.exports=mongoose.model("phoneOTP",phoneSchema)
module.exports.phoneOTP