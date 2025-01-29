import React, { useState, useEffect } from 'react';
import './App.css';

function Admin() {
  const [titulo, setTitulo] = useState('');
  const [foto, setFoto] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    try {
      const response = await fetch('http://localhost:5000/images');
      const imageData = await response.json();
      setImages(imageData);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('foto', foto);

    try {
      const response = await fetch('http://localhost:5000/add', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Imagen subida exitosamente!');
        setTitulo('');
        setFoto(null);
        loadImages();
      } else {
        alert('Error al subir la imagen.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir la imagen.');
    }
  };

  const handleDelete = async (filename) => {
    try {
      const response = await fetch(`http://localhost:5000/delete/${filename}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Imagen eliminada exitosamente!');
        loadImages();
      } else {
        alert('Error al eliminar la imagen.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la imagen.');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Administrar Imágenes</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="titulo" 
            placeholder="Título" 
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required 
          /><br /><br />
          <input 
            type="file" 
            name="foto" 
            accept="image/*" 
            onChange={(e) => setFoto(e.target.files[0])}
            required 
          /><br /><br />
          <button type="submit">Subir</button>
        </form>
        <div className="image-list">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img 
                src={`http://localhost:5000/uploads/${image.foto}`} 
                alt={image.titulo}
                style={{ maxWidth: '200px', margin: '10px' }}
              />
              <p>{image.titulo}</p>
              <button onClick={() => handleDelete(image.foto)}>Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
