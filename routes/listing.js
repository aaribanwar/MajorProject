const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const listingSchema = require("../schema.js");


router.get("/", wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    //res.send("get is working");
    res.render("listings/index.ejs",{listings: listings});
}));

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    console.log("sdkjvbduvbdsuovbduvbdubcdocbCHECK");
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
})


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

router.put("/:id", validateListing, wrapAsync(async (req,res) => {
    let {id} = req.params;
    let {title, description, price} = req.body;
    await Listing.findByIdAndUpdate(id, {title: title, description: description, price: price})
    res.redirect(`/listings/${id}`);
}));


//delete
router.delete("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


module.exports = router;