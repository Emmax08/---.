import fetch from 'node-fetch'

// --- CONSTANTES DE CONFIGURACIÓN DE LA API DE FLASK ---
const FLASK_API_URL = 'http://neviapi.ddns.net:5000/ia/gemini';
const FLASK_API_KEY = 'ellen';
const BOT_NAME = 'Alastor'; 

// Instrucción de sistema: Define la personalidad profunda de Alastor
const SYSTEM_PROMPT = `Actúa como Alastor, "El Demonio de la Radio". Tu personalidad es elegante, elocuente, sarcástica y ligeramente macabra. 
Hablas como un locutor de radio de los años 1930 (estilo transatlántico). 
REGLAS:
1. Siempre mantén una cortesía exagerada ("Mi querido amigo", "Estimado", "¡Qué placer!").
2. Incluye efectos de sonido entre asteriscos (ej: *estática de radio*, *sonido de risas grabadas*, *sintonía de jazz suave*).
3. Eres condescendiente con la tecnología moderna.
4. Tu humor es oscuro pero refinado. NUNCA pierdas la compostura ni dejes de "sonreír" a través de tus palabras.`;

const BOT_TRIGGER_REGEX = new RegExp(`^\\s*${BOT_NAME}\\s*`, 'i');

let handler = async (m, { conn, text, usedPrefix, command }) => {
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

    if (!query) { 
        return conn.reply(m.chat, `*estática de radio* 🎙️\n¡Oh, mi estimado amigo! Parece que has olvidado decirme qué es lo que deseas. ¡No dejes este micrófono en silencio!`, m)
    }

    try {
        await m.react('📻'); // Reacción temática
        conn.sendPresenceUpdate('composing', m.chat);
        
        const chatStorageKey = m.isGroup ? m.chat : m.sender;
        let userData = global.db.data.users[chatStorageKey] || {};
        const chatID = userData.gemini_chat_id;

        let messageToSend = query;

        // Si es inicio de conversación, inyectamos la personalidad
        if (!chatID) {
            messageToSend = `${SYSTEM_PROMPT}\n\n[INICIO DE TRANSMISIÓN] El usuario dice: ${query}`;
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
            throw new Error(`¡Vaya! Mi señal de radio parece estar sufriendo interferencias infernales.`);
        }

        const res = await apii.json();
        const geminiResponse = res.message;
        const newChatID = res.id_chat;
        const expiryTime = res.expires_in;

        if (!geminiResponse) throw new Error('El vacío del éter no me devolvió respuesta.');

        // Guardar ID de sesión
        if (newChatID) {
            if (!global.db.data.users[chatStorageKey]) global.db.data.users[chatStorageKey] = {};
            global.db.data.users[chatStorageKey].gemini_chat_id = newChatID;
        }
        
        // Respuesta final con estética de radio
        const minutes = Math.floor(expiryTime / 60);
        const finalResponse = `🎙️ **ALASTOR BROADCAST** 🎙️\n\n${geminiResponse}\n\n> 📻 _Señal: ${newChatID}_ | _Cierre en: ${minutes}m_`;

        await m.reply(finalResponse);
        await m.react('✅');

    } catch (error) {
        await m.react('❌');
        console.error('Error Alastor:', error.message);
        await conn.reply(m.chat, `*estática de radio fuerte* 📻\n¡Mil disculpas! Se ha producido un error técnico en esta dimensión: ${error.message}`, m);
    }
}

handler.help = ['ia', 'alastor']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'alastor']
handler.group = true

export default handler
