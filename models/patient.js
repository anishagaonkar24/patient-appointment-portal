'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      // Patient 1:M Appointments
      Patient.hasMany(models.Appointment, {
        foreignKey: { name: 'patientId', allowNull: false },
        as: 'appointments',
        onDelete: 'CASCADE',
      });
      // Patient 1:M Prescription Logs
      Patient.hasMany(models.PrescriptionLog, {
        foreignKey: { name: 'patientId', allowNull: false },
        as: 'prescriptions',
        onDelete: 'CASCADE',
      });
    }
  }
  Patient.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: { msg: 'Patient name is required' } },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { isEmail: { msg: 'Enter a valid email address' } },
      },
      phone: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: { is: { args: /^[0-9]{10}$/, msg: 'Phone must be exactly 10 digits' } },
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'Date of birth must be a valid date' },
          notInFuture(value) {
            const today = new Date().toISOString().slice(0, 10);
            if (value > today) {
              throw new Error('Date of birth cannot be in the future');
            }
          },
        },
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
        validate: { isIn: { args: [['Male', 'Female', 'Other']], msg: 'Gender must be Male, Female or Other' } },
      },
    },
    { sequelize, modelName: 'Patient' }
  );
  return Patient;
};