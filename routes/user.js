const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
// Controller
const userController=require("../controllers/users.js");


router.route("/signup")
.get(userController.renderSigninForm )

.post(wrapAsync(userController.signup));

// passport.authenticate() is a middleware jo ki hamre post se pehle login k liye authentication k liye use hota hai


router.route("/login")
.get(userController.renderLoginForm)

.post(saveRedirectUrl,
passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true,
}),userController.login);



router.get("/logout",userController.logout);

module.exports=router;