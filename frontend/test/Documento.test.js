import { describe, it, expect } from 'vitest'
import Documento from '../src/modelos/Documento.js'

describe('Documento', () => {
  describe('Constructor', () => {
    it('debería crear un documento válido con tipo DNI', () => {
      const documento = new Documento('DNI', '12345678')
      expect(documento.tipo).toBe('DNI')
      expect(documento.numero).toBe('12345678')
    })

    it('debería lanzar error si el tipo es null', () => {
      expect(() => {
        new Documento(null, '12345678')
      }).toThrow('El tipo de documento no puede ser nulo o indefinido')
    })
  })
})
