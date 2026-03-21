import mongoose from "mongoose";

const optionItem = new mongoose.Schema({
    label: {
        type: String,
        trim: true,
    },
    priceModifier: {
        type: Number,
        min: [0, "Price Modifier cannot be less than Zero"]
    }
});
const drinkOptionsSchema = new mongoose.Schema({
   options: {
    type: Map,
    of: [optionItem]
   }
})
const drinkOptions = mongoose.model("drinkOptions", drinkOptionsSchema);
export default drinkOptions;