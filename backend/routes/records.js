const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
	const rows = await db.select('*').from('Record');
	res.json(rows);
});

router.post('/', async (req, res) => {
	const { patientID, date, typeID, doctor_name, notes } = req.body;
	// Validate input
	const missingFields = [];
	if (!patientID) missingFields.push('patientID');
	if (!date) missingFields.push('date');
	if (!typeID) missingFields.push('typeID');

	if (missingFields.length > 0) {
		return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
	}
	await db('Record').insert({ patientID, date, typeID, doctor_name, notes });
	res.sendStatus(201);
});

module.exports = router;