import React, { useState, useEffect } from 'react';
import './App.css';

function Home() {
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

  return (
    <div className="App">
    <div className="container">
      <h1>Galería de Imágenes</h1>
      <div className="image-list">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img 
              src={`http://localhost:5000/uploads/${image.foto}`} 
              alt={image.titulo}
              style={{ maxWidth: '200px', margin: '10px' }}
            />
            <p>{image.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default Home;