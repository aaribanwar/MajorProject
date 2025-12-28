const express = require("express");
const router = express.Router({ mergeParams : true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema.js");


//MIDDLEWARE REVIEWS VALIDATION
const validateReview = (req,res,next) => {
    console.log("FIRst line in validateReview");
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

//REVIEWSSSSSS
//posting to the id
router.post("/", validateReview,  wrapAsync(async (req, res) => {

    console.log("We are in post");
    //access the listing
    let listing = await Listing.findById(req.params.id);
    console.log("RAW ID PARAM:", req.params.id);

    //console.log(listing);

    if( !listing ){
         throw new ExpressError(400, "Listing does not exist lol");
    }

    let newReview = new Review(req.body.review);

    //push the new review
    listing.reviews.push(newReview._id); // ✅
    await listing.save(); 


    await newReview.save();
    console.log("New reivew saved");
    req.flash("success","New RRREEEVIVIIWWWW SAVEDD");
    //res.send("New review has been saved");
    res.redirect(`/listings/${req.params.id}`);
}));

//REVIEW GET FOR ONE
router.get("/", wrapAsync( async (req,res) => {

     let listing = await Listing.findById(req.params.id).populate("reviews");
     console.log(listing);
     let reviews = listing.reviews;
     for( let review of reviews){
        console.log(review.comment);
        console.log(review.rating);
        console.log(review.id);
     }
    res.send("get is working");
    //res.send("listings/index.ejs",{listings: listings});
}));

router.delete("/:reviewId" , wrapAsync( async ( req, res) => {

    await Review.findByIdAndDelete(req.params.reviewId);
    await Listing.findByIdAndUpdate(req.params.id, {$pull:{ reviews: req.params.reviewId }} );
    req.flash("success","REVIEWWWWWWWWWW deleted");
   res.redirect(`/listings/${req.params.id}`);

}));

module.exports = router;
//route is : /:id/reviews