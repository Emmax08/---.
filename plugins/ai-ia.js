import fetch from 'node-fetch' // Usamos fetch para la API de Adonix Gemini
// Nota: axios ya no es necesario

// --- CONSTANTES DE CONFIGURACIÓN ---
const BOT_NAME = 'Alastor'; // Nombre de la IA
// Expresión regular para buscar "Alastor" al inicio del mensaje
const BOT_TRIGGER_REGEX = new RegExp(`^\\s*${BOT_NAME}\\s*`, 'i');
// URL base de la API de Gemini de Adonix. Sustituye 'logic' por 'role' en el código
const GEMINI_API_URL = 'https://api-adonix.ultraplus.click/ai/geminiact';
const API_KEY = 'Adofreekey';
// Nota: Las variables 'msm', 'emoji', 'emoji2', 'rwait', 'done', 'error' deben estar definidas globalmente en tu entorno.
// ----------------------------------

// 🎯 FUNCIÓN GEMINI (API de Adonix UltraPlus)
const geminiQuery = async (query, role = 'general') => {
    try {
        // q es la pregunta del usuario, role es el contexto/personalidad de la IA.
        const url = `${GEMINI_API_URL}?apikey=${API_KEY}&text=${encodeURIComponent(query)}&role=${encodeURIComponent(role)}`;

        const res = await fetch(url);
        
        if (!res.ok) {
            console.error(`💥 Error en la API de Adonix Gemini: ${res.status} ${res.statusText}`);
            // Intenta leer el cuerpo del error si es posible
            const errorBody = await res.text();
            console.error('Cuerpo de la respuesta de error:', errorBody);
            return null;
        }

        const data = await res.json();
        
        // La respuesta del endpoint parece estar en data.result
        if (data && data.result) {
            return data.result.trim();
        }
        return null; // No se encontró el resultado
    } catch (err) {
        console.error('💥 Error al obtener respuesta de Gemini (Adonix API):', err.message);
        return null;
    }
};

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const username = `${conn.getName(m.sender)}`

    // Si hay una imagen citada, se ignora, ya que esta versión no la procesa.
    const isQuotedImage = m.quoted?.mimetype?.startsWith('image/') || m.quoted?.msg?.mimetype?.startsWith('image/')
    if (isQuotedImage) {
        // En este caso, simplemente se usa el pie de foto de la imagen citada como query de texto.
        // Si no hay pie de foto, se ignora el mensaje citado.
        if (!text) {
             return conn.reply(m.chat, `¡Hola, ${username}! ${BOT_NAME} puede responderte. Por favor, escribe tu pregunta después del comando o mención.`, m)
        }
    }

    // --- LÓGICA DE ACTIVACIÓN Y PROCESAMIENTO DE TEXTO ---
    let query = text ? text.trim() : ''; 
    let isTriggered = false;

    // 1. Verificar si el mensaje es una MENCION DIRECTA (Ej: "Alastor dime...")
    const match = query.match(BOT_TRIGGER_REGEX);
    if (match) {
        query = query.substring(match[0].length).trim(); 
        isTriggered = true;
    }

    // 2. Verificar si el mensaje es un COMANDO TRADICIONAL (Ej: !ia, !alastor)
    if (!isTriggered && handler.command.includes(command)) {
        isTriggered = true; 
    }

    // Si no fue activado, termina.
    if (!isTriggered) {
         return
    }

    // 3. Chequeo de texto vacío (después de eliminar el trigger)
    if (!query) { 
        return conn.reply(m.chat, `${emoji} Por favor, ingresa una pregunta para que ${BOT_NAME} te responda. Ejemplo: \`${BOT_NAME} ¿quién eres?\``, m)
    }

    await m.react(rwait)
    
    // --- LÓGICA DE RESPUESTA CON GEMINI API ---
    try {
        // Aquí puedes definir la personalidad de la IA ('role'/'logic') si lo deseas. 
        // Si no se especifica, usa 'general' como valor predeterminado.
        const responseText = await geminiQuery(query, 'Asistente de WhatsApp amable y conciso'); 
        
        if (responseText) {
            // Envía la respuesta de texto
            await conn.reply(m.chat, responseText, m);
            await m.react(done);
        } else {
            // Si no encuentra resultados
            await m.react(error);
            await conn.reply(m.chat, `❌ Lo siento, ${username}. ${BOT_NAME} no pudo generar una respuesta. La API falló o no devolvió un resultado válido.`, m);
        }
    } catch (e) {
        console.error(`Error en la consulta con Adonix Gemini API: ${e}`); 
        await m.react(error)
        await conn.reply(m.chat, `✘ ${BOT_NAME} no pudo completar la consulta. Ocurrió un error interno.`, m)
    }
}

handler.help = ['ia', 'chatgpt']
handler.tags = ['ai'] 
handler.register = true
handler.command = ['ia', 'chatgpt', 'luminai', 'alastor']
handler.group = true

export default handler
