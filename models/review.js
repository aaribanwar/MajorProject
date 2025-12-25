const mongoose = require("mongoose");

//  async function main(){
//     await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
// }

// main()
// .then(res => console.log("review mongoose connected"))
// .catch(err => console.log(err));

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;            


