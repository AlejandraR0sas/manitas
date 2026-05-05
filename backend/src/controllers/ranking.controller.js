const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const obtenerRanking = async (req, res) => {
  try {
    const ranking = await prisma.usuario.findMany({
      orderBy: { puntosTotales: 'desc' },
      take: 20,
      select: {
        id: true,
        nombre: true,
        puntosTotales: true,
        rachaActual: true
      }
    })

    const rankingConPosicion = ranking.map((usuario, index) => ({
      ...usuario,
      posicion: index + 1
    }))

    res.json(rankingConPosicion)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ranking' })
  }
}

module.exports = { obtenerRanking }