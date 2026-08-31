const express = require('express');
const { runReconciliation, runFuzzyMatch } = require('../services/reconciliationService');

const router = express.Router();

router.post('/run', async (req, res) =>{
    try{
        const exactResult = await runReconciliation();
        const fuzzyResult = await runFuzzyMatch();
        res.json({...exactResult, ...fuzzyResult});
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;