const express = require('express');
const { runReconciliation, runFuzzyMatch, runDiscrepancyDetection } = require('../services/reconciliationService');

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


module.exports = router;