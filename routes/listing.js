const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema.js");
const connectFlash = require("connect-flash");

//require middleware utility
const { isAuth, validateListing, isOwner} = require("../utils/middlewares.js");

//passport
const passport = require("passport");


//CHECK IF REQUIRED IS CORRECT
//new reviews
const Review = require("../models/review");


router.get("/", wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    //res.send("get is working");
    
    res.render("listings/index.ejs",{listings: listings});
}));




//post new
router.post("/", isAuth, validateListing, wrapAsync(async (req,res,next) => {
    
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    

    
    await listing.save();
    if( listing) {
    req.flash("success", "New listing created successfully! :)");
    }
    else {
        req.flash("error","New listing was not saved :(");
    }
    res.redirect("/listings");
}
));


router.get("/new", isAuth, (req,res) => {
    
   
    console.log("Auth check for new succeeded");
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
    let listing = await Listing.findById(id).populate(
        {
        path: "reviews",
        populate: { path: "owner"},
        }
        ).populate("owner");
   
    if( listing ){
        req.flash("success", "listing exists! yayyy");
    }
    else{
        req.flash("error","listing not exist :(");
        res.redirect("/listings");
    }
    // res.cookie("specificid","cookiehasbeensaved");
    res.render("listings/show.ejs",{listing: listing});
}));


//Editing
router.get("/:id/edit", isAuth, isOwner,  wrapAsync(async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

      if( listing ){
        req.flash("success","ID matched and we did the edit");
    }
    else {
        req.flash("error","Error :( ID did not match");
        res.redirect("/listings");
    }
     req.flash("success","ID matched and we did the edit");
    res.render("./listings/edit.ejs",{listing: listing});
}));


router.put(
    "/:id", isAuth, isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        // if (req.user && !listing.owner.equals(req.user._id)) {
        //     req.flash("error", "You do not have permission to edit this listing");
        //     return res.redirect(`/listings/${id}`);
        // }

        await Listing.findByIdAndUpdate(
            id,
            req.body.listing,
            { runValidators: true }
        );

        req.flash("success", "Listing updated successfully");
        res.redirect(`/listings/${id}`);
    })
);





//delete
router.delete("/:id", isAuth, isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

      if( ! listing.owner.equals(req.user._id)) {
        req.flash("error","Error :( ID did not match, you dont have permission");
        res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndDelete(id);

    req.flash("success","the listing was deleted odfvnuvuv");

    res.redirect("/listings");
}));



module.exports = router;