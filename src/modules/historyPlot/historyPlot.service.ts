import { History } from "@prisma/client";
import { IHistory } from "../../common/interfaces/History";
import { prisma } from "../../config/db";

export const getHistoryPlot = async(): Promise<History[]> => {
    const history = await prisma.history.findMany();
    return history;
}

export const getHistoryByPlotId=async(plotId: number): Promise<IHistory[]> => {
    const historyPlot = await prisma.history.findMany({
        where: {plotId},
        select: {
            id: true,
            sun: true,
            rain: true,
            humidity: true,
            temperature: true,
            date: true,
        }
    })
    return historyPlot;
}