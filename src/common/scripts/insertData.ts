import { getParcelas } from "./getDataApi"
import type { Plot } from "../interfaces/Plot"
import { Status } from "../enums/Status"
import { prisma } from "../../config/db"

const checkPlot = async (id: number): Promise<boolean> => {
  const plot = await prisma.plot.findUnique({
    where: {
      id: id,
    },
  })
  return plot ? true : false
}

const updatePlotStatus = async (id: number, status: Status) => {
  await prisma.plot.update({
    where: {
      id: id,
    },
    data: {
      status: status,
    },
  })
}

const createPlot = async (plot: Plot) => {
  await prisma.plot.create({
    data: plot,
  })
}

const getPlots = async () => {
  return await prisma.plot.findMany()
}

const insertPlotData = async () => {
  const plotList = await getParcelas()
  const plotDb = await getPlots()
  if (plotDb.length === 0) {
    plotList.forEach(async (plot) => {
      const { id, nombre, ubicacion, responsable, tipo_cultivo, ultimo_riego, latitud, longitud } = plot
      const plotData = {
        id: id,
        name: nombre,
        location: ubicacion,
        manager: responsable,
        cropType: tipo_cultivo,
        lastWatering: new Date(ultimo_riego),
        lat: latitud,
        lng: longitud,
        status: Status.ACTIVE,
      }
      await createPlot(plotData)
    })
  }

  plotList.forEach(async (plot) => {
    const { id, nombre, ubicacion, responsable, tipo_cultivo, ultimo_riego, latitud, longitud } = plot
    const plotExists = await checkPlot(id)
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
        status: Status.ACTIVE,
      }
      await createPlot(plotData)
    }
  })
}

const checkPlotStatus = async () => {
  // Get plots from API and database
  const plotsApi = await getParcelas()
  const dbPlots = await getPlots()

  // If API returns no plots, mark all database plots as deleted
  if (plotsApi.length === 0) {
    await prisma.plot.updateMany({
      data: {
        status: Status.DELETED,
      },
    })
    return
  }

  // Create a Set of IDs from API for faster lookup
  const apiPlotIds = new Set(plotsApi.map((plot) => plot.id))

  // First, mark plots that exist in DB but not in API as DELETED
  for (const dbPlot of dbPlots) {
    if (!apiPlotIds.has(dbPlot.id)) {
      await updatePlotStatus(dbPlot.id, Status.DELETED)
    }
  }

  // Then, ensure plots from API exist and are marked as ACTIVE
  for (const apiPlot of plotsApi) {
    const plotExists = await checkPlot(apiPlot.id)
    if (plotExists) {
      await updatePlotStatus(apiPlot.id, Status.ACTIVE)
    }
    // Note: New plots will be created by insertPlotData function
  }
}

const insertPlotSensorData = async (): Promise<void> => {
  try {
    const apiPlots = await getParcelas()

    if (apiPlots.length === 0) {
      console.log("No se obtuvieron datos de sensores de la API")
      return
    }

    for (const plot of apiPlots) {
      try {
        if (!plot.sensor) {
          console.log(`No hay datos de sensor para la parcela ${plot.id}`)
          continue
        }

        await prisma.history.create({
          data: {
            sun: plot.sensor.sol,
            humidity: plot.sensor.humedad,
            rain: plot.sensor.lluvia,
            temperature: plot.sensor.temperatura,
            date: new Date(),
            plotId: plot.id,
          },
        })
      } catch (createError) {
        console.error(`Error al insertar datos del sensor para la parcela ${plot.id}:`, createError)
      }
    }
  } catch (error) {
    console.error("Error en insertPlotSensorData:", error)
  }
}

const updatePlotData = async (): Promise<void> => {
  try {
    const apiPlots = await getParcelas()

    if (apiPlots.length === 0) {
      console.log("No se obtuvieron datos de la API para actualizar")
      return
    }

    for (const plot of apiPlots) {
      try {
        const existingPlot = await prisma.plot.findUnique({
          where: { id: plot.id },
        })

        if (!existingPlot) {
          console.log(`Parcela con ID ${plot.id} no encontrada en la base de datos`)
          continue
        }

        if (existingPlot.status === "DELETED") {
          console.log(`Parcela ${plot.id} está marcada como eliminada, no se actualizará`)
          continue
        }

        await prisma.plot.update({
          where: { id: plot.id },
          data: {
            lastWatering: new Date(plot.ultimo_riego),
            lat: plot.latitud,
            lng: plot.longitud,
          },
        })
      } catch (updateError) {
        console.error(`Error al actualizar la parcela ${plot.id}:`, updateError)
      }
    }
  } catch (error) {
    console.error("Error en updatePlotData:", error)
  }
}

export { insertPlotData, checkPlotStatus, insertPlotSensorData, updatePlotData }

