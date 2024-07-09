const express=require('express')
const foodController=require('../controller/foodController')
const multer=require('multer')
const foodRouter=express.Router();

//image storage engine
const storage=multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload=multer({storage:storage})


foodRouter.post('/add',upload.single('image'),foodController.addfood)
foodRouter.get('/foodlist',foodController.listFood)
foodRouter.post('/remove',foodController.removeFood)



module.exports=foodRouter;