const express = require('express');
const { runReconciliation } = require('../services/reconciliationService');

const router = express.Router();

router.post('/run', async (req, res) =>{
    try{
        const result = await runReconciliation();
        res.json(result);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;