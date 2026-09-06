'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // internal_transaction_id and bank_transaction_id are both nullable
    // becuase a "match" row can also represent a discrepancy. example: a bank
    // transaction with no internal counterpart (internal_transaction_id = null)
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
          model: 'bank_transactions', // must be plural - matches actual table name;
          key: 'id'                   // a singular typo here previously corrupted
        },                            // the FK contraint after a rename migration
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
