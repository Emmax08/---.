// owner_escudo.js
const ownerNumber = '5217223004357@s.whatsapp.net';

let handler = async (m, { conn, usedPrefix, noPrefix }) => {
    // Si alguien intenta usar un comando contra ti
    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
    
    if (target === ownerNumber && m.sender !== ownerNumber) {
        await conn.sendMessage(m.chat, {
            text: `*¡ALTO AHÍ!* 🎙️\n\n¿Realmente creíste que podrías usar un comando contra mi creador? ¡Qué propuesta tan... ENTRETENIDA! Pero me temo que no puedo permitirlo. 📻✨\n\n_— Sonríe, el show es mío._`,
            mentions: [m.sender]
        }, { quoted: m });
        
        // El 'throw' detiene cualquier otro comando que intente ejecutarse después
        throw false; 
    }
};

// Este Regex detecta CUALQUIER comando que empiece con . o # y te mencione
handler.customPrefix = /[.#]/;
handler.command = new RegExp(); // Captura todo lo que tenga el prefijo
handler.before = async function (m) {
    if (!m.text) return false;
    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
    if (target === ownerNumber && m.sender !== ownerNumber && /^[.#]/.test(m.text)) {
        m.isCommand = false; // Engañamos al bot para que no lo trate como comando
        return this.handler(m); // Forzamos a que solo se ejecute este plugin
    }
};

handler.group = true;
export default handler;
