import { Router } from "express";
import { loginAdmin } from '@/controllers/authController';
import { getCategories } from '@/controllers/categoryController';
import { getAllItems } from '@/controllers/MainDataController';

const router = Router();

router.get('/categories', getCategories);
router.get('/items', getAllItems);

router.post('/auth/login', loginAdmin);

export default router;
