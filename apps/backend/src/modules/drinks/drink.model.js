import mongoose from "mongoose";

const drinkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A drink must have a name"], 
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
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