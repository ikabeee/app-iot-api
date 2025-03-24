import { Plot } from "@prisma/client"
import { prisma } from "../../config/db"

const getAllPlots = async (): Promise<Plot[]> => {
    const plots = await prisma.plot.findMany({include: {user: true}});
    return plots;
}

const getPlotById = async(id: number): Promise<Plot | null> =>{
    const plot = await prisma.plot.findUnique({where: {id}, include: {user: true}})
    return plot;
1}

const getPlotsDeleted = async(): Promise<Plot[]> => {
    const plotsDeleted = await prisma.plot.findMany({where: {status: 'DELETED'}});
    return plotsDeleted;
}
export { getAllPlots, getPlotById, getPlotsDeleted }