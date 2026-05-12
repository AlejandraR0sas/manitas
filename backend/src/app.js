const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const modulosRoutes = require('./routes/modulos.routes')
const leccionesRoutes = require('./routes/lecciones.routes')
const progresoRoutes = require('./routes/progreso.routes')
const rankingRoutes = require('./routes/ranking.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/modulos', modulosRoutes)
app.use('/api/lecciones', leccionesRoutes)
app.use('/api/progreso', progresoRoutes)
app.use('/api/ranking', rankingRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API de Manitas! 🤙' })
})

module.exports = app