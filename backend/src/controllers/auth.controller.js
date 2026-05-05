const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const registro = async (req, res) => {
  const { nombre, email, password } = req.body
  try {
    const usuarioExiste = await prisma.usuario.findUnique({ where: { email } })
    if (usuarioExiste) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const usuario = await prisma.usuario.create({
      data: { nombre, email, passwordHash }
    })
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.status(201).json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales incorrectas' })
    }
    const passwordValido = await bcrypt.compare(password, usuario.passwordHash)
    if (!passwordValido) {
      return res.status(400).json({ error: 'Credenciales incorrectas' })
    }
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimaSesion: new Date() }
    })
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

const perfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        puntosTotales: true,
        rachaActual: true,
        rachaMaxima: true
      }
    })
    res.json(usuario)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' })
  }
}

module.exports = { registro, login, perfil }