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


const admin = {usernamame, password} = req.body;




})

