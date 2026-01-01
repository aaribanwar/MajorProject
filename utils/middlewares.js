module.exports.isAuth = (req, res, next) => {
     if( !req.isAuthenticated()){

        req.session.redirectUrl = req.originalUrl;
        console.log("Auth check failed");
        req.flash("error","login to make changes");
        return res.redirect("/users/login");
    }
    next();
}

module.exports.redirectUrl = (req,res,next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log("RedirectURL activated");
    console.log(res.locals.redirectUrl);
    next();
}

