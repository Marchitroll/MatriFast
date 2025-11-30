/**
 * Servicio para interactuar con la API de Google Gemini
 * Implementa patrones de encapsulación y manejo de errores robusto
 */
import logger from './Logger.js';

// Clases de error específicas
export class GeminiConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeminiConfigurationError';
  }
}

export class GeminiAPIError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'GeminiAPIError';
    this.status = status;
    this.details = details;
  }
}

export class GeminiNetworkError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'GeminiNetworkError';
    this.originalError = originalError;
  }
}

// Prompt del sistema para el chatbot
const SYSTEM_PROMPT = `
Eres un asistente de IA especializado en la Ficha Única de Matrícula del sistema educativo de Perú. Tu misión principal es guiar a los usuarios (padres, madres, apoderados o estudiantes) para que comprendan y completen correctamente este formulario. Debes comunicarte siempre en español, con un tono amable, claro y servicial.

También eres un asistente virtual para MatriFast, un sistema de gestión de matrículas escolares.

**Información Clave del Formulario:**
* La Ficha Única de Matrícula recopila la información mínima y necesaria para el proceso de registro en una institución educativa.
* El formulario completo y oficial se descarga desde la plataforma SIAGIE.
* Los campos con asterisco (*) no son obligatorios.

**Tu función es ayudar con:**
- Información sobre el proceso de matrícula y la Ficha Única de Matrícula
- Resolución de dudas sobre el registro de usuarios
- Explicación detallada de los campos de los formularios
- Guía sobre cómo usar el sistema MatriFast
- Información general sobre procedimientos académicos

**IMPORTANTE - FORMATO DE RESPUESTA:**
- NUNCA uses formato Markdown
- NO uses asteriscos, guiones, almohadillas ni símbolos de formato
- Usa únicamente texto plano, separando ideas con saltos de línea

Siempre responde en español y mantén un tono formal pero cercano.`;

// Configuración de seguridad para la API
const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
];

// Mensajes de error amigables
const ERROR_MESSAGES = {
  notConfigured: 'Lo siento, el sistema no está configurado correctamente. Por favor, contacta al administrador.',
  authError: 'Lo siento, hay un problema de autenticación. Por favor, contacta al administrador del sistema.',
  permissionDenied: 'Lo siento, no tienes permisos para usar este servicio.',
  quotaExceeded: 'Lo siento, hemos recibido demasiadas solicitudes. Por favor, espera un momento.',
  serverError: 'Lo siento, el servicio no está disponible temporalmente. Por favor, intenta más tarde.',
  networkError: 'Parece que hay un problema de conexión. Por favor, verifica tu conexión a internet.',
  generic: 'Lo siento, ocurrió un error inesperado. ¿Podrías intentar reformular tu pregunta?',
  safetyBlocked: 'Lo siento, no puedo responder a esa pregunta por razones de seguridad.'
};

class GeminiService {
  #baseUrl;
  #config;
  #state;

  constructor(config = {}) {
    this.#config = {
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
      maxHistoryMessages: 10,
      ...config
    };

    this.#baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.#config.model}:generateContent`;
    this.#resetState();
    
    logger.info('GeminiService inicializado', { sessionId: this.#state.sessionId });
  }

  // Métodos privados auxiliares
  #resetState() {
    this.#state = {
      messageCount: 0,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date(),
      lastMessageTime: null
    };
  }

  #getApiKey() {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }

  #isApiKeyValid(apiKey) {
    return apiKey && apiKey !== 'your_gemini_api_key_here';
  }

  #buildContext(conversationHistory) {
    const recentHistory = conversationHistory.slice(-this.#config.maxHistoryMessages);
    const historyText = recentHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    return `${SYSTEM_PROMPT}${historyText ? `\n${historyText}` : ''}`;
  }

  #buildRequestBody(message, conversationHistory) {
    return {
      contents: [{
        parts: [{
          text: `${this.#buildContext(conversationHistory)}\n\nUsuario: ${message}\n\nAsistente:`
        }]
      }],
      generationConfig: {
        temperature: this.#config.temperature,
        topK: this.#config.topK,
        topP: this.#config.topP,
        maxOutputTokens: this.#config.maxOutputTokens,
        stopSequences: []
      },
      safetySettings: SAFETY_SETTINGS
    };
  }

  #extractResponseText(data) {
    const candidate = data.candidates?.[0];
    if (!candidate) return null;

    if (candidate.finishReason === 'SAFETY') {
      return ERROR_MESSAGES.safetyBlocked;
    }

    return candidate.content?.parts?.[0]?.text || null;
  }

  #handleHttpError(status, errorText) {
    const errorMap = {
      401: () => new GeminiConfigurationError('API key de Gemini inválida o expirada'),
      403: () => new GeminiConfigurationError('Acceso denegado a la API de Gemini'),
      429: () => new GeminiAPIError('Límite de cuota excedido', status, errorText),
    };

    if (errorMap[status]) return errorMap[status]();
    if (status >= 500) return new GeminiAPIError('Error interno del servidor', status, errorText);
    return new GeminiAPIError(`Error en la API: ${status}`, status, errorText);
  }

  // Métodos públicos
  get sessionId() { return this.#state.sessionId; }
  get messageCount() { return this.#state.messageCount; }
  get sessionDuration() { return new Date() - this.#state.startTime; }

  resetSession() {
    this.#resetState();
    logger.info('Sesión reiniciada', { sessionId: this.#state.sessionId });
  }

  async sendMessage(message, conversationHistory = []) {
    const trimmedMessage = message?.trim();
    if (!trimmedMessage) {
      throw new Error('El mensaje debe ser una cadena de texto no vacía');
    }

    const apiKey = this.#getApiKey();
    if (!this.#isApiKeyValid(apiKey)) {
      throw new GeminiConfigurationError('API key de Gemini no configurada correctamente');
    }

    this.#state.messageCount++;
    this.#state.lastMessageTime = new Date();

    try {
      const response = await fetch(`${this.#baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.#buildRequestBody(trimmedMessage, conversationHistory))
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw this.#handleHttpError(response.status, errorText);
      }

      const data = await response.json();
      const responseText = this.#extractResponseText(data);
      
      if (!responseText) {
        throw new GeminiAPIError('Respuesta inesperada de la API');
      }

      return responseText;
    } catch (error) {
      if (error instanceof GeminiConfigurationError || error instanceof GeminiAPIError) {
        throw error;
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new GeminiNetworkError('Error de conexión con la API', error);
      }
      
      throw new GeminiAPIError('Error inesperado', null, error.message);
    }
  }

  getErrorResponse(error) {
    if (error instanceof GeminiConfigurationError) return ERROR_MESSAGES.notConfigured;
    if (error instanceof GeminiNetworkError) return ERROR_MESSAGES.networkError;
    
    if (error instanceof GeminiAPIError) {
      const statusMessages = {
        400: 'Lo siento, hubo un problema con tu solicitud.',
        401: ERROR_MESSAGES.authError,
        403: ERROR_MESSAGES.permissionDenied,
        429: ERROR_MESSAGES.quotaExceeded
      };
      if (error.status >= 500) return ERROR_MESSAGES.serverError;
      return statusMessages[error.status] || ERROR_MESSAGES.generic;
    }
    
    return ERROR_MESSAGES.generic;
  }

  getHealthStatus() {
    const apiKey = this.#getApiKey();
    return {
      isConfigured: this.#isApiKeyValid(apiKey),
      model: this.#config.model,
      sessionId: this.#state.sessionId,
      uptime: this.sessionDuration
    };
  }
}

export default GeminiService;
