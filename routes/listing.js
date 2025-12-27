const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema.js");

//CHECK IF REQUIRED IS CORRECT
//new reviews
const Review = require("../models/review");


router.get("/", wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    //res.send("get is working");
    res.render("listings/index.ejs",{listings: listings});
}));

//VALIDATION MIDDLEWARES
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    console.log("validating the schema of lisitng");
    if( error ) {
        let errorMessage = error.details.map(
            element => element.message
        ).join(", ");
        throw new ExpressError(400,errorMessage);
    } else {
        next();
    }  
};

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


//post new
router.post("/", validateListing, wrapAsync(async (req,res,next) => {
    
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
}
));
router.get("/new", (req,res) => {
    console.log("Entered new log");
    res.render("./listings/new.ejs");
});

//Random ReRouting
router.get("/random", wrapAsync(async (req, res) => {
    const listing = await Listing.aggregate([
        { $sample: { size: 1 } }
    ]);

    if (!listing.length) {
        // No listings exist
        return res.redirect("/");
    }

    res.redirect(`/listings/${listing[0]._id}`);
}));




router.get("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    
    res.render("listings/show.ejs",{listing: listing});
}));


//Editing
router.get("/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing: listing});
}));


// router.put("/:id", validateListing, wrapAsync(async (req,res) => {
//     let {id} = req.params;
//     let {title, description, price} = req.body;
//     await Listing.findByIdAndUpdate(id, {title: title, description: description, price: price})
//     res.redirect(`/listings/${id}`);
// }));

router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;

    // If user clears image URL, keep existing image
    if (!req.body.listing.image?.url) {
        delete req.body.listing.image;
    }

    await Listing.findByIdAndUpdate(id, req.body.listing);

    res.redirect(`/listings/${id}`);
}));





//delete
router.delete("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    for (const reviewId of listing.reviews) {
    await Review.findByIdAndDelete(reviewId);
}

    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
}));

//REVIEWSSSSSS
//posting to the id
router.post("/:id/reviews", validateReview,  wrapAsync(async (req, res) => {

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
    //res.send("New review has been saved");
    res.redirect(`/listings/${req.params.id}`);
}));

//REVIEW GET FOR ONE
router.get("/:id/reviews", wrapAsync( async (req,res) => {

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

router.delete("/:id/reviews/:reviewId" , wrapAsync( async ( req, res) => {

    await Review.findByIdAndDelete(req.params.reviewId);
    await Listing.findByIdAndUpdate(req.params.id, {$pull:{ reviews: req.params.reviewId }} );
    
   res.redirect(`/listings/${req.params.id}`);

}));


module.exports = router;