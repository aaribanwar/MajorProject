const mongoose = require("mongoose");

 async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

await main();

reviewSchema = mongoose.Schema({
    content: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;            


