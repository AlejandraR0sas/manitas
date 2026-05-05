const router = require('express').Router()
const { obtenerLecciones, obtenerLeccion } = require('../controllers/lecciones.controller')
const { verificarToken } = require('../middlewares/auth.middleware')

router.get('/', verificarToken, obtenerLecciones)
router.get('/:id', verificarToken, obtenerLeccion)

module.exports = router