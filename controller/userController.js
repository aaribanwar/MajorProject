const User = require("../models/user");

module.exports.signupGet =  async ( req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.signupPost = async (req, res) => {

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
  }


module.exports.loginGet =  async ( req, res) =>
             {

                res.render("./users/login.ejs");
            }


module.exports.loginPost =  async(req,res) =>
    {
       
        req.flash("success","Welcome, you have logged in :)");
        
        const URL = res.locals.redirectUrl || "/listings";
        res.redirect(URL);
    }


module.exports.logout = (req,res, next) => 
    {
        req.logout( (err) => {
            if(err){
            return next(err);
            }
            req.flash("success","you have logged out");
            res.redirect("/listings");
        })
}