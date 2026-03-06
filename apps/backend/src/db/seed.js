import Drink from "../modules/drinks/drink.model.js";
import drinks from "../seeders/drinkSeed.js";
import Food from "../modules/foods/food.model.js";
import foods from "../seeders/foodSeed.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const seed = async (items, model) => {
    try {

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected!");

        console.log("Clearing existing items...");
        await model.deleteMany({});
        
        console.log("Inserting seed data...");
        await model.insertMany(items);

        console.log("Database seeded successfully!");

    
        await mongoose.disconnect();
        process.exit(0); 
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
};

//seed(drinks, Drink);
seed(foods, Food);