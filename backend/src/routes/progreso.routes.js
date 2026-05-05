const router = require('express').Router()
const { obtenerProgreso, completarLeccion } = require('../controllers/progreso.controller')
const { verificarToken } = require('../middlewares/auth.middleware')

router.get('/', verificarToken, obtenerProgreso)
router.post('/completar', verificarToken, completarLeccion)

module.exports = router