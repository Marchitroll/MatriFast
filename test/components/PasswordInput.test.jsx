import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from '../../src/components/common/PasswordInput';

describe('PasswordInput', () => {
  const defaultProps = {
    label: 'Contraseña',
    id: 'password',
    value: 'secret123',
    onChange: vi.fn()
  };

  describe('renderizado', () => {
    it('debería renderizar el label correctamente', () => {
      render(<PasswordInput {...defaultProps} />);
      expect(screen.getByText('Contraseña')).toBeInTheDocument();
    });

    it('debería renderizar el input con type password por defecto', () => {
      render(<PasswordInput {...defaultProps} />);
      const input = screen.getByLabelText('Contraseña');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('debería mostrar el valor proporcionado', () => {
      render(<PasswordInput {...defaultProps} />);
      const input = screen.getByLabelText('Contraseña');
      expect(input).toHaveValue('secret123');
    });

    it('debería renderizar el botón de toggle', () => {
      render(<PasswordInput {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('debería mostrar icono de ojo cerrado inicialmente', () => {
      render(<PasswordInput {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveTextContent('👁️');
    });
  });

  describe('toggle de visibilidad', () => {
    it('debería cambiar a type text al hacer click en toggle', () => {
      render(<PasswordInput {...defaultProps} />);
      
      const toggleBtn = screen.getByRole('button');
      fireEvent.click(toggleBtn);
      
      const input = screen.getByLabelText('Contraseña');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('debería cambiar el icono al mostrar contraseña', () => {
      render(<PasswordInput {...defaultProps} />);
      
      const toggleBtn = screen.getByRole('button');
      fireEvent.click(toggleBtn);
      
      expect(toggleBtn).toHaveTextContent('🙈');
    });

    it('debería volver a ocultar al hacer click nuevamente', () => {
      render(<PasswordInput {...defaultProps} />);
      
      const toggleBtn = screen.getByRole('button');
      fireEvent.click(toggleBtn);
      fireEvent.click(toggleBtn);
      
      const input = screen.getByLabelText('Contraseña');
      expect(input).toHaveAttribute('type', 'password');
      expect(toggleBtn).toHaveTextContent('👁️');
    });

    it('debería tener título descriptivo para mostrar', () => {
      render(<PasswordInput {...defaultProps} />);
      
      const toggleBtn = screen.getByRole('button');
      expect(toggleBtn).toHaveAttribute('title', 'Mostrar contraseña');
    });

    it('debería tener título descriptivo para ocultar', () => {
      render(<PasswordInput {...defaultProps} />);
      
      const toggleBtn = screen.getByRole('button');
      fireEvent.click(toggleBtn);
      
      expect(toggleBtn).toHaveAttribute('title', 'Ocultar contraseña');
    });
  });

  describe('props', () => {
    it('debería ser required cuando se especifica', () => {
      render(<PasswordInput {...defaultProps} required={true} />);
      const input = screen.getByLabelText('Contraseña');
      expect(input).toBeRequired();
    });

    it('debería no ser required por defecto', () => {
      render(<PasswordInput {...defaultProps} />);
      const input = screen.getByLabelText('Contraseña');
      expect(input).not.toBeRequired();
    });

    it('debería deshabilitar input cuando disabled es true', () => {
      render(<PasswordInput {...defaultProps} disabled={true} />);
      const input = screen.getByLabelText('Contraseña');
      expect(input).toBeDisabled();
    });

    it('debería deshabilitar botón toggle cuando disabled es true', () => {
      render(<PasswordInput {...defaultProps} disabled={true} />);
      const toggleBtn = screen.getByRole('button');
      expect(toggleBtn).toBeDisabled();
    });

    it('debería llamar onChange cuando se escribe', () => {
      const handleChange = vi.fn();
      render(<PasswordInput {...defaultProps} onChange={handleChange} value="" />);
      
      const input = screen.getByLabelText('Contraseña');
      fireEvent.change(input, { target: { value: 'newpass' } });
      
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('accesibilidad', () => {
    it('debería asociar label con input mediante htmlFor', () => {
      render(<PasswordInput {...defaultProps} id="test-password" />);
      const input = screen.getByLabelText('Contraseña');
      expect(input).toHaveAttribute('id', 'test-password');
    });

    it('el botón toggle debería ser type button (no submit)', () => {
      render(<PasswordInput {...defaultProps} />);
      const toggleBtn = screen.getByRole('button');
      expect(toggleBtn).toHaveAttribute('type', 'button');
    });
  });
});
