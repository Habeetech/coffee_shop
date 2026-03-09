import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postal: String
  },
  phone: {
    type: String,
    trim: true
  },
  openingHours: {
    monday: {type: String},
    teusday: {type: String},
     wednesday: {type: String},
    thursday: {type: String},
     friday: {type: String},
    saturday: {type: String},
    sunday: {type: String}
  }
}, { timestamps: true });

const Store = mongoose.model("Store", storeSchema);
export default Store;