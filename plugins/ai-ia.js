import fetch from 'node-fetch'

// --- CONSTANTES DE CONFIGURACIÓN DE LA API DE FLASK ---
const FLASK_API_URL = 'http://neviapi.ddns.net:5000/ia/gemini';
const FLASK_API_KEY = 'ellen';
const BOT_NAME = 'Alastor'; // Nombre del bot, usado para triggers

// Instrucción de sistema: Define la personalidad del bot.
// Esto se enviará concatenado con la primera consulta (si no hay chatID).
const SYSTEM_PROMPT = `Eres ${BOT_NAME}, un asistente IA con una personalidad sarcástica, elegante y ligeramente condescendiente, pero siempre dispuesto a ayudar. Usa emojis relevantes de forma moderada. Tu objetivo es responder de manera útil manteniendo este tono en todo momento.`;

// Expresión regular para buscar "Alastor" al inicio del mensaje
const BOT_TRIGGER_REGEX = new RegExp(`^\\s*${BOT_NAME}\\s*`, 'i');
// NOTA: Las variables 'msm', 'emoji', 'rwait', 'done', 'error' deben estar definidas globalmente.
// --------------------------------------------------------

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // const username = `${conn.getName(m.sender)}` // No usado en este flujo

    // --- LÓGICA DE ACTIVACIÓN Y PROCESAMIENTO DE TEXTO (Heredada de Alastor) ---
    let query = text ? text.trim() : ''; 
    let isTriggered = false;

    // 1. Verificar si es una MENCION DIRECTA (Ej: "Alastor dime...")
    const match = query.match(BOT_TRIGGER_REGEX);
    if (match) {
        query = query.substring(match[0].length).trim(); 
        isTriggered = true;
    }

    // 2. Verificar si es un COMANDO TRADICIONAL (Ej: !ia, !alastor)
    if (!isTriggered && handler.command.includes(command)) {
        isTriggered = true; 
    }

    // Si no fue activado, termina.
    if (!isTriggered) {
         return
    }

    // 3. Chequeo de texto vacío (después de eliminar el trigger)
    if (!query) { 
        // Usamos la variable global 'emoji'
        return conn.reply(m.chat, `${emoji} Por favor, ingresa una petición para que ${BOT_NAME} te responda. Ejemplo: \`${BOT_NAME} que hora es?\``, m)
    }

    // --- LÓGICA PRINCIPAL DE GEMINI ---
    try {
        await m.react(rwait); // Usamos la variable global 'rwait'
        conn.sendPresenceUpdate('composing', m.chat);
        
        const chatStorageKey = m.isGroup ? m.chat : m.sender;
        let userData = global.db.data.users[chatStorageKey] || {};
        const chatID = userData.gemini_chat_id;

        // 1. Construir el mensaje de la solicitud
        let messageToSend = query;

        // 2. Si no hay chatID, esta es la primera interacción. 
        // Concatenamos el SYSTEM_PROMPT y la primera consulta en el campo 'message'.
        if (!chatID) {
            messageToSend = `${SYSTEM_PROMPT}\n\n[INICIO DE CONVERSACIÓN] Usuario pregunta: ${query}`;
            console.log(`[GEMINI] Iniciando nueva sesión con SYSTEM_PROMPT.`)
        }

        // El payload se ajusta al formato simple que parece esperar la API de Flask: {message, id_chat}
        const payload = {
            message: messageToSend, 
            id_chat: chatID || null
        };

        const apii = await fetch(FLASK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': FLASK_API_KEY
            },
            body: JSON.stringify(payload)
        });

        // 3. Manejo de errores HTTP
        if (!apii.ok) {
            await m.react('❌');
            let errorResponse;
            try {
                // Intenta leer el error detallado del cuerpo
                errorResponse = await apii.json();
            } catch {
                // Si falla la lectura del JSON de error
                throw new Error(`Fallo HTTP: ${apii.status} ${apii.statusText}`);
            }
            throw new Error(errorResponse.message || 'Error desconocido del servidor Flask.');
        }

        const res = await apii.json();
        const geminiResponse = res.message;
        const newChatID = res.id_chat;
        const expiryTime = res.expires_in;

        if (!geminiResponse) {
            await m.react('❌');
            throw new Error('La API de Gemini no devolvió una respuesta válida.');
        }

        // ==========================================================
        // 🚨 CAPA DE SEGURIDAD 3: FILTRO DE RESPUESTA DE GEMINI
        // ==========================================================
        const forbiddenPattern = /[/\.>$#\\]/g; 
        
        if (forbiddenPattern.test(geminiResponse)) {
            const safeResponse = "gemini no puede responder a eso"; 
            console.warn(`[SEGURIDAD BLOQUEADA] Respuesta de Gemini bloqueada por un carácter sensible.`);
            
            await m.react('❌'); 
            await conn.reply(m.chat, safeResponse, m);
            return;
        }
        // ==========================================================

        // 4. Guardar el nuevo ID de sesión
        if (newChatID) {
            const storage = global.db.data.users[chatStorageKey] || (global.db.data.users[chatStorageKey] = {});
            storage.gemini_chat_id = newChatID;
        }
        
        // 5. CONCATENAR la respuesta con información de sesión
        const finalResponse = `${geminiResponse}\n\n---\n💬 ID de Sesión: ${newChatID}\n(Expira en ${expiryTime / 60} minutos de inactividad)`;

        await m.reply(finalResponse);
        await m.react(done); // Usamos la variable global 'done'

    } catch (error) {
        await m.react('❌');
        console.error('Error en el chat de Gemini:', error.message);
        await conn.reply(m.chat, `${msm} Error: ${error.message}`, m); // Usamos la variable global 'msm'
    }
}

handler.help = ['ia', 'alastor']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'alastor']
handler.group = true

export default handler
