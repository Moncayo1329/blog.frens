const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;

// Enable CORS for all routes (this allows cross-origin requests)
app.use(cors());

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the 'uploads' directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Guarda las imágenes en la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Asigna un nombre único a la imagen
  }
});

const upload = multer({ storage });

// Ruta para agregar una nueva entrada en el Glog
app.post('/add', upload.single('foto'), (req, res) => {
  const { titulo } = req.body;
  const foto = req.file ? req.file.filename : null;

  if (!titulo || !foto) {
    return res.status(400).send('Faltan datos.');
  }

  // Aquí puedes guardar la información en un archivo o en una base de datos diferente
  // Por ahora, solo enviamos una respuesta de éxito
  res.send('Entrada añadida exitosamente');
});

// Ruta para obtener la lista de imágenes
app.get('/images', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Error al leer la carpeta de imágenes');
    }
    res.json(files);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});