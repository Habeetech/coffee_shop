import mongoose from "mongoose";
import dotenv from "dotenv";
import products from "../seeders/productSeed.js";
import Product from "../modules/products/product.model.js";

dotenv.config();

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log("Products seeded successfully!");
    } catch (error) {
        console.error("Seed failed:", error);
    } finally {
        await mongoose.connection.close();
    }
};

seedProducts();
