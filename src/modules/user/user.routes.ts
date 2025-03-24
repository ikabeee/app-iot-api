import {Router} from 'express';
import { createUserController, getUserByIdController, getUsersController } from './user.controller';

const router = Router();

router.get('/user/all', getUsersController);
router.get('/user/:id', getUserByIdController);
router.post('/user/create', createUserController);


export default router;