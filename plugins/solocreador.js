// Este comando permite al Propietario Principal (rowner)
// activar/desactivar el bot en el grupo actual.

const handler = async (m, { conn, args, command, usedPrefix }) => {
    // 1. Asegurarse de que el chat está registrado
    if (!(m.chat in global.db.data.chats)) {
        return conn.reply(m.chat, `《✦》¡Este chat no está registrado en la base de datos!`, m);
    }
    
    let chat = global.db.data.chats[m.chat];
    const botname = 'El Bot'; // Define aquí el nombre de tu bot si lo tienes en una variable

    // 2. Comprobar argumentos
    if (args.length === 0) {
        const estado = chat.isBanned ? '✗ Desactivado' : '✓ Activado';
        const info = `
「✦」Como *Propietario*, puedes activar o desactivar *${botname}* en este grupo usando:

> ✐ *${usedPrefix}${command} on* para activar
> ✐ *${usedPrefix}${command} off* para desactivar

✧ Estado actual en este grupo » *${estado}*
`;
        return conn.reply(m.chat, info, m);
    }

    // 3. Lógica para Desactivar (off)
    if (args[0] === 'off') {
        if (chat.isBanned) {
            return conn.reply(m.chat, `《✧》*${botname}* ya estaba desactivado en este grupo.`, m);
        }
        chat.isBanned = true;
        return conn.reply(m.chat, `✐ Has *desactivado* a *${botname}* en este grupo. ¡No responderá a comandos aquí!`, m);
    } 
    
    // 4. Lógica para Activar (on)
    else if (args[0] === 'on') {
        if (!chat.isBanned) {
            return conn.reply(m.chat, `《✧》*${botname}* ya estaba activado en este grupo.`, m);
        }
        chat.isBanned = false;
        return conn.reply(m.chat, `✐ Has *activado* a *${botname}* en este grupo. ¡Ahora responderá a los comandos!`, m);
    }

    // 5. Argumento inválido
    return conn.reply(m.chat, `Argumento inválido. Usa *${usedPrefix}${command} on* o *${usedPrefix}${command} off*.`, m);
};

handler.help = ['botcreador'];
handler.tags = ['owner'];
handler.command = ['botcreador'];
handler.rowner = true; // Solo el Propietario Principal puede usarlo.

export default handler;
