'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InternalTransaction extends Model {
    static associate(models){
        InternalTransaction.hasMany(models.Match, {
            foreignKey: 'internal_transaction_id'
        });
    }
  }
  InternalTransaction.init({
    reference_number: DataTypes.STRING,
    amount_cents: DataTypes.INTEGER,
    transaction_date: DataTypes.DATEONLY,
    description: DataTypes.STRING,
    status: DataTypes.ENUM('unmatched','matched','disputed')
  }, {
    sequelize,
    modelName: 'InternalTransaction',
    tableName: 'internal_transactions',
    underscored: true
  });
  return InternalTransaction;
};