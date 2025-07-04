import { useEffect } from 'react';
import { HashRouter, Link, Routes, Route } from "react-router-dom";
import enumService from './servicios/EnumService.js';

import Home from "./paginas/Home";
import Login from "./paginas/Login";
import Register from "./paginas/Register";
import Formulario from "./paginas/Formulario";
import Test from "./paginas/Test";
import Perfil from './paginas/Perfil.jsx';
import Chatbot from './componentes/Chatbot.jsx';

export default function App() {
    useEffect(() => {
        // Iniciar la precarga de enumeraciones en segundo plano
        enumService.preloadAll().then(() => {
            console.log('Enumeraciones precargadas exitosamente');
        }).catch((error) => {
            console.warn('Error durante la precarga de enumeraciones:', error);
        });
    }, []);
    return (
        <HashRouter>
            <nav>
                <h1>Matrifast</h1>
                <Link to="/">Inicio</Link>
                <Link to="/login">Iniciar Sesión</Link>
                <Link to="/register">Registrar</Link>
                <Link to="/formulario">Matrícula</Link>
                <Link to="/perfil">Editar Perfil</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/formulario" element={<Formulario />} />
                <Route path="/test" element={<Test />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </Routes>
            <Chatbot />
        </HashRouter>
    )
}