import { Plot, Sensor } from "@prisma/client";
import { getAllPlots } from "./getDataApi";
import { prisma } from "../../config/db";
import { ParcelaApi } from "../interfaces/ParcelaApi";

const havePlotBeenDeleted = async (): Promise<void> => {
    const apiPlots: ParcelaApi[] = await getAllPlots(); //Plots from API
    const dbPlots: Plot[] = await prisma.plot.findMany(); // Plots for our DB
    const idApiPlots: number[] = apiPlots.map(plot => plot.id);
    for (const dbPlot of dbPlots) { //Check if a Plot from our API response was deleted and if it's deleted change status to DELETED
        if (!idApiPlots.includes(dbPlot.id)) {
            const deletedPlot = await prisma.plot.update({
                where: { id: dbPlot.id },
                data: {
                    status: 'DELETED'
                }
            });
        }
    }
}

const insertPlotData = async () => {
    const apiPlots = await getAllPlots();
    const dbPlots = await prisma.plot.findMany();
    const dbPlotIds = new Set(dbPlots.map(plot => plot.id));
    const newPlots: Plot[] = [];
    for (const plot of apiPlots) {
        if (!dbPlotIds.has(plot.id)) {
            const newPlot = await prisma.plot.create({
                data: {
                    name: plot.nombre,
                    location: plot.ubicacion,
                    manager: plot.responsable,
                    cropType: plot.tipo_cultivo,
                    lastWatering: new Date(plot.ultimo_riego),
                    lat: plot.latitud,
                    lng: plot.longitud,
                    status: 'ACTIVE',
                    userId: null,
                },
            });
            console.log(`Plot with id ${newPlot.id} has been inserted`);
            newPlots.push(newPlot);
        }
    }
}

const insertPlotSensorData = async () => {
    const apiPlots = await getAllPlots();
    for (const plot of apiPlots) {
        await prisma.history.create({
            data: {
                sun: plot.sensor.sol,
                humidity: plot.sensor.humedad,
                rain: plot.sensor.lluvia,
                temperature: plot.sensor.temperatura,
                date: new Date(),
                plotId: plot.id
            }
        })
    }
}

const updatePlotData =async()=>{
    const apiPlots = await getAllPlots();
    for (const plot of apiPlots) {
        await prisma.plot.update({
            where: {id: plot.id},
            data: {
                lastWatering: new Date(plot.ultimo_riego),
                lat: plot.latitud,
                lng: plot.longitud
            }
        })
    }
}


export { havePlotBeenDeleted, insertPlotData, insertPlotSensorData, updatePlotData }