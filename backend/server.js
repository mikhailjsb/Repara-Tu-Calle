const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * GET /api/reclamos
 * Returns all complaints and a count of complaints per category.
 */
app.get('/api/reclamos', async (req, res) => {
  try {
    // Fetch all complaints ordered by creation date desc
    const complaintsResult = await pool.query(
      'SELECT id, category, description, photo_path, latitude, longitude, address, created_at FROM reclamos ORDER BY created_at DESC'
    );

    // Fetch counts per category
    const countsResult = await pool.query(
      'SELECT category, COUNT(*) as count FROM reclamos GROUP BY category'
    );

    const counts = {};
    countsResult.rows.forEach(row => {
      counts[row.category] = parseInt(row.count, 10);
    });

    res.json({ complaints: complaintsResult.rows, counts });
  } catch (err) {
    console.error('Error fetching complaints', err);
    res.status(500).json({ error: 'Error fetching complaints' });
  }
});

/**
 * POST /api/reclamos
 * Creates a new complaint. Expects `category` and `description` fields and a file `photo`.
 */
app.post('/api/reclamos', upload.single('photo'), async (req, res) => {
  const { category, description, latitude, longitude, address } = req.body;
  const file = req.file;

  // Validate input
  if (!category || !description || !file) {
    return res.status(400).json({ error: 'Faltan campos requeridos: categoría, descripción o foto' });
  }

  try {
    const photoPath = '/uploads/' + file.filename;
    const insertResult = await pool.query(
      'INSERT INTO reclamos (category, description, photo_path, latitude, longitude, address, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id, category, description, photo_path, latitude, longitude, address, created_at',
      [category, description, photoPath, latitude, longitude, address]
    );
    res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error('Error inserting complaint', err);
    res.status(500).json({ error: 'Error inserting complaint' });
  }
});

/**
 * GET /api/info
 * Returns static information about the initiative.
 */
app.get('/api/info', (req, res) => {
  res.json({
    title: 'Repara Tu Calle',
    content: 'Repara Tu Calle es una iniciativa comunitaria que busca mejorar la infraestructura vial reportando hoyos, desniveles, resaltos fuera de norma y problemas en calles peatonales. Los ciudadanos pueden subir fotos y descripciones de las calles en mal estado para que las autoridades y la comunidad tomen medidas. Únete a nosotros para mejorar nuestras calles y hacer nuestra ciudad más segura.',
    categories: [
      { key: 'hoyo', label: 'Hoyo' },
      { key: 'desnivel', label: 'Desnivel' },
      { key: 'resalto_fuera_de_norma', label: 'Resalto fuera de norma' },
      { key: 'calle_peatonal', label: 'Calle peatonal' }
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});