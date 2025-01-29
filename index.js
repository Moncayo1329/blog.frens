const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require ('cors');
require('dotenv').config();
const app = express();
const port = 5000;


app.use(express.json());
app.use(cors());


// Configurar almacenamiento de fotos con multer. 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Guarda las imágenes en la carpeta 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));// para evitar duplicados 
  }
});

const upload = multer({ storage });

// Middleware para permitir JSON y URLs codificadas en formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta privada para servir el formulario (requiere clave secreta)
app.get('/admin', (req, res) => {
  const secretKey = req.query.key; // Clave secreta pasada en la URL

  // Verificar que la clave secreta es correcta
  if (secretKey === 'miClaveSecreta123') {
    // Si la clave es correcta, servir el formulario
    res.sendFile(path.join(__dirname, 'formulario.html'));
  } else {
    // Si la clave es incorrecta, responder con un mensaje de error
    res.status(403).send('Acceso denegado. Clave incorrecta.');
  }
});


// Endpoint para crear un admin (solo lo haras una vez) 

app.post('/create-admin', async(req,res) => {
    const {username, password }= req.body;
    const hashedPassword = await bcrypt.hash(password, 10);


const admin = {username, password:hashedPassword };
global.admin = admin;
res.send('admin creado')
}); 

// Funcion para autenticar al admin 
function authenticateAdmin(req, res, next) {

    const token = req.headers['authorization']
if (!token) return res.status(402).send('acceso denegado je');



try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.username === global.admin?.username) {
   next();
    } else {
res.status(403).send('Acceso denegado');

    }

} catch(error){
res.status(400).send('Token ivalido');



    }
}








app.post('/login', async (req,res) => {

    const { username, password } = req.body;

    if(username === global.admin?.username && await bcrypt.compare(password, global.admin.password)) {

    const token = jwt.sing({username}, process.env.JWT_SECRET, { expiresIn: '1h'});
    res.json({ token });
} else {
    res.status(403).send('Credenciales incorrectas');
  }
});




// Ruta para agregar una nueva entrada en el blog
app.post('/add', upload.single('foto'), (req, res) => {
  const { titulo } = req.body;
  const foto = req.file ? req.file.filename : null;

  const nuevoBlog = new Blog({ titulo, foto });
  nuevoBlog.save()
    .then(() => res.send('Entrada añadida exitosamente'))
    .catch(err => res.status(500).send('Error al guardar la entrada'));
});

// Ruta para obtener todas las entradas del Glog
app.get('/open', (req, res) => {
  open.find()
.then(Blogs => res.json(Blogs))
    .catch(err => res.status(500).send('Error al obtener los glogs'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});





