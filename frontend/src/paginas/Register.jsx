import React, { useState } from 'react';

function Register() {
  // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
      id: '',
      nombres: '',
      aPaterno: '',
      aMaterno: '',
      fechaNacimiento: '',
      sexo: '',
      documento: '',
      email: '',
      rol: '',
      domicilio: '',
      codigoUbigeo: '',
      viveConNNA: '',
      telefono: '',
      correo: ''
    });
  
    // Manejador para actualizar el estado cuando el usuario cambia los campos
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    // Manejador para el envío del formulario
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Datos enviados: ", formData);
      // Aquí podrías hacer una llamada a la API o procesar los datos
    };

  return (
    <div className="page register">
      <h2>Registrar Nuevo Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Apellido Paterno:</label>
          <input
            type="text"
            name="aPaterno"
            value={formData.aPaterno}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Apellido Materno:</label>
          <input
            type="text"
            name="aMaterno"
            value={formData.aMaterno}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Nombres:</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Sexo:</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        <div>
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Documento de Identidad:</label>
          <input
            type="text"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Rol:</label>
          <input
            type="text"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Domicilio:</label>
          <input
            type="text"
            name="domicilio"
            value={formData.domicilio}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Código de Ubigeo:</label>
          <input
            type="text"
            name="codigoUbigeo"
            value={formData.codigoUbigeo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>¿Vive con el NNA?:</label>
          <select
            name="viveConNNA"
            value={formData.viveConNNA}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label>Teléfono Celular:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
export default Register;