import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from "./modules/products/product.routes.js"
import userRoutes from "./modules/users/user.routes.js";
import optionRoutes from "./modules/drinkOptions/drinkOptions.routes.js"
import authorize from './middleware/authorize.js';
import paymentRoutes from "./modules/payments/payment.routes.js"
import orderRoutes from "./modules/orders/order.route.js";
import imagekitRoutes from "./modules/imagekit/imagekit.route.js"
import contactSupport from './modules/contact/contact.controller.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use("/user", authorize, userRoutes);
router.use("/options", optionRoutes );
router.use("/payment-intent", paymentRoutes);
router.use("/orders", orderRoutes)
router.use("/upload", imagekitRoutes)
router.post("/contact-support", contactSupport);
export default router;