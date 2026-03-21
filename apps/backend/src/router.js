import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from "./modules/products/product.routes.js"
import userRoutes from "./modules/users/user.routes.js";
import optionRoutes from "./modules/drinkOptions/drinkOptions.routes.js"
import authorize from './middleware/authorize.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use("/user", authorize, userRoutes);
router.use("/options", optionRoutes );
export default router;