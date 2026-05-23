
import express from "express";
import errorHandler from "./middleware/errorHandler.js"
import router from "./router.js";
import stripeWebhookController from "./modules/orders/order.webhook.js";
import cors from "cors"
import morgan from "morgan"
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";



const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/api/webhook/stripe", express.raw({ type: "application/json" }), stripeWebhookController)
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const allowedOrigins = process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(",").map(o => o.trim())
    : [];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (origin.startsWith("http://localhost")) {
                return callback(null, true);
            }

            if (origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);
app.use(morgan('dev'))
app.use(cookieParser());
app.use("/api", router);
app.use("/images", express.static(path.join(__dirname, "public/products")))
app.get("/", (req, res) => res.send("Hello, you've hit the server root"));
app.use(errorHandler);

export default app;