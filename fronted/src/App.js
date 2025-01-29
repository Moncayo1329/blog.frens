import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./admin"; // Asegúrate de haber creado Admin.js
import Home from "./Home"; // Puedes crear Home.js si quieres una página principal

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
