import mongoose from "mongoose";

const crispSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A crisp must have a name"],
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: [true, "You must set a price for the crisp"],
    },
    url: {
        type: String,
        default: "",
        trim: true
    }
}, { timestamps: true });

const Crisp = mongoose.model("Crisp", crispSchema);
export default Crisp;