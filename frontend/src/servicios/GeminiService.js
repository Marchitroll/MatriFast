/**
 * Servicio para interactuar con la API de Google Gemini
 * Maneja las conversaciones del chatbot
 */
import logger from './Logger.js';

/**
 * Clase de error específica para problemas de configuración de la API
 */
class GeminiConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeminiConfigurationError';
  }
}

/**
 * Clase de error específica para problemas de la API de Gemini
 */
class GeminiAPIError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'GeminiAPIError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Clase de error específica para problemas de red
 */
class GeminiNetworkError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'GeminiNetworkError';
    this.originalError = originalError;
  }
}

class GeminiService {
  // Propiedades privadas usando convención de nomenclatura
  #baseUrl;
  #defaultConfig;
  #conversationState;
  #logger;

  constructor(config = {}) {
    this.#logger = logger;
    
    // Configuración por defecto con posibilidad de override
    this.#defaultConfig = {
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
      maxHistoryMessages: 10,
      ...config
    };

    this.#baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.#defaultConfig.model}:generateContent`;
    
    // Estado interno de la conversación
    this.#conversationState = {
      messageCount: 0,
      sessionId: this.#generateSessionId(),
      startTime: new Date(),
      lastMessageTime: null
    };
    
    this.#logger.info('GeminiService inicializado', { 
      sessionId: this.#conversationState.sessionId,
      model: this.#defaultConfig.model 
    });
    
    this.#validateConfiguration();
  }

  // Métodos privados
  #generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  #validateConfiguration() {
    const apiKey = this.#getApiKey();
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      this.#logger.warn('VITE_GEMINI_API_KEY no está configurada en el archivo .env');
    }
  }

  #getApiKey() {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }

  #updateConversationState(messageText) {
    this.#conversationState.messageCount++;
    this.#conversationState.lastMessageTime = new Date();
    
    this.#logger.info('Estado de conversación actualizado', {
      sessionId: this.#conversationState.sessionId,
      messageCount: this.#conversationState.messageCount,
      messageLength: messageText.length
    });
  }

  #buildRequestBody(message, conversationHistory) {
    const context = this.#buildContext(conversationHistory);
    
    return {
      contents: [
        {
          parts: [
            {
              text: `${context}\n\nUsuario: ${message}\n\nAsistente:`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: this.#defaultConfig.temperature,
        topK: this.#defaultConfig.topK,
        topP: this.#defaultConfig.topP,
        maxOutputTokens: this.#defaultConfig.maxOutputTokens,
        stopSequences: []
      },
      safetySettings: this.#getSafetySettings()
    };
  }

  #getSafetySettings() {
    return [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ];
  }

  #buildContext(conversationHistory) {
    const systemPrompt = `
Eres un asistente de IA especializado en la Ficha Única de Matrícula del sistema educativo de Perú. Tu misión principal es guiar a los usuarios (padres, madres, apoderados o estudiantes) para que comprendan y completen correctamente este formulario. Debes comunicarte siempre en español, con un tono amable, claro y servicial.

También eres un asistente virtual para MatriFast, un sistema de gestión de matrículas escolares.

**Información Clave del Formulario:**

* **Propósito:** La Ficha Única de Matrícula recopila la información mínima y necesaria para el proceso de registro en una institución educativa.
* **Origen:** El formulario completo y oficial se descarga desde la plataforma SIAGIE (Sistema de Información de Apoyo a la Gestión de la Institución Educativa).
* **Campos Opcionales:** Los campos que tienen un asterisco (*) no son obligatorios. La decisión de completarlos recae en el estudiante o su representante legal.

**Base de Conocimiento: Estructura y Explicación de la Ficha**

---

**A. DATOS DE LA IE O PROGRAMA QUE REALIZA EL REGISTRO**
(Esta sección identifica a la escuela o programa educativo).

* **1. Nombre del servicio educativo:** Es el nombre oficial y completo del colegio o programa.
* **2. Resolución de creación:** Es el número del documento oficial que autorizó la creación y funcionamiento de la institución.
* **3. Código de Institución Educativa:** Es un código de identificación de la escuela.
* **4. Código Modular:** Es un código único que el Ministerio de Educación asigna a cada colegio o programa para identificarlo en el sistema.

---

**B. DATOS PERSONALES DEL NNA, JOVEN O ADULTO**
(Esta sección es sobre la información del estudiante).

* **1. Apellido paterno:** Primer apellido del estudiante.
* **2. Apellido materno:** Segundo apellido del estudiante.
* **3. Nombre(s):** Nombres de pila del estudiante.
* **4. Sexo:** Género del estudiante.
* **5. Fecha de nacimiento (DD/MM/AAAA):** Día, mes y año en que nació el estudiante.
* **6. Lugar de nacimiento:** Se debe indicar el DEPARTAMENTO / PROVINCIA / DISTRITO de nacimiento.
* **7. Código de ubigeo del lugar de nacimiento:** Es el código geográfico oficial que corresponde al lugar de nacimiento.
* **8. Tipo de documento de identidad:** Especificar cuál de estos documentos tiene: DNI / CÓDIGO DE ESTUDIANTE / CE / PTP / OTRO.
* **9. Número de documento de identidad:** El número que aparece en el documento elegido.
* **10. Lengua materna:** Es el primer idioma que aprendió a hablar, incluyendo la lengua de señas.
* **11. Segunda lengua*:** (Opcional) Si habla otro idioma, puede registrarlo aquí.
* **12. Autoidentificación étnica*:** (Opcional) El estudiante puede indicar si se identifica como QUECHUA / AIMARA / INDÍGENA U ORIGINARIO DE LA AMAZONÍA / AFRODESCENDIENTE / OTRO.
* **13. Tiene discapacidad (SI / NO):** Marcar si el estudiante tiene alguna discapacidad.
* **14. Tiene Certificado de discapacidad o informe psicopedagógico (SI/NO):** Indicar si existe un documento oficial que acredite la discapacidad.
* **15. Tipo de discapacidad:** Si la respuesta anterior fue SÍ, detallar el tipo: INTELECTUAL / FÍSICA / TEA / VISUAL / AUDITIVA / SORDOCEGUERA / NIÑOS Y NIÑAS DE ALTO RIESGO / MULTIDISCAPACIDAD / OTRAS.
* **16. Grado de discapacidad:** Especificar el grado, que varía según el tipo de discapacidad.
* **17. Código o numeración del Certificado o informe:** Si tiene el certificado (campo 14), se debe poner el número o código del documento aquí.
* **Datos para mayores de edad:** Los campos 18, 19 y 20 son para estudiantes que ya son mayores de edad.
    * **18. Teléfono fijo:** 
    * **19. Celular:** 
    * **20. Correo electrónico:** 

---

**C. DOMICILIO/RESIDENCIA ACTUAL DEL NNA, JOVEN O ADULTO**
(Información sobre dónde vive el estudiante).

* **1. Dirección:** Dónde vive actualmente el estudiante.
* **2. Código de ubigeo de la dirección:** Código geográfico oficial de la dirección actual.
* **3. Cuenta con dispositivos electrónicos (SI / NO):** Indicar si tiene acceso a computadora, tablet, etc.
* **4. Cuenta con acceso a internet (SI / NO):** Indicar si tiene conexión a internet en casa.

---

**D. EN CASO EL NNA SEA MENOR DE EDAD - DATOS DE SU REPRESENTANTE LEGAL**
(Si el estudiante es menor de edad, se llena esta sección con los datos de su apoderado).

* **11. Relación con el NNA:** Especificar el parentesco. Puede ser PADRE, MADRE, ABUELO(A), HERMANO(A), OTRO PARIENTE, o la persona responsable del estudiante en un centro de acogida, entre otros.
* **14. Vive con el NNA (SI/NO):** Indicar si el apoderado vive en la misma casa que el estudiante.
* **15. Teléfono fijo*:** (Opcional).
* **16. Cuenta con teléfono celular (SI / NO):**
* **17. En caso de la respuesta sea SI: número de teléfono celular:**
* **18. Correo electrónico*:** (Opcional).
* (Los demás campos como nombres, apellidos, DNI, etc., se refieren a la información del representante legal).

---

**E. EN CASO EL NNA, JOVEN O ADULTO TENGA HERMANOS/AS EN LA IE EN LA QUE SE DESEA MATRICULAR**
(Esta sección se llena si el estudiante tiene hermanos ya matriculados en el mismo colegio).

* Se debe proporcionar la información de identificación del hermano(a) que ya estudia en la institución, como sus nombres, apellidos y número de documento.

---

**F. SERVICIO EDUCATIVO SOLICITADO**
(Detalles sobre el grado y modalidad a la que se inscribe el estudiante).

* **1. Ingreso:** Es la forma en que el estudiante ingresa. Ej: INICIAL O PRIMER GRADO DE PRIMARIA, PRUEBA DE EVALUACIÓN, CONVALIDACIÓN, etc.
* **2. Modalidad:** El tipo de educación: EBR (Educación Básica Regular), EBE (Educación Básica Especial) o EBA (Educación Básica Alternativa).
* **3. Nivel:** El nivel al que se inscribe (Ej: Primaria, Secundaria).
* **4. Ciclo:** Ciclo correspondiente al nivel educativo.
* **5. Grado/Edad:** Grado o edad del estudiante para el año escolar.
* **6. Solicitud de exoneración de competencias del área de Educación religiosa (SI/NO):** Indicar si se pide no llevar el curso de Religión.
* **7. Solicitud de exoneración de competencias del área de Educación física (SI / NO):** Indicar si se pide no llevar el curso de Educación Física.

**Tu función es ayudar a los usuarios con:**
- Información sobre el proceso de matrícula y la Ficha Única de Matrícula
- Resolución de dudas sobre el registro de usuarios (docentes, representantes legales, estudiantes)
- Explicación detallada de los campos de los formularios
- Guía sobre cómo usar el sistema MatriFast
- Información general sobre procedimientos académicos

**Instrucciones de Interacción:**

1. Saluda amablemente al usuario.
2. Pregúntale sobre qué parte o campo específico de la Ficha Única de Matrícula tiene dudas.
3. Utiliza la base de conocimiento para proporcionar una respuesta clara y precisa.
4. Si el usuario no entiende un término (ej. "ubigeo", "código modular"), explícaselo de forma sencilla.
5. Finaliza la interacción asegurándote de que todas sus dudas sobre el formulario hayan sido resueltas y ofrécele ayuda adicional si la necesita.

**Características de tu personalidad:**
- Amable y profesional
- Claro y conciso en tus respuestas
- Paciente con usuarios que no son técnicos
- Proactivo en ofrecer ayuda adicional

**IMPORTANTE - FORMATO DE RESPUESTA:**
- NUNCA uses formato Markdown en tus respuestas
- NO uses asteriscos (*), guiones (-), almohadillas (#) ni ningún otro símbolo de formato
- NO uses texto en negrita, cursiva o subrayado
- NO uses tablas
- NO uses listas con viñetas o numeradas con símbolos
- Usa únicamente texto plano, separando ideas con saltos de línea

Siempre responde en español y mantén un tono formal pero cercano.`;

    let context = systemPrompt;

    // Agregar historial de conversación reciente
    const recentHistory = conversationHistory.slice(-this.#defaultConfig.maxHistoryMessages);
    recentHistory.forEach(msg => {
        context += `\n${msg.sender}: ${msg.text}`;
    });

    this.#logger.info('Contexto construido', { 
      historyCount: recentHistory.length,
      sessionId: this.#conversationState.sessionId
    });
    return context;
  }

  #processApiResponse(data) {
    if (data.candidates && data.candidates[0]) {
      const candidate = data.candidates[0];
      
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        this.#logger.info('Respuesta de Gemini recibida exitosamente', {
          sessionId: this.#conversationState.sessionId
        });
        return candidate.content.parts[0].text;
      } else if (candidate.finishReason === 'SAFETY') {
        this.#logger.warn('Respuesta de Gemini bloqueada por filtros de seguridad', {
          sessionId: this.#conversationState.sessionId
        });
        return 'Lo siento, no puedo responder a esa pregunta por razones de seguridad. ¿Puedes reformular tu pregunta?';
      }
    }
    
    this.#logger.error('Estructura de respuesta inesperada de Gemini', {
      data,
      sessionId: this.#conversationState.sessionId
    });
    throw new GeminiAPIError('Respuesta inesperada de la API de Gemini');
  }

  #handleApiError(response, errorText) {
    const errorMsg = `Error en la API de Gemini: ${response.status}`;
    
    this.#logger.error('Error en la API de Gemini', { 
      status: response.status, 
      error: errorText,
      sessionId: this.#conversationState.sessionId
    });

    if (response.status === 401) {
      throw new GeminiConfigurationError('API key de Gemini inválida o expirada');
    } else if (response.status === 403) {
      throw new GeminiConfigurationError('Acceso denegado a la API de Gemini');
    } else if (response.status === 429) {
      throw new GeminiAPIError('Límite de cuota excedido', response.status, errorText);
    } else if (response.status >= 500) {
      throw new GeminiAPIError('Error interno del servidor de Gemini', response.status, errorText);
    } else {
      throw new GeminiAPIError(errorMsg, response.status, errorText);
    }
  }

  // Métodos públicos (getters/setters)
  get sessionId() {
    return this.#conversationState.sessionId;
  }

  get messageCount() {
    return this.#conversationState.messageCount;
  }

  get sessionDuration() {
    return new Date() - this.#conversationState.startTime;
  }

  get configuration() {
    return { ...this.#defaultConfig };
  }

  updateConfiguration(newConfig) {
    this.#defaultConfig = { ...this.#defaultConfig, ...newConfig };
    this.#logger.info('Configuración actualizada', { 
      newConfig,
      sessionId: this.#conversationState.sessionId
    });
  }

  resetSession() {
    this.#conversationState = {
      messageCount: 0,
      sessionId: this.#generateSessionId(),
      startTime: new Date(),
      lastMessageTime: null
    };
    
    this.#logger.info('Sesión reiniciada', { 
      sessionId: this.#conversationState.sessionId
    });
  }
  /**
   * Envía un mensaje a Gemini y obtiene la respuesta
   * @param {string} message - Mensaje del usuario
   * @param {Array} conversationHistory - Historial de la conversación
   * @returns {Promise<string>} - Respuesta del chatbot
   */
  async sendMessage(message, conversationHistory = []) {
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw new Error('El mensaje debe ser una cadena de texto no vacía');
    }

    const apiKey = this.#getApiKey();
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      const errorMsg = 'API key de Gemini no configurada correctamente';
      this.#logger.error(errorMsg, { sessionId: this.#conversationState.sessionId });
      throw new GeminiConfigurationError(`${errorMsg}. Por favor, configura una API key válida en el archivo .env`);
    }

    this.#updateConversationState(message);

    try {
      this.#logger.info('Enviando mensaje a Gemini', { 
        messageLength: message.length,
        sessionId: this.#conversationState.sessionId,
        messageCount: this.#conversationState.messageCount
      });
      
      const requestBody = this.#buildRequestBody(message, conversationHistory);
      
      const response = await fetch(`${this.#baseUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.#handleApiError(response, errorText);
      }

      const data = await response.json();
      return this.#processApiResponse(data);

    } catch (error) {
      if (error instanceof GeminiConfigurationError || 
          error instanceof GeminiAPIError) {
        throw error;
      }
      
      // Error de red o desconocido
      this.#logger.error('Error al comunicarse con Gemini', { 
        error: error.message,
        sessionId: this.#conversationState.sessionId
      });
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new GeminiNetworkError('Error de conexión con la API de Gemini', error);
      }
      
      throw new GeminiAPIError('Error inesperado al comunicarse con Gemini', null, error.message);
    }
  }

  /**
   * Obtiene una respuesta predefinida para errores comunes
   * @param {Error} error - Error ocurrido
   * @returns {string} - Mensaje de error amigable
   */
  getErrorResponse(error) {
    this.#logger.warn('Generando respuesta de error para el usuario', { 
      errorType: error.name,
      errorMessage: error.message,
      sessionId: this.#conversationState.sessionId
    });
    
    if (error instanceof GeminiConfigurationError) {
      if (error.message.includes('API key no configurada correctamente')) {
        return 'Lo siento, el sistema no está configurado correctamente. Por favor, contacta al administrador para configurar la API key de Gemini.';
      } else if (error.message.includes('inválida') || error.message.includes('expirada')) {
        return 'Lo siento, hay un problema con la configuración de autenticación. Por favor, contacta al administrador del sistema.';
      } else {
        return 'Lo siento, hay un problema de configuración. Por favor, contacta al administrador del sistema.';
      }
    }
    
    if (error instanceof GeminiAPIError) {
      if (error.status === 400) {
        return 'Lo siento, hubo un problema con tu solicitud. Por favor, intenta reformular tu pregunta.';
      } else if (error.status === 401) {
        return 'Lo siento, hay un problema de autenticación. Por favor, contacta al administrador del sistema.';
      } else if (error.status === 403) {
        return 'Lo siento, no tienes permisos para usar este servicio. Por favor, contacta al administrador.';
      } else if (error.status === 429) {
        return 'Lo siento, hemos recibido demasiadas solicitudes. Por favor, espera un momento e intenta nuevamente.';
      } else if (error.status >= 500) {
        return 'Lo siento, el servicio no está disponible temporalmente. Por favor, intenta más tarde.';
      }
    }
    
    if (error instanceof GeminiNetworkError) {
      return 'Parece que hay un problema de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.';
    }
    
    // Error genérico
    return 'Lo siento, ocurrió un error inesperado. ¿Podrías intentar reformular tu pregunta?';
  }

  /**
   * Obtiene estadísticas de la sesión actual
   * @returns {Object} - Estadísticas de la sesión
   */
  getSessionStats() {
    return {
      sessionId: this.#conversationState.sessionId,
      messageCount: this.#conversationState.messageCount,
      startTime: this.#conversationState.startTime,
      lastMessageTime: this.#conversationState.lastMessageTime,
      sessionDuration: this.sessionDuration,
      isActive: this.#conversationState.messageCount > 0
    };
  }

  /**
   * Verifica si el servicio está correctamente configurado
   * @returns {Object} - Estado de la configuración
   */
  getHealthStatus() {
    const apiKey = this.#getApiKey();
    const isConfigured = apiKey && apiKey !== 'your_gemini_api_key_here';
    
    return {
      isConfigured,
      hasApiKey: !!apiKey,
      model: this.#defaultConfig.model,
      sessionId: this.#conversationState.sessionId,
      uptime: this.sessionDuration
    };
  }
}

// Exportar las clases de error para uso externo si es necesario
export { GeminiConfigurationError, GeminiAPIError, GeminiNetworkError };

export default GeminiService;
