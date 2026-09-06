const db = require('../models');
const { Op } = require('sequelize');

/**
 * Exact-match pass: matches internal and bank transactions where
 * reference_number, amount_cents, and transaction_date are all indentical.
 * Runs first, before fuzzy matching, so the highest-confidence matches
 * are claimed before any looser matching logic runs
 */

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
          // rechecking status here prevents this same reconciliation run from 
          // matching one bank transaction to two different internal ones 
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

// Converts the gap between two date strings into a number of days.
// Used to allow "close enough" matches (example: bank settlement lag)
// instead of requiring exact date equality. 

function daysBetween(date1, date2){
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffMs = Math.abs(d1-d2);
    return diffMs /(1000 * 60 * 60 *24);
}
/**
 * Fuzzy-match pass: catches transactions with identical reference
 * number and amount, but a transaction_date within 2 days
 * accounts for a typical bank settlement lag. Confidence score decreases 10%
 * per day of date drift, so reviewers can prioritize weaker matches.
 */

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

/**
 * Discrepany detection: for whatever remains unmatched after both
 * the exact and fuzzy passes, creates a Match record making the 
 * gap explicitly rather than leaving it silently unmatched. This is 
 * what makes the matches table a complete audit trail - every 
 * transaction ends up referenced somewhere, either as a successful 
 * match or a flagged discrepancy. 
 */
async function runDiscrepancyDetection() {
    const unmatchedInternal = await db.InternalTransaction.findAll({
        where: { status: 'unmatched' }
    });
    const unmatchedBank = await db.BankTransaction.findAll({
        where: { status: 'unmatched'}
    });

    let missingBank = 0;
    let missingInternal = 0;

    for(const internal of unmatchedInternal) {
        await db.Match.create({
            internal_transaction_id: internal.id,
            bank_transaction_id: null,
            match_type: 'manual',
            confidence_score: null,
            discrepancy_type: 'missing_bank',
            matched_at: null
        });
        missingBank++;
    }

    for(const bank of unmatchedBank){
        await db.Match.create({
            internal_transaction_id: null,
            bank_transaction_id: bank.id,
            match_type: 'manual',
            confidence_score: null, 
            discrepancy_type: 'missing_internal',
            matched_at: null
        });
        missingInternal++
    }


    return { missingBank, missingInternal };
}


module.exports = { runReconciliation, runFuzzyMatch, runDiscrepancyDetection };