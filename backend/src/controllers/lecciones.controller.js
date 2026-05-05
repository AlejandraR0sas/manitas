const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const obtenerLecciones = async (req, res) => {
  try {
    const lecciones = await prisma.leccion.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      include: { ejercicios: true }
    })
    res.json(lecciones)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lecciones' })
  }
}

const obtenerLeccion = async (req, res) => {
  const { id } = req.params
  try {
    const leccion = await prisma.leccion.findUnique({
      where: { id },
      include: { ejercicios: { orderBy: { orden: 'asc' } } }
    })
    if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' })
    res.json(leccion)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lección' })
  }
}

module.exports = { obtenerLecciones, obtenerLeccion }