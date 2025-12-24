// plugins/proteccion-alastor.js

const ownerNumber = '5217223004357@s.whatsapp.net';

let handler = m => m;

handler.before = async function (m, { conn }) {
    // Verificamos prefijos . y # según tu configuración
    if (!m.text || !/^[.#]/.test(m.text)) return false;

    // Detectamos si el objetivo es el creador
    const target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);

    if (target === ownerNumber && m.sender !== ownerNumber) {
        
        await conn.sendMessage(m.chat, {
            text: `*¡EL SHOW HA TERMINADO PARA TI!* 🎙️\n\n@${m.sender.split('@')[0]}, tu contrato ha sido revocado. Intentar atacar a mi creador es un pecado que no puedo ignorar. ¡Disfruta de la estática! 📻✨`,
            mentions: [m.sender]
        }, { quoted: m });

        return true; // Bloquea la ejecución del comando enemigo
    }

    return false;
};

// Configuración final estilo plugin estándar
handler.help = ['proteccion']
handler.tags = ['owner']
handler.command = /^(proteccionalastor)$/i // Comando interno por si quieres consultar algo
handler.group = true

export default handler
