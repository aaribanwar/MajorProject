const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const listingSchema = require("../schema.js");

//new reviews
const Review = require("../models/review");


router.get("/", wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    //res.send("get is working");
    res.render("listings/index.ejs",{listings: listings});
}));

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    console.log("validating the schema");
    if( error ) {
        let errorMessage = error.details.map(
            element => element.message
        ).join(", ");
        throw new ExpressError(400,errorMessage);
    } else {
        next();
    }
    
}

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
    let listing = await Listing.findById(id);
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
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//REVIEWSSSSSS
//posting to the id
router.post("/:id/reviews", wrapAsync(async (req, res) => {

    console.log("We are in post");
    //access the listing
    let listing = await Listing.findById(req.params.id);

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
router.get(":/id/reviews", wrapAsync( async (req,res) => {
    res.send("THIS WILL SHOW ALL THE REVIEWS");
}))


module.exports = router;