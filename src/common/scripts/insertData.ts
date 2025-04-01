import { getParcelas } from "./getDataApi";
import { Plot } from "../interfaces/Plot";
import { Status } from "../enums/Status";
import { prisma } from "../../config/db";

const checkPlot = async (id: number): Promise<boolean> => {
    const plot = await prisma.plot.findUnique({
        where: {
            id: id
        }
    });
    return plot ? true : false;
}

const updatePlotStatus = async (id: number, status: Status) => {
    await prisma.plot.update({
        where: {
            id: id
        },
        data: {
            status: status
        }
    })
}

const createPlot = async (plot: Plot) => {
    await prisma.plot.create({
        data: plot
    })
}

const getPlots = async () => {
    return await prisma.plot.findMany();
}

const insertPlotData = async () => {
    const plotList = await getParcelas();
    const plotDb = await getPlots();
    if(plotDb.length === 0){
        plotList.forEach(async (plot) => {
            const {id, nombre, ubicacion, responsable, tipo_cultivo, ultimo_riego, latitud, longitud} = plot;
                const plotData = {
                id: id,
                name: nombre,
                location: ubicacion,
                manager: responsable,
                cropType: tipo_cultivo,
                lastWatering: new Date(ultimo_riego),
                lat: latitud,
                lng: longitud,
                status: Status.ACTIVE
            }
            await createPlot(plotData);
        })
    }

    plotList.forEach(async (plot) => {
        const {id, nombre, ubicacion, responsable, tipo_cultivo, ultimo_riego, latitud, longitud} = plot;
        const plotExists = await checkPlot(id);
        if (!plotExists) {
            const plotData = {
                id: plot.id,
                name: nombre,
                location: ubicacion,
                manager: responsable,
                cropType: tipo_cultivo,
                lastWatering: new Date(ultimo_riego),
                lat: latitud,
                lng: longitud,
                status: Status.ACTIVE
            }
            await createPlot(plotData);
        }
    })
}

const checkPlotStatus = async () => {
    const plotsApi = await getParcelas();
    if(plotsApi.length === 0){
        await prisma.plot.updateMany({
            data: {
                status: Status.DELETED
            }
        })
    }
    plotsApi.forEach(async (plot) => {
        const {id} = plot;
        const plotExists = await checkPlot(id);
        if (!plotExists) {
            await updatePlotStatus(id, Status.DELETED);
        }else{
            await updatePlotStatus(id, Status.ACTIVE);
        }
    })

}

const insertPlotSensorData = async (): Promise<void> => {
    try {
        const apiPlots = await getParcelas();
        
        if (apiPlots.length === 0) {
            console.log('No se obtuvieron datos de sensores de la API');
            return;
        }

        for (const plot of apiPlots) {
            try {
                console.log(plot);
                if (!plot.sensor) {
                    console.log(`No hay datos de sensor para la parcela ${plot.id}`);
                    continue;
                }

                await prisma.history.create({
                    data: {
                        sun: plot.sensor.sol,
                        humidity: plot.sensor.humedad,
                        rain: plot.sensor.lluvia,
                        temperature: plot.sensor.temperatura,
                        date: new Date(),
                        plotId: plot.id
                    }
                });
                console.log(`Datos del sensor insertados para la parcela ${plot.id}`);
            } catch (createError) {
                console.error(`Error al insertar datos del sensor para la parcela ${plot.id}:`, createError);
            }
        }
    } catch (error) {
        console.error('Error en insertPlotSensorData:', error);
    }
}

export { insertPlotData, checkPlotStatus, insertPlotSensorData };


// import { Plot, Sensor } from "@prisma/client";
// import { getAllPlots } from "./getDataApi";
// import { prisma } from "../../config/db";
// import { ParcelaApi } from "../interfaces/ParcelaApi";

// const havePlotBeenDeleted = async (): Promise<void> => {
//     try {
//         const apiPlots: ParcelaApi[] = await getAllPlots();
//         const dbPlots: Plot[] = await prisma.plot.findMany({
//             where: {
//                 status: 'ACTIVE'
//             }
//         });

//         if (dbPlots.length === 0) {
//             console.log('No hay parcelas activas en la base de datos');
//             return;
//         }

//         if (apiPlots.length === 0) {
//             console.log('No se obtuvieron datos de la API');
//             return;
//         }

//         const idApiPlots: number[] = apiPlots.map(plot => plot.id);
//         for (const dbPlot of dbPlots) {
//             if (!idApiPlots.includes(dbPlot.id)) {
//                 try {
//                     await prisma.plot.update({
//                         where: { 
//                             id: dbPlot.id,
//                             status: 'ACTIVE'
//                         },
//                         data: {
//                             status: 'DELETED',
//                         }
//                     });
//                     console.log(`Parcela ${dbPlot.id} marcada como eliminada`);
//                 } catch (updateError) {
//                     console.error(`Error al actualizar la parcela ${dbPlot.id}:`, updateError);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Error en havePlotBeenDeleted:', error);
//     }
// }

// const insertPlotData = async (): Promise<void> => {
//     try {
//         const apiPlots = await getAllPlots();
        
//         if (apiPlots.length === 0) {
//             console.log('No se obtuvieron datos de la API para insertar');
//             return;
//         }

//         const dbPlots = await prisma.plot.findMany();
//         const dbPlotIds = new Set(dbPlots.map(plot => plot.id));
        
//         for (const plot of apiPlots) {
//             if (!dbPlotIds.has(plot.id)) {
//                 try {
//                     const newPlot = await prisma.plot.create({
//                         data: {
//                             name: plot.nombre,
//                             location: plot.ubicacion,
//                             manager: plot.responsable,
//                             cropType: plot.tipo_cultivo,
//                             lastWatering: new Date(plot.ultimo_riego),
//                             lat: plot.latitud,
//                             lng: plot.longitud,
//                             status: 'ACTIVE',
//                             userId: null,
//                         },
//                     });
//                     console.log(`Parcela con ID ${newPlot.id} ha sido insertada`);
//                 } catch (createError) {
//                     console.error(`Error al crear la parcela ${plot.id}:`, createError);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Error en insertPlotData:', error);
//     }
// }

// const insertPlotSensorData = async (): Promise<void> => {
//     try {
//         const apiPlots = await getAllPlots();
        
//         if (apiPlots.length === 0) {
//             console.log('No se obtuvieron datos de sensores de la API');
//             return;
//         }

//         for (const plot of apiPlots) {
//             try {
//                 if (!plot.sensor) {
//                     console.log(`No hay datos de sensor para la parcela ${plot.id}`);
//                     continue;
//                 }

//                 await prisma.history.create({
//                     data: {
//                         sun: plot.sensor.sol,
//                         humidity: plot.sensor.humedad,
//                         rain: plot.sensor.lluvia,
//                         temperature: plot.sensor.temperatura,
//                         date: new Date(),
//                         plotId: plot.id
//                     }
//                 });
//                 console.log(`Datos del sensor insertados para la parcela ${plot.id}`);
//             } catch (createError) {
//                 console.error(`Error al insertar datos del sensor para la parcela ${plot.id}:`, createError);
//             }
//         }
//     } catch (error) {
//         console.error('Error en insertPlotSensorData:', error);
//     }
// }

// const updatePlotData = async (): Promise<void> => {
//     try {
//         const apiPlots = await getAllPlots();
        
//         if (apiPlots.length === 0) {
//             console.log('No se obtuvieron datos de la API para actualizar');
//             return;
//         }

//         for (const plot of apiPlots) {
//             try {
//                 const existingPlot = await prisma.plot.findUnique({
//                     where: { id: plot.id }
//                 });

//                 if (!existingPlot) {
//                     console.log(`Parcela con ID ${plot.id} no encontrada en la base de datos`);
//                     continue;
//                 }

//                 if (existingPlot.status === 'DELETED') {
//                     console.log(`Parcela ${plot.id} está marcada como eliminada, no se actualizará`);
//                     continue;
//                 }

//                 await prisma.plot.update({
//                     where: { id: plot.id },
//                     data: {
//                         lastWatering: new Date(plot.ultimo_riego),
//                         lat: plot.latitud,
//                         lng: plot.longitud
//                     }
//                 });
//                 console.log(`Parcela ${plot.id} actualizada correctamente`);
//             } catch (updateError) {
//                 console.error(`Error al actualizar la parcela ${plot.id}:`, updateError);
//             }
//         }
//     } catch (error) {
//         console.error('Error en updatePlotData:', error);
//     }
// }

// export { havePlotBeenDeleted, insertPlotData, insertPlotSensorData, updatePlotData }