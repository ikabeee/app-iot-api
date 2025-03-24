import {Router} from 'express';
import { getSensorsController } from './sensor.controller';

const router = Router();

router.get('/sensor/all', getSensorsController)

export default router;