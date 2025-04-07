const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");

router.get("/", async (req, res) => {
    let listings = await Listing.find({});
    //res.send("get is working");
    res.render("listings/index.ejs",{listings: listings});
});

//post new
router.post("/", async (req,res) => {
    // let {title, description, image, price, location, country } = req.body;
    // let listing = new Listing({
    //     title: title,
    //     description: description,
    //     image: image,
    //     price: price,
    //     location: location,
    //     country: country
    // });
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
});
router.get("/new", (req,res) => {
    console.log("Entered new log");
    res.render("./listings/new.ejs");
})


router.get("/:id", async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing: listing});
});


//Editing
router.get("/:id/edit", async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing: listing});
});
router.put("/:id", async (req,res) => {
    let {id} = req.params;
    let {title, description, price} = req.body;
    await Listing.findByIdAndUpdate(id, {title: title, description: description, price: price})
    res.redirect(`/listings/${id}`);
});


//delete
router.delete("/:id", async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})


module.exports = router;