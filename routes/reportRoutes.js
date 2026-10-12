const express = require('express');
const router = express.Router();
const c = require('../controllers/reportController');

router.get('/doctor-summary', c.doctorSummary);

module.exports = router;