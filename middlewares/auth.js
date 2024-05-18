//main moto of this when we r in login page and when i try to access /dashboard then it will give u the error
//to handle this we can using this middleware

const isLogin=async function(req,res,next){
    try{
        if(req.session.user){}
        else res.redirect('/');
        next();
    }
    catch(err){
        console.log(err);
    }
}


const isLogout=async function(req,res,next){
    try{
        if(req.session.user){
            res.redirect('/');
        }
        next();
    }
    catch(err){
        console.log(err);
    }
}



module.exports={
    isLogin,
    isLogout
}