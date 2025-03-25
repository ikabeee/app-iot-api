import { Router } from 'express';
import { loginController, registerController, verifyOTPController } from './auth.controller';

const router = Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/verify-otp', verifyOTPController);

export default router;