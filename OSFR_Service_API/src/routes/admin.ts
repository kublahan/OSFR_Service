import { Router } from 'express';
import { adminAuthMiddleware } from '@/middleware/auth';
import asyncHandler from 'express-async-handler';


console.log('--- adminRoutes is being loaded ---');

const router = Router();

router.use(adminAuthMiddleware);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Admin dashboard data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data
 */
router.get('/dashboard', asyncHandler(async (req, res) => {
  res.json({ message: 'Страница админа' });
}));

export default router;