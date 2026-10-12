const { PrescriptionLog, Patient, Doctor } = require('../models');
const handleError = require('../utils/errorHandler');

// GET /api/prescriptions?patientId=1&doctorId=1
exports.getAllPrescriptions = async (req, res) => {
  try {
    const where = {};
    if (req.query.patientId) where.patientId = req.query.patientId;
    if (req.query.doctorId) where.doctorId = req.query.doctorId;

    const prescriptions = await PrescriptionLog.findAll({
      where,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'name'] },
        { model: Doctor, as: 'doctor', attributes: ['id', 'name'] },
      ],
      order: [['issuedDate', 'DESC']],
    });
    res.status(200).json(prescriptions);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/prescriptions/:id
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await PrescriptionLog.findByPk(req.params.id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' },
      ],
    });
    if (!prescription) return res.status(404).json({ message: 'Prescription log not found' });
    res.status(200).json(prescription);
  } catch (err) {
    handleError(res, err);
  }
};

// POST /api/prescriptions
exports.createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, medicine, dosage, durationDays, instructions, issuedDate } = req.body;

    const patient = await Patient.findByPk(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const prescription = await PrescriptionLog.create({
      patientId,
      doctorId,
      medicine,
      dosage,
      durationDays,
      instructions,
      issuedDate,
    });
    res.status(201).json(prescription);
  } catch (err) {
    handleError(res, err);
  }
};

// PUT /api/prescriptions/:id
exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await PrescriptionLog.findByPk(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Prescription log not found' });
    await prescription.update(req.body, {
      fields: ['medicine', 'dosage', 'durationDays', 'instructions', 'issuedDate'],
    });
    res.status(200).json(prescription);
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /api/prescriptions/:id
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await PrescriptionLog.findByPk(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Prescription log not found' });
    await prescription.destroy();
    res.status(200).json({ message: 'Prescription log deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};
