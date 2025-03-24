import { Router } from "express";
import { loginController, registerController } from "./auth.controller";

const router = Router()

router.post('/oauth/login', loginController);
router.post('/oauth/register', registerController);

export default router;