const express = require('express');
const router = express.Router();
const c = require('../controllers/appointmentController');

router.get('/', c.getAllAppointments);
router.get('/:id', c.getAppointmentById);
router.post('/', c.createAppointment);
router.put('/:id', c.updateAppointment);
router.delete('/:id', c.deleteAppointment);

module.exports = router;