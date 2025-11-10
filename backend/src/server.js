import express from 'express';
import cors from 'cors';
import imageRoutes from './routes/image.js';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', imageRoutes);

const outputsPath = resolve(__dirname, '../outputs');

if (!fs.existsSync(outputsPath)) {
  fs.mkdirSync(outputsPath, { recursive: true });
}

app.get('/images/:filename', (req, res) => {
  const filePath = join(outputsPath, req.params.filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      error: 'File not found',
      requested: req.params.filename
    });
  }
  
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Cache-Control', 'public, max-age=31536000');
  res.sendFile(filePath);
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving images from: ${outputsPath}`);
  console.log(`Images available at: http://localhost:${PORT}/images/`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`Please either:`);
    console.error(`  1. Kill the process using port ${PORT}: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`  2. Or set a different port: PORT=3001 npm run dev\n`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});
