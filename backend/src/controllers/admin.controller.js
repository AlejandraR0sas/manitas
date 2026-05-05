const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nombre: true, email: true, rol: true, puntosTotales: true, rachaActual: true, creadoEn: true }
    })
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

const obtenerEstadisticas = async (req, res) => {
  try {
    const totalUsuarios = await prisma.usuario.count()
    const totalLecciones = await prisma.leccion.count()
    const totalCompletadas = await prisma.progresoUsuario.count({ where: { completado: true } })
    res.json({ totalUsuarios, totalLecciones, totalCompletadas })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}

const obtenerModulos = async (req, res) => {
  try {
    const modulos = await prisma.modulo.findMany({
      orderBy: { orden: 'asc' },
      include: { lecciones: { orderBy: { orden: 'asc' } } }
    })
    res.json(modulos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener módulos' })
  }
}

const crearModulo = async (req, res) => {
  const { titulo, descripcion, nivel, orden } = req.body
  try {
    const modulo = await prisma.modulo.create({
      data: { titulo, descripcion, nivel, orden }
    })
    res.status(201).json(modulo)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear módulo' })
  }
}

const crearLeccion = async (req, res) => {
  const { moduloId, titulo, tipo, orden, puntosRecompensa } = req.body
  try {
    const leccion = await prisma.leccion.create({
      data: { moduloId, titulo, tipo, orden: parseInt(orden), puntosRecompensa: parseInt(puntosRecompensa) }
    })
    res.status(201).json(leccion)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear lección' })
  }
}

const crearEjercicio = async (req, res) => {
  const { leccionId, pregunta, respuestaCorrecta, imagen, video, orden } = req.body
  try {
    const ejercicio = await prisma.ejercicio.create({
      data: {
        leccionId,
        pregunta,
        tipo: 'OPCION_MULTIPLE',
        respuestaCorrecta,
        imagen: imagen || null,
        video: video || null,
        orden: parseInt(orden)
      }
    })
    res.status(201).json(ejercicio)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ejercicio' })
  }
}

const obtenerLeccion = async (req, res) => {
  const { id } = req.params
  try {
    const leccion = await prisma.leccion.findUnique({
      where: { id },
      include: { ejercicios: { orderBy: { orden: 'asc' } } }
    })
    res.json(leccion)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lección' })
  }
}
const eliminarModulo = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.progresoUsuario.deleteMany({
      where: { leccion: { moduloId: id } }
    })
    await prisma.ejercicio.deleteMany({
      where: { leccion: { moduloId: id } }
    })
    await prisma.leccion.deleteMany({ where: { moduloId: id } })
    await prisma.modulo.delete({ where: { id } })
    res.json({ mensaje: 'Módulo eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar módulo' })
  }
}

const eliminarLeccion = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.progresoUsuario.deleteMany({ where: { leccionId: id } })
    await prisma.ejercicio.deleteMany({ where: { leccionId: id } })
    await prisma.leccion.delete({ where: { id } })
    res.json({ mensaje: 'Lección eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar lección' })
  }
}

const eliminarEjercicio = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.ejercicio.delete({ where: { id } })
    res.json({ mensaje: 'Ejercicio eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ejercicio' })
  }
}
module.exports = {
  obtenerUsuarios, crearModulo, crearLeccion, crearEjercicio,
  obtenerEstadisticas, obtenerModulos, obtenerLeccion,
  eliminarModulo, eliminarLeccion, eliminarEjercicio
}