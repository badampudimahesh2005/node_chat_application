
require('dotenv').config();


const mongoose=require("mongoose");
const port=process.env.PORT || 3000;


async function main(){
    await  mongoose.connect('mongodb://127.0.0.1:27017/dynamic-chat-app');
     
}


main()
.then(()=>console.log("conenction succesful"))
.catch(err=>console.log(err));


const app=require('express')();
const http=require("http").Server(app);



const userRoute=require('./routes/userRoute');
const User=require('./models/userModel');
const Chat=require('./models/chatModel');
app.use('/',userRoute); //use it as middleware for this root 

// ********************************************************************************************

// How to update the user status online or offline in DB 

// 1.On user logout
// 2. on Tab Close or Browser Close Or Suddenly SYStem ShutDown
// 3.on cut the internet conenction

const io=require('socket.io')(http);
var usp=io.of('/user-namespace');

usp.on('connection', async function(socket){
    console.log('User Connected');
    //in socket we get the id sended from frontend . in socket =>handshake section=> auth:{token: id is here}.u can clearly see if u print socket
    // console.log(socket.handshake.auth.token);

    var userId=socket.handshake.auth.token;
   await  User.findByIdAndUpdate({_id:userId},{$set:{is_online:'1'}});

        //USER broadcast online status
        // informing all users that this userid is online
        socket.broadcast.emit('getOnlineUser',{user_id:userId});

    socket.on('disconnect',async function(){

        console.log("user Disconnected");
        var userId=socket.handshake.auth.token;
        await  User.findByIdAndUpdate({_id:userId},{$set:{is_online:'0'}});
    //user broadcast offline status 
    socket.broadcast.emit('getOfflineUser',{user_id:userId});
    });


    //chatting implementation
    socket.on('newChat',function(data){
        socket.broadcast.emit('loadNewChat',data);
    })

    //load old chats
    socket.on('existsChat',async function(data){
          var chats=await   Chat.find({$or:[
                {sender_id:data.sender_id,receiver_id:data.receiver_id},
                {sender_id:data.receiver_id,receiver_id:data.sender_id}
           
            ]});
            socket.emit('loadChats',{chats:chats});
    })


});

// app.listen(3000);
http.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
