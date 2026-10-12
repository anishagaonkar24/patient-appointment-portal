'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointments', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Doctors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Patients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      appointmentDate: { type: Sequelize.DATEONLY, allowNull: false },
      timeSlot: { type: Sequelize.STRING(5), allowNull: false },
      reason: { type: Sequelize.STRING(255), allowNull: false },
      status: {
        type: Sequelize.ENUM('Scheduled', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Scheduled',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    // A doctor cannot be booked twice for the same date and time slot
    await queryInterface.addIndex('Appointments', ['doctorId', 'appointmentDate', 'timeSlot'], {
      unique: true,
      name: 'unique_doctor_slot',
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Appointments');
  },
};