import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin);
router.get('/users', authController.getAllUsers);
router.put('/users/:userId/block', authController.blockUser);
// Change password
router.post('/change-password', verifyToken, authController.changePassword);

export default router;