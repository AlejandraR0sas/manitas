const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const sumarPuntos = async (usuarioId, puntos) => {
  await prisma.usuario.update({
    where: { id: usuarioId },
    data: { puntosTotales: { increment: puntos } }
  })
}

module.exports = { sumarPuntos }