import { Request, RequestHandler, Response } from 'express';
import { getAllPlots, getPlotById } from './plot.service';

const getAllPlotsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const plots = await getAllPlots();
        res.status(200).json(plots);
        return;
    } catch (error: unknown) {
        res.status(500).json({ error: `Unexpected error ${error}`, timestamp: new Date() });
        return;
    }
}

const getPlotByIdController: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const plot = await getPlotById(+id);
        if (!plot) {
            res.status(404).json({ httpCode: 404, error: `Plot with id ${id} not found`, timestamp: new Date() })
            return;
        }
        res.status(200).json(plot);
    } catch (error: unknown) {
        res.status(500).json({ error: `Unexpected error: ${error}`, timestamp: new Date() })
        return;
    }
}

export { getAllPlotsController, getPlotByIdController }