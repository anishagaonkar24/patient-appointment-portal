const { Op } = require('sequelize');
const { Appointment, Doctor, Patient } = require('../models');
const handleError = require('../utils/errorHandler');

// GET /api/appointments
// Optional filters: ?status=Scheduled&doctorId=1&patientId=2&from=2026-10-01&to=2026-10-31&search=fever
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, doctorId, patientId, from, to, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;

    if (from && to) where.appointmentDate = { [Op.between]: [from, to] };
    else if (from) where.appointmentDate = { [Op.gte]: from };
    else if (to) where.appointmentDate = { [Op.lte]: to };

    if (search) where.reason = { [Op.like]: `%${search}%` };

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Doctor, as: 'doctor', attributes: ['id', 'name', 'specialization'] },
        { model: Patient, as: 'patient', attributes: ['id', 'name', 'phone'] },
      ],
      order: [
        ['appointmentDate', 'ASC'],
        ['timeSlot', 'ASC'],
      ],
    });
    res.status(200).json(appointments);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/appointments/:id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Doctor, as: 'doctor' },
        { model: Patient, as: 'patient' },
      ],
    });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json(appointment);
  } catch (err) {
    handleError(res, err);
  }
};

// POST /api/appointments
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate, timeSlot, reason, status } = req.body;

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const patient = await Patient.findByPk(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Do not allow booking in the past
    const today = new Date().toISOString().slice(0, 10);
    if (appointmentDate && appointmentDate < today) {
      return res.status(400).json({ message: 'Validation failed', errors: ['Appointment date cannot be in the past'] });
    }

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      appointmentDate,
      timeSlot,
      reason,
      status,
    });
    res.status(201).json(appointment);
  } catch (err) {
    handleError(res, err);
  }
};

// PUT /api/appointments/:id
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Do not allow moving an appointment to a past date
    const today = new Date().toISOString().slice(0, 10);
    if (req.body.appointmentDate && req.body.appointmentDate < today) {
      return res.status(400).json({ message: 'Validation failed', errors: ['Appointment date cannot be in the past'] });
    }

    await appointment.update(req.body, {
      fields: ['appointmentDate', 'timeSlot', 'reason', 'status'],
    });
    res.status(200).json(appointment);
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    await appointment.destroy();
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};
