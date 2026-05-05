const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const actualizarRacha = async (usuarioId) => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  await prisma.racha.upsert({
    where: { usuarioId_fecha: { usuarioId, fecha: hoy } },
    update: { completado: true },
    create: { usuarioId, fecha: hoy, completado: true }
  })

  const rachas = await prisma.racha.findMany({
    where: { usuarioId },
    orderBy: { fecha: 'desc' }
  })

  let rachaActual = 0
  for (let i = 0; i < rachas.length; i++) {
    if (rachas[i].completado) {
      rachaActual++
    } else {
      break
    }
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } })

  await prisma.usuario.update({
    where: { id: usuarioId },
    data: {
      rachaActual,
      rachaMaxima: Math.max(rachaActual, usuario.rachaMaxima)
    }
  })
}

module.exports = { actualizarRacha }