const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
	const rows = await db.select('*').from('Document');
	res.json(rows);
});

router.post('/', upload.single('file'), async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'File is required' });
	}
	const { recordId } = req.body;
	if (!recordId) {
		return res.status(400).json({ error: 'Record ID is required' });
	}

	// I want to generate a unique file path based on the recordId, file name and type
	const fPath = `uploads/${recordId}_${req.file.filename}`;

	console.log(`Uploading file for record ID: ${recordId}`);
	console.log(`File size: ${req.file.size} bytes`);
	console.log(`File name: ${req.file.originalname}, `);
	console.log(`File path: ${fPath}, `);
	console.log(`MIME type: ${req.file.mimetype}`);

	// await db('Document').insert({
	// 	recordId,
	// 	fileName: req.file.originalname,
	// 	filePath: fPath,
	// 	MIMEType: req.file.mimetype,
	// });
	res.sendStatus(201);
});

module.exports = router;