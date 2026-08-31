const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('../models');
const { error } = require('console');

const router = express.Router();
const upload = multer({ dest: 'uploads/'});

router.post('/internal', upload.single('file'), async(req, res) =>{
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data',(row) => {
        results.push({
            reference_number: row.reference_number,
            amount_cents: parseInt(row.amount_cents, 10),
            transaction_date: row.transaction_date,
            description: row.description,
            status: 'unmatched'
        });
      })
      .on('end', async () => {
        try{
            const created = await db.InternalTransaction.bulkCreate(results);
            fs.unlinkSync(req.file.path);
            res.json({ inserted: created.length });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
      });
});

router.post('/bank', upload.single('file'), async(req, res) =>{
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv({
      mapHeaders: ({ header }) => header.trim()
    }))
    .on('data', (row) => {
      results.push({
        reference_number: row.reference_number,
        amount_cents: parseInt(row.amount_cents, 10),
        transaction_date: row.transaction_date,
        description: row.description,
        status: 'unmatched'
      });
    })
    .on('end', async () => {
      try {
        const created = await db.BankTransaction.bulkCreate(results);
        fs.unlinkSync(req.file.path);
        res.json({ inserted: created.length});
      } catch (err) {
        res.status(500).json({ error: error.message });
      }
    }); 
});




module.exports = router; 