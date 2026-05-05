const router = require('express').Router()
const { verificarToken } = require('../middlewares/auth.middleware')
const { soloAdmin } = require('../middlewares/admin.middleware')
const {
  obtenerUsuarios,
  crearModulo,
  crearLeccion,
  crearEjercicio,
  obtenerEstadisticas,
  obtenerModulos,
  obtenerLeccion,
  eliminarModulo,
  eliminarLeccion,
  eliminarEjercicio
} = require('../controllers/admin.controller')

router.get('/usuarios', verificarToken, soloAdmin, obtenerUsuarios)
router.get('/estadisticas', verificarToken, soloAdmin, obtenerEstadisticas)
router.get('/modulos', verificarToken, soloAdmin, obtenerModulos)
router.get('/lecciones/:id', verificarToken, soloAdmin, obtenerLeccion)
router.post('/modulos', verificarToken, soloAdmin, crearModulo)
router.post('/lecciones', verificarToken, soloAdmin, crearLeccion)
router.post('/ejercicios', verificarToken, soloAdmin, crearEjercicio)
router.delete('/modulos/:id', verificarToken, soloAdmin, eliminarModulo)
router.delete('/lecciones/:id', verificarToken, soloAdmin, eliminarLeccion)
router.delete('/ejercicios/:id', verificarToken, soloAdmin, eliminarEjercicio)

module.exports = router