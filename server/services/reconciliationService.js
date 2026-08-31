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
                matched_at: new Date()
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


function daysBetween(date1, date2){
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffMs = Math.abs(d1-d2);
    return diffMs /(1000 * 60 * 60 *24);
}

async function runFuzzyMatch(){
    const InternalTxns = await db.InternalTransaction.findAll({
        where: { status: 'unmatched'}
    });
    const bankTxns = await db.BankTransaction.findAll({
        where: { status: 'unmatched' }
    });

    let fuzzyMatches = 0;

    for(const internal of InternalTxns){
        const bankMatch = bankTxns.find((bank) =>
            bank.reference_number === internal.reference_number &&
            bank.amount_cents === internal.amount_cents &&
            bank.status === 'unmatched' &&
            daysBetween(bank.transaction_date,internal.transaction_date) <= 2
);

        if(bankMatch){
            const dayDiff = daysBetween(bankMatch.transaction_date, internal.transaction_date);
            const confidence = dayDiff === 0 ? 1.0: 1.0 -(dayDiff * 0.1);

            await db.Match.create({
                internal_transaction_id: internal.id,
                bank_transaction_id: bankMatch.id,
                match_type:'fuzzy',
                confidence_score: confidence,
                discrepancy_type: 'none',
                matched_at: new Date()
            });

            internal.status = 'matched';
            bankMatch.status ='matched';
            await internal.save();
            await bankMatch.save();

            fuzzyMatches++;
        }
    }
    
    return { fuzzyMatches };
}

module.exports = { runReconciliation, runFuzzyMatch };