// could be a hotel or a flat or a villa: all are listings

const mongoose = require("mongoose");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}
~
main()
.then( res => console.log("mongo connected" ))
.catch( err => console.log(err) );

const defaultImage = {
    filename: "default-image",
    url: "https://thumbs.dreamstime.com/z/no-image-available-icon-177641087.jpg"
};
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: { 
    type: {
        filename: String,
        url: String
    },
        set: (v) => (v && v.url) ? v : defaultImage ,
        default: defaultImage
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    }


})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;