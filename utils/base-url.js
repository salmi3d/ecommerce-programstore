module.exports = {
  getBaseUrl: req => `${req.protocol}://${req.get('host')}`
}
