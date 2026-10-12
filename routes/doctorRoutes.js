const express = require('express');
const router = express.Router();
const c = require('../controllers/doctorController');

router.get('/', c.getAllDoctors);
router.get('/:id', c.getDoctorById);
router.post('/', c.createDoctor);
router.put('/:id', c.updateDoctor);
router.delete('/:id', c.deleteDoctor);

module.exports = router;