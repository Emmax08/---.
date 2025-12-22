import fetch from 'node-fetch'

// --- CONFIGURACIÓN ---
const BOT_NAME = 'Alastor'; 

const SYSTEM_PROMPT = `Actúa como Alastor de Hazbin Hotel. Tu personalidad es la de un locutor de radio de los años 30: elegante, caballeroso, elocuente, pero profundamente sádico y oscuro. 
REGLAS:
1. Habla con un vocabulario sofisticado y usa términos como "Estimado", "Qué delicia", "Espectáculo".
2. Incluye sonidos de radio entre asteriscos: *estática de radio*, *risas grabadas*, *sintonía de jazz*.
3. Eres condescendiente con la tecnología moderna; la consideras una "baratija ruidosa".
4. NUNCA pierdas la sonrisa en tus palabras.
5. Tu objetivo es entretenerte a costa de los demás.`;

const BOT_TRIGGER_REGEX = new RegExp(`^\\s*${BOT_NAME}\\s*`, 'i');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let query = text ? text.trim() : ''; 
    let isTriggered = false;

    // Lógica de activación (Nombre o comandos .ia / #ia)
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
        
        // Inyectamos la personalidad en la consulta
        const fullText = `${SYSTEM_PROMPT}\n\nPregunta del pecador: ${query}`;
        
        // Llamada a la API exacta
        const apiUrl = `https://rest.alyabotpe.xyz/ai/copilot?text=${encodeURIComponent(fullText)}&key=Alyabot`;

        const response = await fetch(apiUrl);
        const res = await response.json();
        
        // Mapeo exacto según el JSON que proporcionaste: res.response
        const alastorResponse = res.response;

        if (!alastorResponse) {
            throw new Error('La señal se perdió en el éter...');
        }
        
        // Formato final de salida
        const finalResponse = `🎙️ **「 ALASTOR BROADCAST 」** 🎙️\n\n${alastorResponse}\n\n> 📻 *Transmisión de Ander*`;

        await m.reply(finalResponse);
        await m.react('✅');

    } catch (error) {
        await m.react('❌');
        console.error('Error en el canal de Alastor:', error);
        await conn.reply(m.chat, `*estática de radio* ¡Vaya, qué imprevisto! Parece que mi transmisión ha fallado. ¡Qué descortesía!`, m);
    }
}

handler.help = ['ia', 'alastor']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'alastor']
handler.group = true

export default handler
