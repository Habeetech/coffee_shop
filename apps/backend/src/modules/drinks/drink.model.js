import mongoose from "mongoose";

const drinkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A drink must have a name"], 
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ["hot-coffee", "iced-coffee", "tea", "iced-tea", "milkshake", "smoothies"],
        required: true,
        trim: true
    },
    url: {
        type: String,
        default: "",
        trim: true
    },
}, { timestamps: true });

const Drink = mongoose.model("Drink", drinkSchema);
export default Drink;