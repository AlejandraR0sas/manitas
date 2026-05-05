const router = require('express').Router()
const { obtenerModulos, obtenerModulo } = require('../controllers/modulos.controller')
const { verificarToken } = require('../middlewares/auth.middleware')

router.get('/', verificarToken, obtenerModulos)
router.get('/:id', verificarToken, obtenerModulo)

module.exports = router