// Este comando permite al Propietario Principal (rowner)
// activar/desactivar el bot en el grupo actual, sin necesidad de ser Admin.

const handler = async (m, { conn, args, command, usedPrefix }) => {
    // Definición del nombre del bot para mensajes, asumiendo que lo tienes en una variable global.
    // Si no tienes $botname, puedes reemplazarlo con el nombre literal.
    const botname = global.$botname || 'El Bot'; 

    // 1. Asegurarse de que el chat está registrado
    if (!(m.chat in global.db.data.chats)) {
        return conn.reply(m.chat, `《✦》¡Este chat no está registrado en la base de datos!`, m);
    }
    
    let chat = global.db.data.chats[m.chat];

    // 2. Comprobar argumentos y mostrar estado/ayuda
    if (args.length === 0) {
        const estado = chat.isBanned ? '✗ Desactivado' : '✓ Activado';
        const info = `
「✦」Como *Propietario Principal*, puedes controlar el estado de *${botname}* en este grupo usando:

> ✐ *${usedPrefix}${command} on* para activar (Responderá a comandos)
> ✐ *${usedPrefix}${command} off* para desactivar (No responderá a comandos)

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
        return conn.reply(m.chat, `✐ Has *desactivado* a *${botname}* en este grupo. ¡Solo el Propietario puede revertir esto!`, m);
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
handler.rowner = true; // RESTRICCIÓN CLAVE: Solo el Propietario Principal puede usarlo.

export default handler;
