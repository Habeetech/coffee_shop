import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../modules/products/product.model.js";
import products from "../seeders/productSeed.js"

dotenv.config();

const seed = async (items, model) => {
    try {

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected!");

       // await mongoose.connection.dropDatabase();
    //console.log("Droped Database")
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

seed(products, Product);