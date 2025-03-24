import {Router} from 'express';
import { createUserController, getUsersController } from './user.controller';

const router = Router();

router.get('/user/all', getUsersController);
router.post('/user/create', createUserController);


export default router;