const express = require("express");
const router = express.Router({ mergeParams : true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema.js");

//middleware for login
const {isAuth,  validateReview, isOwner} = require("../utils/middlewares.js");



//REVIEWSSSSSS

router.get("/", (req, res) => {
    res.redirect(`/listings/${req.params.id}`);
});

//posting to the id
router.post("/", isAuth, validateReview,  wrapAsync(async (req, res) => {

    console.log("We are in post");
    //access the listing
    let listing = await Listing.findById(req.params.id);
    console.log("RAW ID PARAM:", req.params.id);

    if( !listing ){
         throw new ExpressError(400, "Listing does not exist lol");
    }

    let newReview = new Review(req.body.review);
    newReview.owner = req.user._id;
    console.log(newReview);
    //push the new review
    listing.reviews.push(newReview._id); // ✅
    await listing.save(); 


    await newReview.save();
    console.log("New reivew saved");
    req.flash("success","New RRREEEVIVIIWWWW SAVEDD");
    res.redirect(`/listings/${req.params.id}`);
}));


router.delete("/:reviewId" , isAuth, isOwner, wrapAsync( async ( req, res) => {

    await Review.findByIdAndDelete(req.params.reviewId);
    await Listing.findByIdAndUpdate(req.params.id, {$pull:{ reviews: req.params.reviewId }} );
    req.flash("success","REVIEWWWWWWWWWW deleted");
   res.redirect(`/listings/${req.params.id}`);

}));

module.exports = router;
//route is : /:id/reviews


//where is validatereviews used