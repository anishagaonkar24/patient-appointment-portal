const express = require('express');
const router = express.Router();
const c = require('../controllers/patientController');

router.get('/', c.getAllPatients);
router.get('/:id', c.getPatientById);
router.post('/', c.createPatient);
router.put('/:id', c.updatePatient);
router.delete('/:id', c.deletePatient);

module.exports = router;