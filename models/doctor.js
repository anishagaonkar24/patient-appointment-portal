'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      // Doctor 1:M Appointments
      Doctor.hasMany(models.Appointment, {
        foreignKey: { name: 'doctorId', allowNull: false },
        as: 'appointments',
        onDelete: 'CASCADE',
      });
      // Doctor 1:M Prescription Logs
      Doctor.hasMany(models.PrescriptionLog, {
        foreignKey: { name: 'doctorId', allowNull: false },
        as: 'prescriptions',
        onDelete: 'CASCADE',
      });
    }
  }
  Doctor.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: { msg: 'Doctor name is required' } },
      },
      specialization: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: { msg: 'Specialization is required' } },
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
      experienceYears: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: { args: [0], msg: 'Experience cannot be negative' },
          max: { args: [60], msg: 'Experience cannot be more than 60 years' },
        },
      },
    },
    { sequelize, modelName: 'Doctor' }
  );
  return Doctor;
};