const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require ('cors');
require('dotenv').config();


const app = express();

const PORT  = process.env.PORT  || 5000; 

app.use(express.json());
app.use(cors());

// Configurar almacenamiento de fotos con multer. 

const storage = multer.diskStorage({

destination: (req , file, cb) => {

cb(null,'uploads/'); // carpeta donde se guardaria las fotos.

},

filename:(req, file ,cb) => {

 cb(null,Date.now() + path.extname(file.originalname));// date para evitar duplicados.   
}
}
);

const upload = multer ({storage});

// endpoit para subir fotos(solo accesible para el admin) 

app.post('/upload', authenticateAdmin,upload.single('photo'),(req,res)=> {

if(!req.file){
    return res.status(400).send('no file uploaded')
}

res.send({message:'foto subida yeah', file:req.file})

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


// Endpoint para login y generar el token 

app.post('/login', async (req,res) => {

    const { username, password } = req.body;

    if(username === global.admin?.username && await bcrypt.compare(password, global.admin.password)) {

    const token = jwt.sing({username}, process.env.JWT_SECRET, { expiresIn: '1h'});
    res.json({ token });
} else {
    res.status(403).send('Credenciales incorrectas');
  }
});


// servir fotos subidas 

app.use('./uploads', express.static('uploads'));

app.listen(PORT, () => {

console.log(`Servidor corriendo en http://localhost:${PORT}`);
})




