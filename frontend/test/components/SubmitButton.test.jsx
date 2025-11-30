import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SubmitButton from '../../src/components/common/SubmitButton';

describe('SubmitButton', () => {
  describe('renderizado', () => {
    it('debería renderizar el texto del botón', () => {
      render(<SubmitButton defaultText="Enviar" />);
      expect(screen.getByRole('button')).toHaveTextContent('Enviar');
    });

    it('debería ser de type submit por defecto', () => {
      render(<SubmitButton defaultText="Enviar" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('estado loading', () => {
    it('debería mostrar texto de loading cuando isLoading es true', () => {
      render(<SubmitButton defaultText="Enviar" isLoading={true} loadingText="Cargando..." />);
      expect(screen.getByRole('button')).toHaveTextContent('Cargando...');
    });

    it('debería deshabilitar botón cuando isLoading es true', () => {
      render(<SubmitButton defaultText="Enviar" isLoading={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('debería mostrar texto normal cuando isLoading es false', () => {
      render(<SubmitButton defaultText="Guardar" isLoading={false} loadingText="Guardando..." />);
      expect(screen.getByRole('button')).toHaveTextContent('Guardar');
    });
  });

  describe('estado disabled', () => {
    it('debería estar habilitado por defecto', () => {
      render(<SubmitButton defaultText="Enviar" />);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});
