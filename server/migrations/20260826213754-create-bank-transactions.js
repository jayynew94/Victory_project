'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('bank_transactions',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
        },
      reference_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount_cents: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      transaction_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('unmatched','matched','disputed'),
        defaultValue: 'unmatched'
      },
      createdAt:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('bank_transactions')
  }
};
