import { useEffect } from 'react';
import { HashRouter, Link, Routes, Route } from "react-router-dom";
import { enumService } from './services';
import { Home, Login, Register, Formulario, Perfil } from './pages';
import { Chatbot } from './components';

export default function App() {
    useEffect(() => {
        enumService.preloadAll()
            .then(() => console.log('Enumeraciones precargadas'))
            .catch(error => console.warn('Error precargando enumeraciones:', error));
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
                <Route path="/perfil" element={<Perfil />} />
                <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
            </Routes>
            <Chatbot />
        </HashRouter>
    );
}