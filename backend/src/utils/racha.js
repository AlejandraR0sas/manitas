const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const actualizarRacha = async (usuarioId) => {

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const ayer = new Date(hoy)
  ayer.setDate(ayer.getDate() - 1)

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId }
  })

  const ultimaSesion = usuario.ultimaSesion
    ? new Date(usuario.ultimaSesion)
    : null

  if (ultimaSesion) {
    ultimaSesion.setHours(0, 0, 0, 0)
  }

  let nuevaRacha = 1

  if (ultimaSesion) {

    if (ultimaSesion.getTime() === hoy.getTime()) {

      nuevaRacha = usuario.rachaActual

    } else if (ultimaSesion.getTime() === ayer.getTime()) {

      nuevaRacha = usuario.rachaActual + 1

    }

  }

  await prisma.racha.upsert({
    where: {
      usuarioId_fecha: {
        usuarioId,
        fecha: hoy
      }
    },
    update: {
      completado: true
    },
    create: {
      usuarioId,
      fecha: hoy,
      completado: true
    }
  })

  await prisma.usuario.update({
    where: { id: usuarioId },
    data: {
      rachaActual: nuevaRacha,
      rachaMaxima: Math.max(nuevaRacha, usuario.rachaMaxima),
      ultimaSesion: hoy
    }
  })

}

module.exports = { actualizarRacha }

module.exports = { actualizarRacha }