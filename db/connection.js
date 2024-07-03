const mongoose=require('mongoose')
const connectionString=process.env.database
mongoose.connect(connectionString).then(()=>{
    console.log('MongoDB Atlas Connected');
}).catch((error)=>{
console.log(`MongoDB Connection Failed${error}`);
});