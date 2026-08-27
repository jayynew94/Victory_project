'use strict';

const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class BankTransaction extends Model {
        static associate(models){
            BankTransaction.hasMany(models.Match,{
                foreignKey: 'bank_transaction_id'
            });
        }
    }
    BankTransaction.init({
        reference_number: DataTypes.STRING,
        amount_cents: DataTypes.INTEGER,
        transaction_date: DataTypes.DATEONLY,
        description: DataTypes.STRING,
        status: DataTypes.ENUM('unmatched', 'matched','disputed')
    }, {
        sequelize,
        modelName: 'BankTransaction',
        tableName: 'bank_transactions',
        underscored: true
    });
    return BankTransaction;
};
