import dotenv from "dotenv"
dotenv.config()

import app from "./src/app.js"
import { greet } from "../../packages/utils/index.js";
import mongoose from "mongoose";


const PORT = process.env.PORT || 3000;
const dbURI = process.env.NODE_ENV === "test" ?
    process.env.MONGODB_TEST_URI : process.env.MONGODB_URI;

mongoose.connect(dbURI)
    .then(() => console.log("Connected to MongoDb..."))
    .catch(err => console.error("Could not connect to MongoDB:", err))

mongoose.connection.on('error', err => console.error("Database connection error", err));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


console.log(greet("Backend"));
console.log("Loaded FRONTEND_URL:", process.env.FRONTEND_URL);
