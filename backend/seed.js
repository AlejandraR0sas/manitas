const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('Limpiando datos anteriores...')
  await prisma.progresoUsuario.deleteMany()
  await prisma.racha.deleteMany()
  await prisma.ranking.deleteMany()
  await prisma.ejercicio.deleteMany()
  await prisma.leccion.deleteMany()
  await prisma.modulo.deleteMany()
  await prisma.usuario.deleteMany()

  console.log('Sembrando datos...')

  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.usuario.create({
    data: {
      nombre: 'Administrador',
      email: 'admin@manitas.com',
      passwordHash,
      rol: 'ADMIN'
    }
  })

  await prisma.modulo.create({
    data: {
      titulo: 'Abecedario A - Z',
      descripcion: 'Aprende las letras del abecedario en Lengua de Señas Mexicana',
      nivel: 'BASICO',
      orden: 1,
      lecciones: {
        create: [
          {
            titulo: 'Letras A - E',
            tipo: 'TEORIA',
            orden: 1,
            puntosRecompensa: 10,
            ejercicios: {
              create: [
                { pregunta: 'A', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'A', imagen: '/senas/a.png', orden: 1 },
                { pregunta: 'B', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'B', imagen: '/senas/b.png', orden: 2 },
                { pregunta: 'C', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'C', imagen: '/senas/c.png', orden: 3 },
                { pregunta: 'D', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'D', imagen: '/senas/d.png', orden: 4 },
                { pregunta: 'E', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'E', imagen: '/senas/e.png', orden: 5 },
              ]
            }
          },
          {
            titulo: 'Letras F - J',
            tipo: 'TEORIA',
            orden: 2,
            puntosRecompensa: 10,
            ejercicios: {
              create: [
                { pregunta: 'F', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'F', imagen: '/senas/f.png', orden: 1 },
                { pregunta: 'G', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'G', imagen: '/senas/g.png', orden: 2 },
                { pregunta: 'H', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'H', imagen: '/senas/h.png', orden: 3 },
                { pregunta: 'I', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'I', imagen: '/senas/i.png', orden: 4 },
                { pregunta: 'J', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'J', imagen: '/senas/j.png', orden: 5 },
              ]
            }
          },
          {
            titulo: 'Letras K - O',
            tipo: 'TEORIA',
            orden: 3,
            puntosRecompensa: 10,
            ejercicios: {
              create: [
                { pregunta: 'K', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'K', imagen: '/senas/k.png', orden: 1 },
                { pregunta: 'L', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'L', imagen: '/senas/l.png', orden: 2 },
                { pregunta: 'M', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'M', imagen: '/senas/m.png', orden: 3 },
                { pregunta: 'N', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'N', imagen: '/senas/n.png', orden: 4 },
                { pregunta: 'O', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'O', imagen: '/senas/o.png', orden: 5 },
              ]
            }
          },
          {
            titulo: 'Letras P - T',
            tipo: 'TEORIA',
            orden: 4,
            puntosRecompensa: 10,
            ejercicios: {
              create: [
                { pregunta: 'P', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'P', imagen: '/senas/p.png', orden: 1 },
                { pregunta: 'Q', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'Q', imagen: '/senas/q.png', orden: 2 },
                { pregunta: 'R', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'R', imagen: '/senas/r.png', orden: 3 },
                { pregunta: 'S', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'S', imagen: '/senas/s.png', orden: 4 },
                { pregunta: 'T', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'T', imagen: '/senas/t.png', orden: 5 },
              ]
            }
          },
          {
            titulo: 'Letras U - Z',
            tipo: 'TEORIA',
            orden: 5,
            puntosRecompensa: 15,
            ejercicios: {
              create: [
                { pregunta: 'U', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'U', imagen: '/senas/u.png', orden: 1 },
                { pregunta: 'V', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'V', imagen: '/senas/v.png', orden: 2 },
                { pregunta: 'W', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'W', imagen: '/senas/w.png', orden: 3 },
                { pregunta: 'X', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'X', imagen: '/senas/x.png', orden: 4 },
                { pregunta: 'Y', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'Y', imagen: '/senas/y.png', orden: 5 },
                { pregunta: 'Z', tipo: 'OPCION_MULTIPLE', respuestaCorrecta: 'Z', imagen: '/senas/z.png', orden: 6 },
              ]
            }
          },
          {
            titulo: 'Practica con tu cámara',
            tipo: 'CAMARA',
            orden: 6,
            puntosRecompensa: 25,
          }
        ]
      }
    }
  })
await prisma.modulo.create({
  data: {
    titulo: 'Saludos básicos',
    descripcion: 'Aprende a saludar y despedirte en LSM',
    nivel: 'BASICO',
    orden: 2,
    lecciones: {
      create: [
        {
          titulo: 'Hola, adiós y gracias',
          tipo: 'TEORIA',
          orden: 1,
          puntosRecompensa: 15,
          ejercicios: {
            create: [
              {
                pregunta: 'Hola',
                tipo: 'OPCION_MULTIPLE',
                respuestaCorrecta: 'Hola',
                video: 'https://www.youtube.com/embed/lhrN2iaPdaM',
                orden: 1
              },
              {
                pregunta: 'Adiós',
                tipo: 'OPCION_MULTIPLE',
                respuestaCorrecta: 'Adios',
                video: 'https://www.youtube.com/embed/aI1ohGAwVHc',
                orden: 2
              },
              {
                pregunta: 'Gracias',
                tipo: 'OPCION_MULTIPLE',
                respuestaCorrecta: 'Gracias',
                video: 'https://www.youtube.com/embed/jAvN4wvvpgY',
                orden: 3
              },
            ]
          }
        },
      ]
    }
  }
})
  console.log('✅ Datos sembrados exitosamente')
  console.log('Admin: admin@manitas.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })