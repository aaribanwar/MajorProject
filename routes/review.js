const express = require("express");
const router = express.Router({ mergeParams : true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema.js");

//middleware for login
const {isAuth,  validateReview, isOwner} = require("../utils/middlewares.js");

const reviewController = require("../controller/reviewController.js");

//REVIEWSSSSSS

router.get("/",
    reviewController.get
);

//posting to the id
router.post("/", isAuth, validateReview,  wrapAsync(
   reviewController.post
));


router.delete("/:reviewId" , isAuth, isOwner, wrapAsync( 
    reviewController.delete

));

module.exports = router;
