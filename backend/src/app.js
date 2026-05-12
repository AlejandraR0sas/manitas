const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const modulosRoutes = require('./routes/modulos.routes');
const leccionesRoutes = require('./routes/lecciones.routes');
const progresoRoutes = require('./routes/progreso.routes');
const rankingRoutes = require('./routes/ranking.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://manitas-gamma.vercel.app'
];

// 🔥 CORS BIEN HECHO
app.use(cors({
  origin: function (origin, callback) {
    console.log("ORIGIN:", origin);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS bloqueado'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/lecciones', leccionesRoutes);
app.use('/api/progreso', progresoRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/admin', adminRoutes);

// HOME
app.get('/', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API de Manitas! 🤙' });
});

module.exports = app;