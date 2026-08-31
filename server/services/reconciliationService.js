const db = require('../models');
const { Op } = require('sequelize');

async function runReconciliation() {
    const InternalTxns = await db.InternalTransaction.findAll({
        where: { status: 'unmatched' }
    });
    const bankTxns = await db.BankTransaction.findAll({
        where: { status: 'unmatched' }
    });

    let exactMatches = 0;

    for(const internal of InternalTxns) {
        const bankMatch = bankTxns.find((bank) =>
          bank.reference_number === internal.reference_number &&
          bank.amount_cents === internal.amount_cents &&
          bank.transaction_date === internal.transaction_date &&
          bank.status === 'unmatched'
        );

        if(bankMatch) {
            await db.Match.create({
                internal_transaction_id: internal.id,
                bank_transaction_id: bankMatch.id,
                match_type: 'exact',
                confidence_score: 1.0,
                discrepancy_type: 'none',
                match_at: new Date()
            });
        internal.status = 'matched';
        bankMatch.status = 'matched';
        await internal.save();
        await bankMatch.save();

        exactMatches++;
        }
    }
    
    return  { exactMatches };
}

module.exports = { runReconciliation };