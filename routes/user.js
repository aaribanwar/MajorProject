const express = require("express");
const router = express.Router( { mergeParams : true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");

const { isAuth, redirectUrl } = require("../utils/middlewares");



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

router.get("/signup", wrapAsync( async ( req, res) => {
    res.render("./users/signup.ejs");
}));


router.post(
  "/signup",
  wrapAsync(async (req, res) => {

    try{

    const { username, email, password } = req.body;
    console.log(password);
    if (!password) {
      throw new ExpressError(400, "Password is required");
    }

    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (e) => {
        if(e){
            return next(e);
        }
        console.log("login after sinup automatic");
         req.flash("success", "Welcome New User :)");
        res.redirect("/listings");
    });
   
}
catch(err) {
    req.flash("error",err.message);
    res.redirect("/users/signup");
}
  })
);


router.get("/login", 
     wrapAsync( 
        async ( req, res) =>
             {

                res.render("./users/login.ejs");
            }
)
);

router.post("/login",redirectUrl,  passport.authenticate("local",
    {
        failureRedirect: "/users/login",
        failureFlash: true
    }
), 
wrapAsync( 
    async(req,res) =>
    {
       
        req.flash("success","Welcome, you have logged in :)");
        
        const URL = res.locals.redirectUrl || "/listings";
        res.redirect(URL);
    }
));

router.get("/logout", (req,res, next) => 
    {
        req.logout( (err) => {
            if(err){
            return next(err);
            }
            req.flash("success","you have logged out");
            res.redirect("/listings");
        })
})


module.exports = router;