import { Router } from 'express';
//import authRoutes from './modules/auth/auth.routes.js';
import drinkRoutes from './modules/drinks/drink.routes.js';
//import foodRoutes from './modules/foods/food.routes.js';

const router = Router();

//router.use('/auth', authRoutes);
router.use('/drinks', drinkRoutes);
//router.use('/foods', foodRoutes);

export default router;