const express = require('express');
const router = express.Router();
const c = require('../controllers/prescriptionController');

router.get('/', c.getAllPrescriptions);
router.get('/:id', c.getPrescriptionById);
router.post('/', c.createPrescription);
router.put('/:id', c.updatePrescription);
router.delete('/:id', c.deletePrescription);

module.exports = router;