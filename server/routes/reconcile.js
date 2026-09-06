const express = require('express');
const { runReconciliation, runFuzzyMatch, runDiscrepancyDetection } = require('../services/reconciliationService');
const db = require('../models');

const router = express.Router();

router.post('/run', async (req, res) =>{
    try{
        const exactResult = await runReconciliation();
        const fuzzyResult = await runFuzzyMatch();
        const discrepancyResult = await runDiscrepancyDetection();
        res.json({...exactResult, ...fuzzyResult, ...discrepancyResult });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message, details: err.errors });
    }
});

router.post('/manual-match', async (req, res) =>{
    const { match_id, internal_transaction_id, bank_transaction_id } = req.body;

    try {
      const match = await db.Match.findByPk(match_id);
      
      if(!match) {
        return res.status(404).json({ error: 'Match record not found' });
      }

      match.internal_transaction_id = internal_transaction_id;
      match.bank_transaction_id = bank_transaction_id;
      match.match_type = 'manual';
      match.discrepancy_type = 'none';
      match.confidence_score = null;
      match.matched_at = new Date();
      await match.save();

      await db.InternalTransaction.update(
        { status: 'matched'},
        { where: { id: internal_transaction_id } }
      );
      
      res.json({ success: true, match });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;