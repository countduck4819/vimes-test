const express = require('express')
const router = express.Router()

const phieuNhapController = require('../controllers/phieuNhap.controller')
const validatePhieuNhap = require('../middlewares/validatePhieuNhap')

router.get('/', phieuNhapController.index)

router.get('/add', phieuNhapController.add)

router.post('/add', validatePhieuNhap, phieuNhapController.handleAdd)

router.get('/:so_phieu', phieuNhapController.detail)

module.exports = router