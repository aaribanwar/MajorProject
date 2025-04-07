const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const dataObj = require("./data.js");


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main()
.then( res => console.log("Connection Successful") )
.catch( err => console.log(err) );

// const testListing = new Listing({
//     title: "Taj Hotel",
//     description: "5 Star hotel, with free breakfast brunch",
//     price: 8000,
//     location: "MG Road",
//     country: "India"
// });

// testListing.save()
// .then( res => console.log(res) )
// .catch( err => console.log(err) );





const initDB = async () => {
    await Listing.deleteMany({});
    try{
        await Listing.insertMany(dataObj.data);
        console.log("data initialised");
    }
    catch (err){
        console.log(err.message);
    }
    
};

initDB();