import Drink from "../modules/drinks/drink.model.js";
import drinks from "../seeders/drinkSeed.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const seedDrinks = async () => {
    try {

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected!");

        console.log("Clearing existing drinks...");
        await Drink.deleteMany({});
        
        console.log("Inserting seed data...");
        await Drink.insertMany(drinks);

        console.log("Database seeded successfully!");

    
        await mongoose.disconnect();
        process.exit(0); 
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
};

seedDrinks();