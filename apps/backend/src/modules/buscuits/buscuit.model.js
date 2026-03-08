import mongoose from "mongoose";

const buscuitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A buscuit must have a name"],
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: [true, "You must set a price for the buscuit"],
    },
    url: {
        type: String,
        default: "",
        trim: true
    }
}, {timestamps: true})

const Buscuit = mongoose.model("Buscuit", buscuitSchema)
export default Buscuit;