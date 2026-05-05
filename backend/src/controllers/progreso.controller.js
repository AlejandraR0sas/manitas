const { PrismaClient } = require('@prisma/client')
const { actualizarRacha } = require('../utils/racha')
const { sumarPuntos } = require('../utils/puntos')
const prisma = new PrismaClient()

const obtenerProgreso = async (req, res) => {
  const usuarioId = req.user.id
  try {
    const progreso = await prisma.progresoUsuario.findMany({
      where: { usuarioId },
      include: { leccion: true }
    })
    res.json(progreso)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener progreso' })
  }
}

const completarLeccion = async (req, res) => {
  const usuarioId = req.user.id
  const { leccionId } = req.body

  try {
    const leccion = await prisma.leccion.findUnique({ where: { id: leccionId } })
    if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' })

    const progresoExistente = await prisma.progresoUsuario.findUnique({
      where: { usuarioId_leccionId: { usuarioId, leccionId } }
    })

    if (progresoExistente?.completado) {
      return res.json({ mensaje: 'Lección ya completada anteriormente' })
    }

    await prisma.progresoUsuario.upsert({
      where: { usuarioId_leccionId: { usuarioId, leccionId } },
      update: { completado: true, completadoEn: new Date(), intentos: { increment: 1 } },
      create: { usuarioId, leccionId, completado: true, completadoEn: new Date(), intentos: 1 }
    })

    await sumarPuntos(usuarioId, leccion.puntosRecompensa)
    await actualizarRacha(usuarioId)

    res.json({ mensaje: '¡Lección completada!', puntos: leccion.puntosRecompensa })
  } catch (error) {
    res.status(500).json({ error: 'Error al completar lección' })
  }
}

module.exports = { obtenerProgreso, completarLeccion }