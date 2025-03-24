import { Router } from "express";
import * as plotController from './plot.controller'

const router = Router();

router.get('/plot/deleted', plotController.getPlotsDeletedController);
router.get('/plot/:id', plotController.getPlotByIdController);
router.get('/plot', plotController.getAllPlotsController);

export default router;