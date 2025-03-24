import { Router } from "express";
import { getHistoryByPlotId } from "./historyPlot.service";
import { getAllHistoryPlotController, getHistoryByPlotIdController } from "./historyPlot.controller";

const router = Router()

router.get('/history-plot/all', getAllHistoryPlotController);
router.get('/history-plot/:plotId', getHistoryByPlotIdController);

export default router;