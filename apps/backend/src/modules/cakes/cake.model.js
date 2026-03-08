import mongoose from "mongoose";

const cakeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A cake must have a name"],
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: [true, "You must set a price for the cake"],
    },
    category: {
        type: String,
        enum: ["whole-cake", "loaf-cake", "shortbreads", "pastries"],
        required: true,
        trim: true
    },
    url: {
        type: String,
        default: "",
        trim: true
    }
}, {timestamps: true})

const Cake = mongoose.model("Cake", cakeSchema)
export default Cake;