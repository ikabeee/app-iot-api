import { Router } from 'express';
import { loginController, logoutController, registerController, verifyOTPController } from './auth.controller';

const router = Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/verify-otp', verifyOTPController);
router.post('/logout', logoutController);

export default router;