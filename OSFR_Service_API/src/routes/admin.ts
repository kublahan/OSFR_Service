
import { Router } from 'express';
import { adminAuthMiddleware } from '../middleware/auth';
import asyncHandler from 'express-async-handler';
import resourceController from '../controllers/resourceController';
import instructionController from '../controllers/instructionController';
import { getCategories } from '../controllers/categoryController';
import { getAllItems } from '../controllers/MainDataController';

const router = Router();

router.use(adminAuthMiddleware);


router.get('/dashboard', asyncHandler(async (req, res) => {
    res.json({ message: 'Admin dashboard' });
}));


router.get('/resources/:id', resourceController.getResourceById);
router.post('/resources', resourceController.createResource);
router.put('/resources/:id', resourceController.updateResource);
router.delete('/resources/:id', resourceController.deleteResource);


router.get('/instructions', instructionController.getInstructions);
router.get('/instructions/:id', instructionController.getInstructionById);
router.post('/instructions', instructionController.createInstruction);
router.put('/instructions/:id', instructionController.updateInstruction);
router.delete('/instructions/:id', instructionController.deleteInstruction);


router.get('/categories', getCategories);


router.get('/all-items', getAllItems);

export default router;
