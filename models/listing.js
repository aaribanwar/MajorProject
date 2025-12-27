const mongoose = require("mongoose");
const Review = require("./review"); // adjust path as needed

const { Schema } = mongoose;

const defaultImage = {
    filename: "default-image",
    url: "https://thumbs.dreamstime.com/z/no-image-available-icon-177641087.jpg"
};

const listingSchema = new Schema({
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
        default: defaultImage,
        set: (v) => {
            if (!v || !v.url) {
                return defaultImage;
            }
            return v;
        }
    },

    price: {
        type: Number
    },

    location: {
        type: String
    },

    country: {
        type: String
    },

    // reviews array
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        console.log("In cascade of delete from review");
        await Review.deleteMany( { _id: { $in : listing.reviews }});
    }
});

module.exports = mongoose.model("Listing", listingSchema);
