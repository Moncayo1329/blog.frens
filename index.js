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

// Ruta para agregar una nueva entrada en el blog
app.post('/add', upload.single('foto'), (req, res) => {
  const { titulo } = req.body;
  const foto = req.file ? req.file.filename : null;

  if (!titulo || !foto) {
    return res.status(400).send('Faltan datos.');
  }


  const newImage = {titulo, foto};

  // Leer archivo JSON existente 

fs.readFile('images.json',(err,data) => {

  let images = [];
  if(!err) {
images = JSON.parse(data);
  }

  images.push(newImage);

  // Guardar en archivo JSON 
  fs.writeFile('images.json', JSON.stringify(images),(err) => {
 if (err) {
  return res.status(500).send('Error al guardar la entrada');
 }
res.send('Entrada añadida exitosamente')
});
});
});



// Ruta para obtener la lista de imágenes
app.get('/images', (req, res) => {
  fs.readFile('images.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer la lista de imágenes');
    }
    res.json(JSON.parse(data));
  });
});


// Ruta para eliminar una imagen 

app.delete('/delete/:filename', (req, res) => {
  const { filename } = req.params;

  fs.readFile('images.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer la lista de imágenes');
    }

    let images = JSON.parse(data);
    images = images.filter(image => image.foto !== filename);

    fs.writeFile('images.json', JSON.stringify(images), (err) => {
      if (err) {
        return res.status(500).send('Error al guardar la lista de imágenes');
      }

      fs.unlink(`uploads/${filename}`, (err) => {
        if (err) {
          return res.status(500).send('Error al eliminar la imagen');
        }
        res.send('Imagen eliminada exitosamente');
      });
    });
  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});