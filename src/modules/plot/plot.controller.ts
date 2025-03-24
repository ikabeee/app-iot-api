import { Request, Response } from 'express';
import { getAllPlots, getPlotById, getPlotsDeleted } from './plot.service';

const getAllPlotsController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const plots = await getAllPlots();
        res.status(200).json(plots);
        return;
    } catch (error: unknown) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error ${error}`, timestamp: new Date() });
        return;
    }
}

const getPlotByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const plot = await getPlotById(+id);
        if (!plot) {
            res.status(404).json({ httpCode: 404, error: `Plot with id ${id} not found`, timestamp: new Date() })
            return;
        }
        res.status(200).json(plot);
    } catch (error: unknown) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error: ${error}`, timestamp: new Date() })
        return;
    }
}

const getPlotsDeletedController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const plotsDeleted = await getPlotsDeleted();
        res.status(200).json({ plotsDeleted });
        return;
    } catch (error: unknown) {
        res.status(500).json({ httpCode: 500, error: `Unexpected error: ${error}`, timestamp: new Date() })
        return;
    }
}

export { getAllPlotsController, getPlotByIdController, getPlotsDeletedController }