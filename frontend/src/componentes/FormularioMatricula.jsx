// src/componentes/FormularioMatricula.jsx
import { useState } from 'react';
import AuthFormField from './AuthFormField';
import AuthSubmitButton from './AuthSubmitButton';

function FormularioMatricula() {
    const [formData, setFormData] = useState({});

    const handleChange = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos de matrícula:', formData);
        // Aquí puedes enviar los datos a Supabase
    };

    return (
        <form className="matricula-form" onSubmit={handleSubmit}>
            <div className="formulario-campos">
                <h3>Datos del Servicio Educativo</h3>
                <div classname="campo">
                    
                        <AuthFormField label="Nombre del Servicio Educativo" type="text" id="nombreServicio" value={formData.nombreServicio || ''} onChange={e => handleChange('nombreServicio', e.target.value)} />
                   
                </div>
                <AuthFormField label="Resolución de creación" type="text" id="resolucionCreacion" value={formData.resolucionCreacion || ''} onChange={e => handleChange('resolucionCreacion', e.target.value)} />
                <AuthFormField label="Código de IE" type="text" id="codigoIE" value={formData.codigoIE || ''} onChange={e => handleChange('codigoIE', e.target.value)} />
                <AuthFormField label="Código Modular" type="text" id="codigoModular" value={formData.codigoModular || ''} onChange={e => handleChange('codigoModular', e.target.value)} />

                <h3>Datos del Estudiante</h3>
                <AuthFormField label="Apellido Paterno" type="text" id="aPaterno" value={formData.aPaterno || ''} onChange={e => handleChange('aPaterno', e.target.value)} />
                <AuthFormField label="Apellido Materno" type="text" id="aMaterno" value={formData.aMaterno || ''} onChange={e => handleChange('aMaterno', e.target.value)} />
                <AuthFormField label="Nombre(s)" type="text" id="nombres" value={formData.nombres || ''} onChange={e => handleChange('nombres', e.target.value)} />
                <AuthFormField label="Sexo" type="text" id="sexo" value={formData.sexo || ''} onChange={e => handleChange('sexo', e.target.value)} />
                <AuthFormField label="Fecha de Nacimiento" type="date" id="fechaNacimiento" value={formData.fechaNacimiento || ''} onChange={e => handleChange('fechaNacimiento', e.target.value)} />
                <AuthFormField label="Lugar de Nacimiento (Dep/Prov/Dist)" type="text" id="lugarNacimiento" value={formData.lugarNacimiento || ''} onChange={e => handleChange('lugarNacimiento', e.target.value)} />
                <AuthFormField label="Código UBIGEO de Nacimiento" type="text" id="ubigeoNacimiento" value={formData.ubigeoNacimiento || ''} onChange={e => handleChange('ubigeoNacimiento', e.target.value)} />
                <AuthFormField label="Tipo de Documento" type="text" id="tipoDocumento" value={formData.tipoDocumento || ''} onChange={e => handleChange('tipoDocumento', e.target.value)} />
                <AuthFormField label="Número de Documento" type="text" id="numeroDocumento" value={formData.numeroDocumento || ''} onChange={e => handleChange('numeroDocumento', e.target.value)} />
                <AuthFormField label="Lengua Materna" type="text" id="lenguaMaterna" value={formData.lenguaMaterna || ''} onChange={e => handleChange('lenguaMaterna', e.target.value)} />
                <AuthFormField label="Segunda Lengua (opcional)" type="text" id="segundaLengua" value={formData.segundaLengua || ''} onChange={e => handleChange('segundaLengua', e.target.value)} />

                <h3>Domicilio Actual</h3>
                <AuthFormField label="Dirección" type="text" id="direccion" value={formData.direccion || ''} onChange={e => handleChange('direccion', e.target.value)} />
                <AuthFormField label="Código UBIGEO" type="text" id="ubigeoDireccion" value={formData.ubigeoDireccion || ''} onChange={e => handleChange('ubigeoDireccion', e.target.value)} />
                <AuthFormField label="¿Tiene dispositivos electrónicos?" type="text" id="dispositivos" value={formData.dispositivos || ''} onChange={e => handleChange('dispositivos', e.target.value)} />
                <AuthFormField label="¿Tiene acceso a Internet?" type="text" id="internet" value={formData.internet || ''} onChange={e => handleChange('internet', e.target.value)} />

                <h3>Servicio Educativo Solicitado</h3>
                <AuthFormField label="Ingreso" type="text" id="ingreso" value={formData.ingreso || ''} onChange={e => handleChange('ingreso', e.target.value)} />
                <AuthFormField label="Modalidad" type="text" id="modalidad" value={formData.modalidad || ''} onChange={e => handleChange('modalidad', e.target.value)} />
                <AuthFormField label="Nivel" type="text" id="nivel" value={formData.nivel || ''} onChange={e => handleChange('nivel', e.target.value)} />
                <AuthFormField label="Ciclo" type="text" id="ciclo" value={formData.ciclo || ''} onChange={e => handleChange('ciclo', e.target.value)} />
                <AuthFormField label="Grado/Edad" type="text" id="gradoEdad" value={formData.gradoEdad || ''} onChange={e => handleChange('gradoEdad', e.target.value)} />
            </div>
            <AuthSubmitButton
                isLoading={false}
                loadingText="Guardando..."
                defaultText="Enviar Matrícula"
            />
        </form>
    );
}

export default FormularioMatricula;