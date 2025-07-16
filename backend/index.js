const express = require('express');
const cors = require('cors');
const recordRoutes = require('./routes/records');
const documentRoutes = require('./routes/documents');
const recordTypeRoutes = require('./routes/recordTypes');
const userRoutes = require('./routes/users');
const healthCheckRoutes = require('./routes/healthCheck');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/records', recordRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/record-types', recordTypeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthCheckRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
