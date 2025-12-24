/* 🎙️ COMANDO KICK - LA SENTENCIA DE ALASTOR 🎙️
 * "El espectáculo es demasiado corto para invitados aburridos".
 */

var handler = async (m, { conn, participants, usedPrefix, command }) => {
    // Verificar si hay una víctima sintonizada
    if (!m.mentionedJid[0] && !m.quoted) {
        return conn.reply(m.chat, `🎙️ *¡Error de casting!* Debes mencionar a un alma o responder a su mensaje para que pueda sacarla del escenario.`, m);
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    
    // --- NUEVA LÓGICA DE PROTECCIÓN GLOBAL ---
    // Extraemos todos los números de global.owner y les damos formato de JID
    const globalOwners = global.owner
        .filter(owner => owner[0]) // Filtramos entradas vacías
        .map(owner => owner[0] + '@s.whatsapp.net');

    // Restricciones con el toque de Alastor
    if (user === conn.user.jid) {
        return conn.reply(m.chat, `📻 *¡JAJAJA!* ¿Intentas apagar la radio? Qué propuesta tan audaz, pero no me iré tan fácilmente.`, m);
    }

    if (user === ownerGroup) {
        return conn.reply(m.chat, `🍎 No puedo expulsar al dueño de este hotel... todavía. Las reglas de cortesía me lo impiden.`, m);
    }

    // Verificamos si el usuario está en la lista de dueños globales
    if (globalOwners.includes(user)) {
        return conn.reply(m.chat, `🎙️ Mis creadores son quienes me dan la señal. Sería una tontería morder una de las manos que sostienen el micrófono, ¿no crees?`, m);
    }
    // ------------------------------------------

    // Ejecución del "despido"
    await conn.sendMessage(m.chat, { 
        text: `🎙️ *¡EL SHOW HA TERMINADO PARA TI!* 🎙️\n\n@${user.split('@')[0]}, tu contrato ha sido revocado. ¡Disfruta de la estática! 📻✨`, 
        mentions: [user] 
    }, { quoted: m });

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban'];
handler.admin = true;
handler.group = true;
handler.register = true;
handler.botAdmin = true;

export default handler;
