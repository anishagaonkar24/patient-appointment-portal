'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.Doctor, {
        foreignKey: { name: 'doctorId', allowNull: false },
        as: 'doctor',
      });
      Appointment.belongsTo(models.Patient, {
        foreignKey: { name: 'patientId', allowNull: false },
        as: 'patient',
      });
    }
  }
  Appointment.init(
    {
      appointmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: { isDate: { msg: 'Appointment date must be a valid date' } },
      },
      timeSlot: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
          is: { args: /^([01]\d|2[0-3]):[0-5]\d$/, msg: 'Time slot must be in HH:MM format (e.g. 10:30)' },
        },
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: { msg: 'Reason for visit is required' } },
      },
      status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Scheduled',
        validate: { isIn: { args: [['Scheduled', 'Completed', 'Cancelled']], msg: 'Invalid status' } },
      },
    },
    { sequelize, modelName: 'Appointment' }
  );
  return Appointment;
};