const soloAdmin = (req, res, next) => {
  if (req.user.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso solo para administradores' })
  }
  next()
}

module.exports = { soloAdmin }