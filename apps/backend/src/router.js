import { Router } from 'express';
//import authRoutes from './modules/auth/auth.routes.js';
import drinkRoutes from './modules/drinks/drink.routes.js';
import foodRoutes from './modules/foods/food.routes.js';
import cakeRoutes from './modules/cakes/cake.routes.js'
import buscuitRoutes from './modules/buscuits/buscuit.routes.js'
import crispRoutes from './modules/crisps/crisp.routes.js'

const router = Router();

//router.use('/auth', authRoutes);
router.use('/drinks', drinkRoutes);
router.use('/foods', foodRoutes);
router.use('/cakes', cakeRoutes);
router.use('/buscuits', buscuitRoutes);
router.use('/crisps', crispRoutes);

export default router;