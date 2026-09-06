'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Match extends Model {
        static associate(models){
            //Match holds both foreign keys, so it's the "belongsTo" side
            //of both relationships. InternalTransaction/BankTransaction
            //use "hasMany" on the other end.
            Match.belongsTo(models.InternalTransaction,{
                foreignKey: 'internal_transaction_id'
            });
            Match.belongsTo(models.BankTransaction,{
                foreignKey: 'bank_transaction_id'
            });
        }
    }
Match.init({
    internal_transaction_id: DataTypes.INTEGER,
    bank_transaction_id: DataTypes.INTEGER,
    match_type: DataTypes.ENUM('exact','fuzzy','manual'),
    confidence_score: DataTypes.FLOAT,
    discrepancy_type: DataTypes.ENUM('none', 'amount_mismatch','missing_internal', 'missing_bank','duplicate'),
    matched_at: DataTypes.DATE
},{
    sequelize,
    modelName: 'Match',
    tableName: 'matches',
    underscored: true
});
return Match;
};