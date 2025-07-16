const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
	const rows = await db.select('*').from('RecordType');
	res.json(rows);
});

router.post('/', async (req, res) => {
	const { name, description } = req.body;
	// Validate input
	if (!name) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	await db('RecordType').insert({ name, description });
	res.sendStatus(201);
});

module.exports = router;