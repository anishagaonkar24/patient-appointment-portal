const { Patient, Appointment, PrescriptionLog, Doctor } = require('../models');
const handleError = require('../utils/errorHandler');

// GET /api/patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({ order: [['name', 'ASC']] });
    res.status(200).json(patients);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/patients/:id  (includes appointments + prescription logs)
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [
        {
          model: Appointment,
          as: 'appointments',
          include: [{ model: Doctor, as: 'doctor', attributes: ['id', 'name', 'specialization'] }],
        },
        {
          model: PrescriptionLog,
          as: 'prescriptions',
          include: [{ model: Doctor, as: 'doctor', attributes: ['id', 'name'] }],
        },
      ],
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patient);
  } catch (err) {
    handleError(res, err);
  }
};

// POST /api/patients
exports.createPatient = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, gender } = req.body;
    const patient = await Patient.create({ name, email, phone, dateOfBirth, gender });
    res.status(201).json(patient);
  } catch (err) {
    handleError(res, err);
  }
};

// PUT /api/patients/:id
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    await patient.update(req.body, {
      fields: ['name', 'email', 'phone', 'dateOfBirth', 'gender'],
    });
    res.status(200).json(patient);
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /api/patients/:id
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    await patient.destroy();
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};