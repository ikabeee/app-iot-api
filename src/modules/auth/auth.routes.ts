import { Router } from 'express';
import { loginController, registerController, generateOTPController, verifyOTPController } from './auth.controller';

const router = Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/generate-otp', generateOTPController);
router.post('/verify-otp', verifyOTPController);

export default router;