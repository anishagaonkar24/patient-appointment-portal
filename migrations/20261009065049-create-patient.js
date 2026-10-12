'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Patients', {
      id: { 
        allowNull: false, 
        autoIncrement: true, 
        primaryKey: true, 
        type: Sequelize.INTEGER },

      name: { 
        type: Sequelize.STRING(100), 
        allowNull: false },

      email: { 
        type: Sequelize.STRING(100), 
        allowNull: false, 
        unique: true },

      phone: { 
        type: Sequelize.STRING(10), 
        allowNull: false },

      dateOfBirth: { 
        type: Sequelize.DATEONLY, 
        allowNull: false },
        
      gender: { 
        type: Sequelize.ENUM('Male', 'Female', 'Other'), 
        allowNull: false },

      createdAt: { 
        allowNull: false, 
        type: Sequelize.DATE },

      updatedAt: { 
        allowNull: false, 
        type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Patients');
  },
};