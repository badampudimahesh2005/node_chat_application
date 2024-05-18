const mongoose=require('mongoose');

 const chatSchema =new mongoose.Schema({
    sender_id:{
        //we r storing sender id ka object
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiver_id:{
        //we r storing sender id ka object
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    message:{
        type:String,
        required:true
    }
    
}, {timestamps:true}
);

module.exports=mongoose.model('Chat',chatSchema);
