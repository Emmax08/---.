import fetch from 'node-fetch'

// --- CONFIGURACIÓN DE LA NUEVA API (COPILOT) ---
const ALYA_API_KEY = 'Alyabot'; // Tu Key
const BOT_NAME = 'Alastor'; 

const SYSTEM_PROMPT = `Actúa como Alastor de Hazbin Hotel. Tu personalidad es la de un locutor de radio de los años 30: elegante, caballeroso, elocuente, pero profundamente sádico y oscuro. 
REGLAS:
1. Habla con un vocabulario sofisticado y usa términos como "Estimado", "Qué delicia", "Espectáculo".
2. Incluye sonidos de radio entre asteriscos: *estática de radio*, *risas grabadas*, *sintonía de jazz*.
3. Eres condescendiente con la tecnología moderna; la consideras una "baratija ruidosa".
4. NUNCA pierdas la sonrisa en tus palabras, incluso cuando amenaces elegantemente.
5. Tu objetivo es entretenerte a costa de los demás. Responde siempre en español.`;

const BOT_TRIGGER_REGEX = new RegExp(`^\\s*${BOT_NAME}\\s*`, 'i');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text ? text.trim() : ''; 
    let isTriggered = false;

    // Validación de activación
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
        return conn.reply(m.chat, `*estática de radio* 🎙️\n¡Oh, querido amigo! El silencio es aburrido, ¿no crees? ¡Dime algo fascinante para que el show pueda comenzar!`, m);
    }

    try {
        await m.react('📻');
        conn.sendPresenceUpdate('composing', m.chat);
        
        // Construcción de la consulta con la personalidad inyectada
        const fullPrompt = `${SYSTEM_PROMPT}\n\nUsuario dice: ${query}`;
        const apiUrl = `https://rest.alyabotpe.xyz/ai/copilot?text=${encodeURIComponent(fullPrompt)}&key=${ALYA_API_KEY}`;

        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('Interferencia en la señal de Alya');

        const res = await response.json();
        
        // La API de Alyabot suele devolver el resultado en res.result o res.data
        // Ajustamos según la estructura estándar de esa API
        const alastorResponse = res.result || res.answer || res.message;

        if (!alastorResponse) {
            throw new Error('El éter no devolvió respuesta');
        }
        
        // Formato final de la transmisión
        const finalResponse = `🎙️ **「 ALASTOR BROADCAST 」** 🎙️\n\n${alastorResponse}\n\n> 📻 *Transmisión vía Alyabot Network*`;

        await conn.sendMessage(m.chat, { text: finalResponse }, { quoted: m });
        await m.react('✅');

    } catch (error) {
        await m.react('❌');
        console.error('Error en Alastor Copilot:', error);
        await conn.reply(m.chat, `*estática molesta* ¡Vaya, qué imprevisto! Mi señal de radio ha sido interrumpida por una interferencia externa. ¡Qué descortesía!`, m);
    }
}

handler.help = ['ia', 'alastor']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'alastor']
handler.group = true

export default handler
