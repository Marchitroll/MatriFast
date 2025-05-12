import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

import Home from "./paginas/Home";
import Login from "./paginas/Login";
import Register from "./paginas/Register";
import Formulario from "./paginas/Formulario";

export default function App() {
    return (
        <BrowserRouter>
            <nav>
                <h1>Matrifast</h1>
                <Link to="/">Inicio</Link>
                <Link to="/login">Iniciar Sesión</Link>
                <Link to="/register">Registrar</Link>
                <Link to="/formulario">Matrícula</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/formulario" element={<Formulario />} />
            </Routes>
        </BrowserRouter>
    )
}