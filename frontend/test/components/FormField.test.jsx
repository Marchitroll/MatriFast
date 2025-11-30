import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FormField from '../../src/components/common/FormField';

describe('FormField', () => {
  const defaultProps = {
    label: 'Nombre',
    type: 'text',
    id: 'nombre',
    value: '',
    onChange: vi.fn()
  };

  describe('renderizado', () => {
    it('debería renderizar el label', () => {
      render(<FormField {...defaultProps} />);
      expect(screen.getByText('Nombre')).toBeInTheDocument();
    });

    it('debería renderizar input con type correcto', () => {
      render(<FormField {...defaultProps} type="email" />);
      const input = screen.getByLabelText('Nombre');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('debería renderizar input con id correcto', () => {
      render(<FormField {...defaultProps} id="test-id" />);
      const input = screen.getByLabelText('Nombre');
      expect(input).toHaveAttribute('id', 'test-id');
    });

    it('debería mostrar el valor proporcionado', () => {
      render(<FormField {...defaultProps} value="Juan" />);
      const input = screen.getByLabelText('Nombre');
      expect(input).toHaveValue('Juan');
    });
  });

  describe('tipos de input', () => {
    it('debería soportar type text', () => {
      render(<FormField {...defaultProps} type="text" />);
      expect(screen.getByLabelText('Nombre')).toHaveAttribute('type', 'text');
    });

    it('debería soportar type email', () => {
      render(<FormField {...defaultProps} type="email" />);
      expect(screen.getByLabelText('Nombre')).toHaveAttribute('type', 'email');
    });

    it('debería soportar type date', () => {
      render(<FormField {...defaultProps} type="date" />);
      expect(screen.getByLabelText('Nombre')).toHaveAttribute('type', 'date');
    });

    it('debería soportar type number', () => {
      render(<FormField {...defaultProps} type="number" />);
      expect(screen.getByLabelText('Nombre')).toHaveAttribute('type', 'number');
    });
  });

  describe('props', () => {
    it('debería ser required cuando se especifica', () => {
      render(<FormField {...defaultProps} required={true} />);
      expect(screen.getByLabelText('Nombre')).toBeRequired();
    });

    it('debería no ser required por defecto', () => {
      render(<FormField {...defaultProps} />);
      expect(screen.getByLabelText('Nombre')).not.toBeRequired();
    });

    it('debería estar disabled cuando se especifica', () => {
      render(<FormField {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Nombre')).toBeDisabled();
    });

    it('debería no estar disabled por defecto', () => {
      render(<FormField {...defaultProps} />);
      expect(screen.getByLabelText('Nombre')).not.toBeDisabled();
    });
  });

  describe('eventos', () => {
    it('debería llamar onChange al escribir', () => {
      const handleChange = vi.fn();
      render(<FormField {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByLabelText('Nombre');
      fireEvent.change(input, { target: { value: 'Nuevo valor' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('debería pasar el evento completo a onChange', () => {
      const handleChange = vi.fn();
      render(<FormField {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByLabelText('Nombre');
      fireEvent.change(input, { target: { value: 'Test' } });
      
      // Verificamos que onChange fue llamado con un evento
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange.mock.calls[0][0]).toHaveProperty('target');
    });
  });

  describe('accesibilidad', () => {
    it('debería asociar label con input', () => {
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Nombre');
      expect(input).toBeInTheDocument();
    });
  });
});
