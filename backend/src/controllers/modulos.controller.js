const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const obtenerModulos = async (req, res) => {
  try {
    const modulos = await prisma.modulo.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      include: { lecciones: { where: { activo: true } } }
    })
    res.json(modulos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener módulos' })
  }
}

const obtenerModulo = async (req, res) => {
  const { id } = req.params
  try {
    const modulo = await prisma.modulo.findUnique({
      where: { id },
      include: { lecciones: { where: { activo: true }, orderBy: { orden: 'asc' } } }
    })
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' })
    res.json(modulo)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener módulo' })
  }
}

module.exports = { obtenerModulos, obtenerModulo }