
import express from "express";
import errorHandler from "./middleware/errorHandler.js"
import router from "./router.js";
import stripeWebhookController from "./modules/orders/order.webhook.js";
import cors from "cors"
import morgan from "morgan"
import path from "path";
import { fileURLToPath } from "url";



const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/api/webhook/stripe", express.raw({ type: "application/json"}), stripeWebhookController)
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
if (process.env.FRONTEND_URL)
{
    app.use(cors({origin: process.env.FRONTEND_URL}))
}
else {
    app.use(cors())
}
app.use(morgan('dev'))
app.use("/api", router);
app.use("/images", express.static(path.join(__dirname, "public/products")))
app.get("/", (req, res) => res.send("Hello, you've hit the server root"));
app.use(errorHandler);

export default app;