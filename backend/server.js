import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Main analysis API route
app.use('/api', analyzeRouter);
// Fallback to direct routing for /analyze to support all spec definitions
app.use('/', analyzeRouter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DevAgentX Core Engine'
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 DevAgentX Core Engine running on port ${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/analyze`);
  console.log(`==================================================`);
});
