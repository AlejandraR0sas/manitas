const router = require('express').Router()
const { obtenerRanking } = require('../controllers/ranking.controller')
const { verificarToken } = require('../middlewares/auth.middleware')

router.get('/', verificarToken, obtenerRanking)

module.exports = router