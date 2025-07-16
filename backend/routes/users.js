const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
	const rows = await db.select('*').from('User');
	res.json(rows);
});

router.post('/', async (req, res) => {
	console.log(req.body); // Debug log
	const { id, firstName, lastName, birthDate } = req.body;
	
	// Validate input
	const missingFields = [];
	if (!id) missingFields.push('id');
	if (!firstName) missingFields.push('firstName');
	if (!lastName) missingFields.push('lastName');
	if (!birthDate) missingFields.push('birthDate');

	if (missingFields.length > 0) {
		return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}` });
	}
	await db('User').insert({ id, firstName, lastName, birthDate });
	res.sendStatus(201);
});

module.exports = router;