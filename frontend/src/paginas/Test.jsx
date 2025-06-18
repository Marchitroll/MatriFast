import { useState, useEffect } from 'react';
import { getRolesUsuario, defaultValues as rolesDefault } from "../modelos/enums/RolesUsuario.js";
import { getSexos, defaultValues as sexosDefault } from "../modelos/enums/Sexos.js";
import { getTiposDocumento, defaultValues as tiposDocumentoDefault } from "../modelos/enums/TiposDocumento.js";
import { getTiposRelacion, defaultValues as tiposRelacionDefault } from "../modelos/enums/TiposRelacion.js";
import { getModalidades, defaultValues as modalidadesDefault } from "../modelos/enums/Modalidad.js";

function Test() {
    const [roles, setRoles] = useState(rolesDefault);
    const [sexos, setSexos] = useState(sexosDefault);
    const [tiposDocumento, setTiposDocumento] = useState(tiposDocumentoDefault);
    const [tiposRelacion, setTiposRelacion] = useState(tiposRelacionDefault);
    const [modalidades, setModalidades] = useState(modalidadesDefault);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarEnums = async () => {
            try {
                const [rolesData, sexosData, tiposDoc, tiposRel, modalidadesData] = await Promise.all([
                    getRolesUsuario(),
                    getSexos(),
                    getTiposDocumento(),
                    getTiposRelacion(),
                    getModalidades()
                ]);
                
                setRoles(rolesData);
                setSexos(sexosData);
                setTiposDocumento(tiposDoc);
                setTiposRelacion(tiposRel);
                setModalidades(modalidadesData);
            } catch (err) {
                setError(err.message);
                console.error('Error cargando enumeraciones:', err);
            } finally {
                setLoading(false);
            }
        };

        cargarEnums();
    }, []);    if (loading) {
        return (
            <div className="page test">
                <h2>Test para los enums</h2>
                <p>Cargando enumeraciones...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page test">
                <h2>Test para los enums</h2>
                <p>Error al cargar enumeraciones: {error}</p>
                <p>Mostrando valores por defecto...</p>
            </div>
        );
    }

    return (
        <div className="page test">
            <h2>Test para los enums</h2>
            <p>Este es un test para validar los enums de la base de datos.</p>
            <h3>Roles de usuario permitidos</h3>
            <ul>
                {roles.map(r => <li key={r}>{r}</li>)}
            </ul>
            <h3>Sexos permitidos</h3>
            <ul>
                {sexos.map(s => <li key={s}>{s}</li>)}
            </ul>
            <h3>Tipos de documento permitidos</h3>
            <ul>
                {tiposDocumento.map(t => <li key={t}>{t}</li>)}
            </ul>           
            <h3>Tipos de relación permitidos</h3>
            <ul>
                {tiposRelacion.map(t => <li key={t}>{t}</li>)}
            </ul>
            <h3>Modalidades permitidas</h3>
            <ul>
                {modalidades.map(m => <li key={m}>{m}</li>)}
            </ul>
        </div>
    );
}

export default Test;