import { Router } from "express";
import { loginAdmin } from '@/controllers/authController';
import { getCategories, getAllItems } from '@/controllers/dataController';
import asyncHandler from 'express-async-handler';



const router = Router();


router.get('/categories', asyncHandler(getCategories));


router.get('/items', asyncHandler(getAllItems));


router.post('/auth/login', loginAdmin);


export default router;