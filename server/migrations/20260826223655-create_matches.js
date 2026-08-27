'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('matches', {
      id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      internal_transaction_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references:{
          model: 'internal_transactions',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      bank_transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'bank_transactions',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      match_type:{
        type: Sequelize.ENUM('exact','fuzzy','manual'),
        allowNull: false
      },
      confidence_score: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      discrepancy_type:{
        type: Sequelize.ENUM('none','amount_mismatch', 'missing_internal','missing_bank','duplicate'),
        defaultValue: 'none'
      },
      matched_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('matches');
  }
};
