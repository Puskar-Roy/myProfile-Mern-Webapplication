const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpgenaretor = require("otp-generator");

// {"userName":"Puskar",
// "email":"email",
// "password":"password"}
const register = async (req, res) => {
  try {
    const { userName, email, password, profile,phone } = req.body;
    const userExist = await User.findOne({ email: email });
    const userExistName = await User.findOne({ userName: userName });
    if (userExistName) {
      return res.status(500).json({ error: "Please Use Different Username" });
    } else if (userExist) {
      return res.status(500).json({ error: "Please Use Different Email" });
    } else {
      const user = new User({
        userName,
        email,
        password,
        profile: profile || "",
        phone:phone
      });
      const userRegister = await user.save();
      if (userRegister) {
        res.status(201).json({ message: "Sign Up Done !" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

// { "userName": "Puskar", "password": "password" }
const login = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const userExistName = await User.findOne({ userName: userName });
    if (!userExistName) {
      return res.status(404).json({ error: "Username Not Found" });
    } else {
      const verifyPass = await bcrypt.compare(password, userExistName.password);
      if (verifyPass) {
        const token = await jwt.sign(
          { userId: userExistName._id, userName: userExistName.userName },
          process.env.SEC,
          { expiresIn: "24h" }
        );
        if (token) {
          res.status(201).json({
            message: "Log In Done !",
            userName: userExistName.userName,
            token: token,
          });
        }
      } else {
        return res.status(500).json({ error: "Invalid Details " });
      }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  const { username } = req.params;
  try {
    if (!username) {
      return res.status(501).json({ error: "Invalid Username" });
    } else {
      const userExistName = await User.findOne({ userName: username });
      if (userExistName) {
        const { password ,...rest } = Object.assign({},userExistName.toJSON());
        return res.status(201).send(rest);
      } else {
        return res.status(404).send({ error: "Can't Find User Data" });
      }
    }
  } catch (error) {
    return res.status(404).send({ error: "Can't Find User Data" });
  }
};



const updateUser = async (req,res)=>{
    try {
        const { userId } = req.user;
        if(userId){
            const body = req.body;
            const update = await User.updateOne({_id:userId},body);
            if(update){
                return res.status(201).send({ msg: "Record Updated" });
            }else{
                return res.status(404).send({ error: "Update Error" });
            }
        }else{
            return res.status(404).send({ error: "Can't Find Data" });
        }   
    } catch (error) {
    return res.status(404).send({ error: "Can't Update Data" });
        
    }

}



const genarateOtp = async (req,res)=>{
    req.app.locals.otp = await otpgenaretor.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
    res.send({code:req.app.locals.otp});
}










module.exports = {
  register: register,
  login: login,
  getUser: getUser,
  updateUser: updateUser,
  genarateOtp: genarateOtp
};
