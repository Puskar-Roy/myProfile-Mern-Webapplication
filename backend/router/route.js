const Router = require('express');
const { register, login , getUser , updateUser , genarateOtp} = require('../controller/appController')
const User = require("../model/userModel");
const { verifyUser , authMiddlewear , localVar } = require("../middlewears/middlewear");




const router = Router();

router.post("/register",register);
router.post("/authenticate", (req, res) => {res.end()});
router.post("/login",verifyUser, login);

router.get("/user/:username", getUser);
router.get("/genarateOtp", verifyUser, localVar , genarateOtp);
router.get("/verifyOtp", (req, res) => { });
router.get("/recovary", (req, res) => { });

router.put("/updateProfile", authMiddlewear ,updateUser);
router.put("/resetPassword", (req, res) => { });







module.exports = router
// export default router