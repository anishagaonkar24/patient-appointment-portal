const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const handleError = require('../utils/errorHandler');

// GET /api/reports/doctor-summary
exports.doctorSummary = async (req, res) => {
  try {
    const sql = `
      SELECT
        d.id,
        d.name,
        d.specialization,
        COUNT(a.id) AS totalAppointments,
        CAST(COALESCE(SUM(a.status = 'Scheduled'), 0) AS UNSIGNED) AS scheduled,
        CAST(COALESCE(SUM(a.status = 'Completed'), 0) AS UNSIGNED) AS completed,
        CAST(COALESCE(SUM(a.status = 'Cancelled'), 0) AS UNSIGNED) AS cancelled
      FROM Doctors d
      LEFT JOIN Appointments a ON a.doctorId = d.id
      GROUP BY d.id, d.name, d.specialization
      ORDER BY totalAppointments DESC
    `;
    const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
    res.status(200).json(result);
  } catch (err) {
    handleError(res, err);
  }
};