require('dotenv').config()
const express=require('express')
const cors=require('cors')
const router=require('./routes/routes')
const foodRouter=require('./routes/foodRoutes')
const cartRouter=require('./routes/cartRoutes')
const orderRouter=require('./routes/orderRoutes')
const session = require('express-session');
// const GoogleStrategy = require('passport-google-oauth20').Strategy; 
require('./db/connection')
const projectApp=express()

projectApp.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);

projectApp.use(
    session({
        secret: '114535trfefegr',
        resave: false,
        saveUninitialized: true,
    })
);

projectApp.use(express.json())
projectApp.use(router)
projectApp.use(foodRouter)
projectApp.use(cartRouter)
projectApp.use(orderRouter)
projectApp.use("/images",express.static('uploads'))
const PORT=5002 || process.env.PORT

projectApp.listen(PORT,()=>{
    console.log(`Server Started AT Port Number ${PORT}`);
});

// projectApp.get('/',(req,res)=>{
//     res.send(`Api working `);
// }) 