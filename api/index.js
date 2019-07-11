const router = module.exports = require('express').Router()

router.use('/amiibo', require('./amiibo').router);