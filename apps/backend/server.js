import dotenv from "dotenv"
dotenv.config()

import app from "./src/app.js"
import { greet } from "../../packages/utils/index.js";


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

console.log(greet("Backend"));
console.log("Loaded FRONTEND_URL:", process.env.FRONTEND_URL);
