const { Doctor, Appointment, Patient } = require('../models');
const handleError = require('../utils/errorHandler');

// GET /api/doctors?specialization=Cardiologist
exports.getAllDoctors = async (req, res) => {
  try {
    const where = {};
    if (req.query.specialization) where.specialization = req.query.specialization;
    const doctors = await Doctor.findAll({ where, order: [['name', 'ASC']] });
    res.status(200).json(doctors);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/doctors/:id  (includes the doctor's appointments)
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [
        {
          model: Appointment,
          as: 'appointments',
          include: [{ model: Patient, as: 'patient', attributes: ['id', 'name', 'phone'] }],
        },
      ],
    });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (err) {
    handleError(res, err);
  }
};

// POST /api/doctors
exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization, email, phone, experienceYears } = req.body;
    const doctor = await Doctor.create({ name, specialization, email, phone, experienceYears });
    res.status(201).json(doctor);
  } catch (err) {
    handleError(res, err);
  }
};

// PUT /api/doctors/:id
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    await doctor.update(req.body, {
      fields: ['name', 'specialization', 'email', 'phone', 'experienceYears'],
    });
    res.status(200).json(doctor);
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /api/doctors/:id
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    await doctor.destroy();
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};