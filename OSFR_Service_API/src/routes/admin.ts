import { Router } from 'express';
import { adminAuthMiddleware } from '../middleware/auth';
import asyncHandler from 'express-async-handler';
import resourceController from '../controllers/resourceController';
import instructionController from '../controllers/instructionController';
import { getCategories } from '../controllers/categoryController';
import { getAllItems } from '../controllers/MainDataController';
import { deleteImage, uploadImage } from '../controllers/uploadController';
import * as softwareController from '../controllers/softwareController';

const router = Router();

router.use(adminAuthMiddleware);

router.post('/upload-image', uploadImage);
router.post('/delete-image', deleteImage);

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


router.post('/software', softwareController.upload.single('file'), softwareController.createSoftware);
router.get('/software/:id', softwareController.getSoftwarebyId);
router.post('/software/:id', softwareController.upload.single('file'), softwareController.updateSoftware);
router.delete('/software/:id', softwareController.deleteSoftware);
router.get('/software/download/:id', softwareController.downloadSoftware);

router.get('/categories', getCategories);
router.get('/all-items', getAllItems);

export default router;
