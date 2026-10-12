'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PrescriptionLogs', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Patients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Doctors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      medicine: { type: Sequelize.STRING(150), allowNull: false },
      dosage: { type: Sequelize.STRING(100), allowNull: false },
      durationDays: { type: Sequelize.INTEGER, allowNull: false },
      instructions: { type: Sequelize.TEXT, allowNull: true },
      issuedDate: { type: Sequelize.DATEONLY, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('PrescriptionLogs');
  },
};