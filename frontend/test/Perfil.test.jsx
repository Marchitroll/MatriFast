import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Perfil from '../src/paginas/Perfil';

// Mock del contexto de autenticación
vi.mock('../src/funcionalidad/AuthContext', async () => {
  const actual = await vi.importActual('../src/funcionalidad/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      session: true,
      obtenerUsuarioActual: vi.fn().mockResolvedValue({
        id: 1,
        nombres: 'Pedro',
        aPaterno: 'Gómez',
        aMaterno: 'Torres',
        fechaNacimiento: '1990-01-01',
        sexo: 'MASCULINO',
        tipoDocumento: 'DNI',
        numeroDocumento: '12345678',
        role: 'DOCENTE',
      }),
    }),
  };
});

// Mock del componente AuthSubmitButton si es necesario
vi.mock('../src/componentes/AuthSubmitButton.jsx', () => ({
  default: () => <button>Guardar</button>,
}));

// Mock del componente DocenteFields
vi.mock('../src/componentes/DocenteFields.jsx', () => ({
  default: ({ formData }) => (
    <div>
      <input name="nombres" defaultValue={formData.nombres} />
      <input name="aPaterno" defaultValue={formData.aPaterno} />
    </div>
  ),
}));

// Mock del componente RepresentanteLegalFields
vi.mock('../src/componentes/RepresentanteLegalFields.jsx', () => ({
  default: () => <div />,
}));

describe('Perfil', () => {
  it('renderiza correctamente y muestra nombre del usuario', async () => {
    render(
      <MemoryRouter>
        <Perfil />
      </MemoryRouter>
    );

    // Esperamos a que desaparezca "Cargando datos..." y aparezcan los inputs con valores
    await waitFor(() => {
      expect(screen.getByText(/Mi Perfil/i)).toBeInTheDocument();
    });

    // Verificamos que el nombre se haya cargado correctamente
    expect(screen.getByDisplayValue('Pedro')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Gómez')).toBeInTheDocument();
  });
});
