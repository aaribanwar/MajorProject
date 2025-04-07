const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const listingRoutes = require("./routes/listing");
const ejsMate = require("ejs-mate");




const port = 8080;
const app = express();
app.listen(port, () => {
    console.log(`listening at port: ${port}`);
});
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main()
.then( res => console.log("mongo connection successful"))
.catch( err => console.log(err));

app.get("/", (req,res) => res.send("Landing Page"));

app.use("/listings", listingRoutes);