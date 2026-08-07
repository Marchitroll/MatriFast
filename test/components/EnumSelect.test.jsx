import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EnumSelect from '../../src/components/common/EnumSelect';

describe('EnumSelect', () => {
  const defaultProps = {
    label: 'Tipo',
    id: 'tipo-select',
    value: '',
    onChange: vi.fn(),
    options: ['Opción 1', 'Opción 2', 'Opción 3'],
    placeholder: 'Seleccione una opción'
  };

  describe('renderizado', () => {
    it('debería renderizar el label', () => {
      render(<EnumSelect {...defaultProps} />);
      expect(screen.getByText('Tipo')).toBeInTheDocument();
    });

    it('debería renderizar el select', () => {
      render(<EnumSelect {...defaultProps} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('debería renderizar el placeholder como primera opción', () => {
      render(<EnumSelect {...defaultProps} />);
      expect(screen.getByText('Seleccione una opción')).toBeInTheDocument();
    });

    it('debería renderizar todas las opciones', () => {
      render(<EnumSelect {...defaultProps} />);
      
      expect(screen.getByText('Opción 1')).toBeInTheDocument();
      expect(screen.getByText('Opción 2')).toBeInTheDocument();
      expect(screen.getByText('Opción 3')).toBeInTheDocument();
    });

    it('debería tener el valor seleccionado', () => {
      render(<EnumSelect {...defaultProps} value="Opción 2" />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('Opción 2');
    });
  });

  describe('estados', () => {
    it('debería mostrar "Cargando..." cuando loading es true', () => {
      render(<EnumSelect {...defaultProps} loading={true} />);
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('debería deshabilitar select cuando loading es true', () => {
      render(<EnumSelect {...defaultProps} loading={true} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('debería deshabilitar select cuando disabled es true', () => {
      render(<EnumSelect {...defaultProps} disabled={true} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('debería ser required cuando se especifica', () => {
      render(<EnumSelect {...defaultProps} required={true} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeRequired();
    });
  });

  describe('lista vacía', () => {
    it('debería manejar options vacío', () => {
      render(<EnumSelect {...defaultProps} options={[]} />);
      const select = screen.getByRole('combobox');
      // Solo debería tener la opción placeholder
      expect(select.querySelectorAll('option')).toHaveLength(1);
    });
  });
});
