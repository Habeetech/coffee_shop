import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A food must have a name"],
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: [true, "You must set a price for the food"],
    },
    category: {
        type: String,
        enum: ["vegan", "vegetarian", "non-vegetarian"],
        required: true,
        trim: true
    },
    url: {
        type: String,
        default: "",
        trim: true
    }
}, {timestamps: true})

const Food = mongoose.model("Food", foodSchema)
export default Food;