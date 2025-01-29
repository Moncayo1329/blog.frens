import { useState } from "react";
import axios from "axios";
import "./App.css";

function Admin() {
  // Estados para el título y la imagen
  const [titulo, setTitulo] = useState("");
  const [foto, setFoto] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // Manejar cambio en el título
  const handleTituloChange = (e) => {
    setTitulo(e.target.value);
  };

  // Manejar cambio en la imagen
  const handleFotoChange = (e) => {
    setFoto(e.target.files[0]); // Tomamos solo el primer archivo seleccionado
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar recarga de la página

    if (!titulo || !foto) {
      setMensaje("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("foto", foto);

    try {
      const response = await axios.post("http://localhost:5000/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMensaje("Foto subida con éxito");
    } catch (error) {
      setMensaje("Error al subir la foto");
    }
  };

  return (
    <div className="App">
      <h1>Subir una nueva entrada</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          name="titulo"
          value={titulo}
          onChange={handleTituloChange}
          required
        />
        <br />
        <br />

        <label htmlFor="foto">Selecciona una imagen:</label>
        <input type="file" name="foto" onChange={handleFotoChange} required />
        <br />
        <br />

        <button type="submit">Subir</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Admin;

