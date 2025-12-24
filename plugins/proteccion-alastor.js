// plugins/proteccion-alastor.js
const ownerNumber = '5217223004357@s.whatsapp.net';

let handler = m => m;

handler.before = async function (m, { conn }) {
    // 1. Verificamos si es un comando con tus prefijos (. o #)
    if (!m.text || !/^[.#]/.test(m.text)) return false;

    // 2. Identificamos si el objetivo eres tú (por mención o respuesta)
    const target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);

    // 3. BLOQUEO CRÍTICO: Si intentan algo contra ti y NO eres tú mismo
    if (target === ownerNumber && m.sender !== ownerNumber) {
        
        // Alastor responde
        await conn.sendMessage(m.chat, {
            text: `*¡EL SHOW HA TERMINADO PARA TI!* 🎙️\n\n@${m.sender.split('@')[0]}, tu contrato ha sido revocado. Intentar atacar a mi creador es un pecado que no puedo ignorar. ¡Disfruta de la estática! 📻✨`,
            mentions: [m.sender]
        }, { quoted: m });

        // IMPORTANTE: Devolver 'true' aquí detiene CUALQUIER otro plugin.
        // Esto evitará que el comando .kick o cualquier otro se ejecute.
        return true; 
    }

    return false;
};

// Configuramos los tags solicitados
handler.help = ['proteccion']
handler.tags = ['owner']
handler.command = /^(proteccionalastor)$/i 
handler.group = true

export default handler;
