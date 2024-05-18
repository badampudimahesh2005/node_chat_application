const express=require('express');
const user_route=express();
const path=require('path');
const bodyParser=require('body-parser');

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));
user_route.use(express.static(path.join(__dirname, "public")));
user_route.set("view engine",'ejs');
user_route.set("views","./CHAT_APP/views");
user_route.use(express.static('./CHAT_APP/public'));

// **********************
const session=require('express-session');
const {SESSION_SECRET}=process.env; //.env file
user_route.use(session({secret:SESSION_SECRET}));

// ****************

const multer=require('multer'); //Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files in web applications built with Node.js and Express.js.

const storage=multer.diskStorage({
    destination:function(req,file,cb){
cb(null,path.join(__dirname,'../public/images'));
    },
    filename:function(req,file,cb){
        const name=Date.now()+"-"+file.originalname;
        cb(null,name);
    }
});
// *********************************************************8
const upload=multer({storage:storage});
const userController =require('../controllers/userController');

const auth=require('../middlewares/auth');
//before opening register route we r checking is user is logined or logout 
user_route.get('/register',auth.isLogout,userController.registerLoad);
user_route.post('/register',upload.single('image'),userController.register);

// **************************************










user_route.get('/',userController.loadLogin);
user_route.post('/',userController.login);
user_route.get('/logout',auth.isLogin,userController.logout);
//untill u logout u didnot go to login page  or dashboard 
user_route.get("/dashboard",auth.isLogin,userController.loadDashboard);


user_route.post('/save-chat',userController.saveChat);

user_route.get("*",function(req,res){
    res.redirect("/");
})




module.exports=user_route;