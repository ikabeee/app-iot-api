import { Plot } from "@prisma/client"
import { prisma } from "../../config/db"

const getAllPlots = async (): Promise<Plot[]> => {
    const plots = await prisma.plot.findMany();
    return plots;
}

const getPlotById = async(id: number): Promise<Plot | null> =>{
    const plot = await prisma.plot.findUnique({where: {id}})
    return plot;
1}

export { getAllPlots, getPlotById }