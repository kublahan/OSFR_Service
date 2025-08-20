import { Router } from "express";
import { loginAdmin } from '@/controllers/authController';
import { getCategories } from '@/controllers/categoryController';
import { getAllItems } from '@/controllers/MainDataController';
import * as softwareController from '@/controllers/softwareController';
import asyncHandler from "express-async-handler";

const router = Router();

router.get('/categories', getCategories);
router.get('/items', getAllItems);

router.post('/auth/login', asyncHandler(loginAdmin));

router.get('/software/:id', softwareController.getSoftwarebyId);
router.get('/software/download/:id', softwareController.downloadSoftware);

export default router;
