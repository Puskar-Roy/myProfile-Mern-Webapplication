const User = require('../model/userModel');
const jwt = require("jsonwebtoken");


const verifyUser = async (req,res,next)=>{
    try {
        const { userName } = req.body;
        const findUser = await User.findOne({userName:userName});
        if(!findUser){
        res.status(400).json({ error: "Can't Find User" });  
        }
        next();
    } catch (error) {
        return res.status(400).json({ error: "Authentication Error " });
        
    }
}


const authMiddlewear = async (req,res,next)=>{
    try {
      const token = req.headers.authorization.split(" ")[1];
        const user = await jwt.verify(token,process.env.SEC);
          if(user){
            req.user = user;
            next();
          }
    } catch (error) {
        console.log(error);
        
    }
}


const localVar = async (req,res,next)=>{
  req.app.locals = {
    otp : null,
    resetSession: false
  }
  next();
}


module.exports = {
  verifyUser : verifyUser,
  authMiddlewear:authMiddlewear,
  localVar:localVar
};
