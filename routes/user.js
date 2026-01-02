const express = require("express");
const router = express.Router( { mergeParams : true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");

const { isAuth, redirectUrl } = require("../utils/middlewares");

const userController = require("../controller/userController");

//JOI Schema ??

//MIDDLEWARE user VALIDATION musat be editedz
// const validateUser = (req,res,next) => {
//     console.log("FIRst line in validateUser");
//     let {error} = reviewSchema.validate(req.body);
//     console.log("validating the schema of review");
//     if( error ) {
//         let errorMessage = error.details.map(
//             element => element.message
//         ).join(", ");
//         throw new ExpressError(400,errorMessage);
//     } else {
//         console.log("Review validation passed");
//         next();
//     }  
// };


router.route("/signup").get( wrapAsync( 
   userController.signupGet)).post(
  wrapAsync(
    userController.signupPost
)
);





router.route("/login").get( 
     wrapAsync( 
        userController.loginGet
       
)).post(redirectUrl,  passport.authenticate("local",
    {
        failureRedirect: "/users/login",
        failureFlash: true
    }
), 
wrapAsync( 

   userController.loginPost
));



router.get("/logout", 
    userController.logout
)


module.exports = router;