// plugins/proteccion-alastor.js
const ownerNumber = '5217223004357@s.whatsapp.net';

let handler = m => m;

handler.before = async function (m, { conn }) {
    // 1. Verificamos si el mensaje usa tus prefijos . o #
    const isCmd = /^[.#]/.test(m.text);
    if (!isCmd) return false;

    // 2. Identificamos al objetivo (mencionado o citado)
    const target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);

    // 3. BLOQUEO TOTAL
    if (target === ownerNumber && m.sender !== ownerNumber) {
        
        // Alastor detiene la transmisión
        await conn.sendMessage(m.chat, {
            text: `*¡SINTONÍA INTERRUMPIDA!* 🎙️\n\n¿Realmente creíste que podrías deshacerte de mi creador? ¡Qué propuesta tan... ENTRETENIDA! Pero me temo que no puedo permitirlo. 📻✨\n\n_— Sonríe, el show es mío._`,
            mentions: [m.sender]
        }, { quoted: m });

        // ESTO ES LO QUE DETENDRÁ EL KICK:
        m.text = '';        // Borramos el texto del comando
        m.isCommand = false; // Le decimos al bot que NO es un comando
        if (m.msg) m.msg.text = ''; // Limpieza profunda para versiones basadas en Baileys
        
        return true; // Retornamos true para detener la ejecución de otros plugins
    }

    return false;
};

handler.help = ['alastor']
handler.tags = ['owner']
handler.command = /^(proteccion|alastor)$/i
handler.group = true
handler.priority = 0 // Prioridad máxima (0 suele ser la más alta)

export default handler;
