import { History, Plot } from "@prisma/client";
import { prisma } from "../../config/db";

export const getHistoryPlot = async(): Promise<History[]> => {
    const history = await prisma.history.findMany();
    return history;
}

export const getHistoryByPlotId=async(plotId: number): Promise<History[]> => {
    const historyPlot = await prisma.history.findMany({where: {plotId}})
    return historyPlot;
}