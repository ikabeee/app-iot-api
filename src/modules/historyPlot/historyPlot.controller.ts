import { Request, Response } from "express";
import { getHistoryPlot, getHistoryByPlotId  } from "./historyPlot.service";
import { getPlotById } from "../plot/plot.service";

export const getAllHistoryPlotController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const history = await getHistoryPlot();
        res.status(200).json(history)
        return;
    } catch (error: unknown) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error ${error}`, timestamp: new Date() });
        return;
    }
}

export const getHistoryByPlotIdController = async(req: Request, res: Response): Promise<void> => {
    try {
        const {plotId} = req.params;
        const historyPlot = await getHistoryByPlotId(+plotId);
        const plot = await getPlotById(+plotId);
        res.status(200).json({plot, historyPlot});
    }catch(error: unknown){
        res.status(500).json({ httpCode: 500, error: `Unexpected error ${error}`, timestamp: new Date() });
        return;
    }
}