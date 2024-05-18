require('dotenv').config();
const mongoose=require("mongoose");

async function main(){
    await  mongoose.connect('mongodb://127.0.0.1:27017/dynamic-chat-app');
    
}
main()
.then(()=>console.log("conenction succesful"))
.catch(err=>console.log(err));
const app=require('express')();
// const http=require("http").Server(app);


const userRoute=require('./routes/userRoute');
app.use('/',userRoute); //use it as middleware for this root 

app.listen(3000);
