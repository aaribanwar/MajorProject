const { listingSchema, reviewSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

//unreachable code check 

module.exports.isAuth = (req, res, next) => {
     if( !req.isAuthenticated()){

        //html check browser
        if (req.accepts("html")) {
           req.session.redirectUrl = req.originalUrl;
        console.log("Auth check failed");
        req.flash("error","login to make changes");
        return res.redirect(303,"/users/login");

        }

         // Fallback to JSON for true API clients
        return res.status(401).json({
            error: "Authentication required"
        });
        
        
    }   

    next();
}


module.exports.isOwner = (req, res, next) => {
    if( req.user)
    {
     if (listing && listing.owner.equals(req.user._id)) {
        console.log("isOwner check passed");
        return next();
        }

     if (review && review.owner.equals(req.user._id)) {
        console.log("isOwner check passed");
        return next();
        }

    }

    //browser check html
    if (req.accepts("html")) {
             req.flash("error", "You do not have permission to edit this listing");
        console.log("Ownership check failed");
         return res.redirect(`/listings/${id}`);
        }

    return res.status(401).json({
                error: "Authentication required"
            });
       
}

module.exports.redirectUrl = (req,res,next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log("RedirectURL activated");
    console.log(res.locals.redirectUrl);
    next();
}


module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    console.log("validating the schema of lisitng");
    if( error ) {
        let errorMessage = error.details.map(
            element => element.message
        ).join(", ");
        throw new ExpressError(400,errorMessage);
    } else {
        console.log("listing was successfully validated");
        next();
    }  
};

//MIDDLEWARE REVIEWS VALIDATION
module.exports.validateReview = (req,res,next) => {
    console.log(req.body);
    let {error} = reviewSchema.validate(req.body);
    console.log("validating the schema of review");
    if( error ) {
        let errorMessage = error.details.map(
            element => element.message
        ).join(", ");
        throw new ExpressError(400,errorMessage);
    } else {
        console.log("Review validation passed");
        next();
    }  
};

