const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const listingSchema = require("./schema.js");
//cookie parser
const cookieParser = require("cookie-parser");
//session
const session = require('express-session')
//connect flash
const connectFlash = require("connect-flash");





const sessionOptions = {
        secret: "mysecretstring",
        resave: false,
        saveUninitialized: true,
        cookie : {
            expires: Date.now() + 7*24*60*60*1000,
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
        }
    };


const port = 8080;
const app = express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


//middleware for session
app.use(session( 
    sessionOptions
));

//middleware for flash
app.use( connectFlash());
//setting up the flash messages
/* make flash available to all views */
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//cookie parser middleware
app.use( cookieParser() );

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended: true }));
app.use(express.json()); //new add
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main()
.then( res => console.log("mongo connection successful"))
.catch( err => console.log(err));


//testing the session
app.get("/test", (req,res) => {
   
     if( req.session.count){
        req.session.count++;
    }
    else{
         req.session.count = 1;
    }
    res.send(`testing for session will be done, count is: ${req.session.count}`);
   
})

app.get("/", (req,res) => res.redirect("/listings"));

app.use("/listings", listingRoutes);

//new route added
app.use("/listings/:id/reviews", reviewRoutes);

//URL REVEALEER, FOR DEV TESTING
//TEMP
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    console.log("Cookies: ",req.cookies);
    next();
});


app.all("*", (req,res,next) => {
    //implement print of what was not found
    next(new ExpressError(404, "PAGEEE NOTTT FOUNDDDD"));
});
//ERROR Handler
app.use((err,req,res,next) => {
    let {status=500, message="Default Error" } = err;
    console.log("Error handler in app.js activated, app.use wala below is the status and message");
    console.log("STATUS:", status);
    console.log("MESSAGE:", message);
    res.render("./listings/error.ejs",{err:err});
    //res.status(status).send(message);
});




app.listen(port, () => {
    console.log(`listening at port: ${port}`);
});