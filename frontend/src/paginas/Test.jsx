import listaDeRolesPermitidos from "../modelos/enums/RolesUsuario";
import listaDeSexosPermitidos from "../modelos/enums/Sexos";
import listaDeTiposDiscapacidad from "../modelos/enums/TiposDiscapacidad";
import listaDeTiposDocumentoPermitidos from "../modelos/enums/TiposDocumento";
import listaDeTiposIngresoPermitidos from "../modelos/enums/TiposIngreso";
import listaDeTiposRelacionPermitidos from "../modelos/enums/TiposRelacion";
import listaDeModalidadesPermitidas from "../modelos/enums/Modalidad";

function Test() {
    return (
        <div className="page test">
            <h2>Test para los enums</h2>
            <p>Este es un test para validar los enums de la base de datos.</p>
            <h3>Roles de usuario permitidos</h3>
            <ul>
                {listaDeRolesPermitidos.map(r => <li key={r}>{r}</li>)}
            </ul>
            <h3>Sexos permitidos</h3>
            <ul>
                {listaDeSexosPermitidos.map(s => <li key={s}>{s}</li>)}
            </ul>
            <h3>Tipos de documento permitidos</h3>
            <ul>
                {listaDeTiposDocumentoPermitidos.map(t => <li key={t}>{t}</li>)}
            </ul>
            <h3>Tipos de discapacidad permitidos</h3>
            <ul>
                {listaDeTiposDiscapacidad.map(t => <li key={t}>{t}</li>)}
            </ul>           
            <h3>Tipos de ingreso permitidos</h3>
            <ul>
                {listaDeTiposIngresoPermitidos.map(t => <li key={t}>{t}</li>)}
            </ul>
            
            <h3>Tipos de relación permitidos</h3>
            <ul>
                {listaDeTiposRelacionPermitidos.map(t => <li key={t}>{t}</li>)}
            </ul>
            <h3>Modalidades permitidas</h3>
            <ul>
                {listaDeModalidadesPermitidas.map(m => <li key={m}>{m}</li>)}
            </ul>
        </div>
    );
}

export default Test;