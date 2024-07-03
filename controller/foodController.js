const foodSchema=require('../models/foodModel')
const fs=require('fs')

//add food item


const addfood = async(req,res)=>{
    try {
      if(!req.file){
        res.status(400).json({success:false,message:'image file is required'})
      }

    let image_filename=`${req.file.filename}`;
    const food=new foodSchema({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:image_filename,
        category:req.body.category
    })
   
        await food.save()
        res.status(200).json({success:true,message:"Food Added Successfully",food})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }

}

module.exports= {addfood}