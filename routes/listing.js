const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema.js");
const connectFlash = require("connect-flash");
const listingController = require("../controller/listingController.js");

//require middleware utility
const { isAuth, validateListing, isOwner} = require("../utils/middlewares.js");

//passport
const passport = require("passport");


//CHECK IF REQUIRED IS CORRECT
//new reviews
const Review = require("../models/review");

router
    .route("/")
    .get(wrapAsync(listingController.getAll))
    .post(isAuth, validateListing, wrapAsync(listingController.post));



router.get("/new", isAuth, 
   listingController.createForm
);

//Random ReRouting
router.get("/random", wrapAsync( 
    listingController.random
));

//Editing
router.get("/:id/edit", isAuth, isOwner,  wrapAsync(
    
   listingController.editForm
));




router.route("/:id")
     .get( wrapAsync(
   listingController.getOne
))
    .put(
   isAuth, isOwner,
    validateListing,
    wrapAsync(
        
        listingController.put
        

)
)
//delete
.delete( isAuth, isOwner, wrapAsync(
    
   listingController.delete

));






   















module.exports = router;