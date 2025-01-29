import React, { useState } from 'react';
import axios from 'axios';
import Login from './login';

function Admin() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cambiar archivo
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Enviar foto al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Por favor, inicia sesión primero.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error al subir la foto');
    }
  };

  return (
    <div>
      <h2>Panel de Administración</h2>
      {!isLoggedIn ? (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} required />
          <button type="submit">Subir Foto</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Admin;

