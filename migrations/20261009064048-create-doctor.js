'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Doctors', 
      {
      id: { 
        allowNull: false, 
        autoIncrement: true, 
        primaryKey: true, type: 
        Sequelize.INTEGER },

      name: { 
        type: Sequelize.STRING(100), 
        allowNull: false },

      specialization: { 
        type: Sequelize.STRING(100), 
        allowNull: false },

      email: { 
        type: Sequelize.STRING(100), 
        allowNull: false, unique: true },

      phone: { 
        type: Sequelize.STRING(10), 
        allowNull: false },

      experienceYears: { 
        type: Sequelize.INTEGER, 
        defaultValue: 0 },

      createdAt: { 
        allowNull: false, 
        type: Sequelize.DATE },

      updatedAt: { 
        allowNull: false, 
        type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Doctors');
  },
};