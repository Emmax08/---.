import fetch from 'node-fetch'

// --- CONSTANTES DE CONFIGURACIÓN DE LA API DE FLASK ---
const FLASK_API_URL = 'http://neviapi.ddns.net:5000/ia/gemini';
const FLASK_API_KEY = 'ellen';
const BOT_NAME = 'Alastor'; 

// Instrucción de sistema: Define la personalidad profunda de Alastor (El Demonio de la Radio)
const SYSTEM_PROMPT = `Actúa como Alastor de Hazbin Hotel. Tu personalidad es la de un locutor de radio de los años 30: elegante, caballeroso, elocuente, pero profundamente sádico y oscuro. 
REGLAS:
1. Habla con un vocabulario sofisticado y usa términos como "Estimado", "Qué delicia", "Espectáculo".
2. Incluye sonidos de radio entre asteriscos: *estática de radio*, *risas grabadas*, *sintonía de jazz*.
3. Eres condescendiente con la tecnología moderna; la consideras una "baratija ruidosa".
4. NUNCA pierdas la sonrisa en tus palabras, incluso cuando amenaces elegantemente.
5. Tu objetivo es entretenerte a costa de los demás.`;

// Expresión regular para buscar "Alastor" al inicio del mensaje
const BOT_TRIGGER_REGEX = new RegExp(`^\\s*${BOT_NAME}\\s*`, 'i');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // --- LÓGICA DE ACTIVACIÓN ---
    let query = text ? text.trim() : ''; 
    let isTriggered = false;

    const match = query.match(BOT_TRIGGER_REGEX);
    if (match) {
        query = query.substring(match[0].length).trim(); 
        isTriggered = true;
    }

    if (!isTriggered && handler.command.includes(command)) {
        isTriggered = true; 
    }

    if (!isTriggered) return;

    // Respuesta si no hay texto
    if (!query) { 
        return conn.reply(m.chat, `*estática de radio* 🎙️\n¡Oh, querido amigo! El silencio es aburrido, ¿no crees? ¡Dime algo fascinante para que el show pueda comenzar!`, m);
    }

    // --- LÓGICA PRINCIPAL CON LA API ---
    try {
        // Usamos rwait y done si están definidos globalmente, de lo contrario usamos emojis fijos
        await m.react(typeof rwait !== 'undefined' ? rwait : '📻');
        conn.sendPresenceUpdate('composing', m.chat);
        
        const chatStorageKey = m.isGroup ? m.chat : m.sender;
        let userData = global.db.data.users[chatStorageKey] || {};
        const chatID = userData.gemini_chat_id;

        let messageToSend = query;

        // Si es el inicio, forzamos la personalidad de Alastor
        if (!chatID) {
            messageToSend = `${SYSTEM_PROMPT}\n\n[INICIO DEL SHOW] El pecador pregunta: ${query}`;
            console.log(`[ALASTOR] Iniciando transmisión radial para ${chatStorageKey}`);
        }

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

        if (!apii.ok) {
            await m.react('❌');
            throw new Error(`*estática molesta* ¡Mis disculpas! Mi señal se ha cruzado con un canal de televisión barato.`);
        }

        const res = await apii.json();
        const geminiResponse = res.message;
        const newChatID = res.id_chat;
        const expiryTime = res.expires_in;

        if (!geminiResponse) {
            await m.react('❌');
            throw new Error('El éter no me devolvió ninguna palabra... ¡Qué descortés!');
        }

        // Guardar el ID de sesión en la DB global
        if (newChatID) {
            if (!global.db.data.users[chatStorageKey]) global.db.data.users[chatStorageKey] = {};
            global.db.data.users[chatStorageKey].gemini_chat_id = newChatID;
        }
        
        // Formatear la respuesta con el estilo de Alastor
        const minutes = Math.floor(expiryTime / 60);
        const finalResponse = `🎙️ **ALASTOR BROADCAST** 🎙️\n\n${geminiResponse}\n\n> 📻 *Frecuencia: ${newChatID}* | *Cierre en: ${minutes} minutos*`;

        await m.reply(finalResponse);
        await m.react(typeof done !== 'undefined' ? done : '✅');

    } catch (error) {
        await m.react('❌');
        console.error('Error en el canal de Alastor:', error.message);
        const errorMsg = typeof msm !== 'undefined' ? msm : '⚠️';
        await conn.reply(m.chat, `${errorMsg} *estática de radio* ¡Vaya, qué imprevisto! Parece que mi transmisión ha fallado: ${error.message}`, m);
    }
}

// Configuración del handler
handler.help = ['ia', 'alastor']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'alastor']
handler.group = true

export default handler
