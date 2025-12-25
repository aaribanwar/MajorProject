const mongoose = require("mongoose");
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

module.exports = mongoose.model("Listing", listingSchema);
