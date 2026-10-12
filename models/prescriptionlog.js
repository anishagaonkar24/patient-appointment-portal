'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PrescriptionLog extends Model {
    static associate(models) {
      PrescriptionLog.belongsTo(models.Patient, {
        foreignKey: { name: 'patientId', allowNull: false },
        as: 'patient',
      });
      PrescriptionLog.belongsTo(models.Doctor, {
        foreignKey: { name: 'doctorId', allowNull: false },
        as: 'doctor',
      });
    }
  }
  PrescriptionLog.init(
    {
      medicine: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { notEmpty: { msg: 'Medicine name is required' } },
      },
      dosage: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: { msg: 'Dosage is required' } },
      },
      durationDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [1], msg: 'Duration must be at least 1 day' },
          max: { args: [365], msg: 'Duration cannot be more than 365 days' },
        },
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      issuedDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    { sequelize, modelName: 'PrescriptionLog' }
  );
  return PrescriptionLog;
};