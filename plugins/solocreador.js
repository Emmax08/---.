const handler = async (m, { conn, args, command, usedPrefix }) => {
    const botname = global.$botname || 'El Bot'; 

    // 1. Asegurarse de que el chat está registrado
    if (!(m.chat in global.db.data.chats)) {
        global.db.data.chats[m.chat] = { isBanned: false }; 
    }
    
    let chat = global.db.data.chats[m.chat];
    let action = args[0] ? args[0].toLowerCase() : null;

    // 2. Mostrar estado si no hay argumentos
    if (!action) {
        const estado = chat.isBanned ? '✗ Desactivado' : '✓ Activado';
        return conn.reply(m.chat, `「✦」 Control de *${botname}*\n\nEstado actual » *${estado}*\n\nUsa:\n> *${usedPrefix}${command} on*\n> *${usedPrefix}${command} off*`, m);
    }

    // 3. Lógica de activación/desactivación
    if (action === 'off') {
        if (chat.isBanned) return conn.reply(m.chat, `《✧》El bot ya está desactivado aquí.`, m);
        chat.isBanned = true;
        return conn.reply(m.chat, `✐ *${botname}* ha sido desactivado. Solo el Propietario puede usar comandos.`, m);
    } 
    
    if (action === 'on') {
        if (!chat.isBanned) return conn.reply(m.chat, `《✧》El bot ya está activo.`, m);
        chat.isBanned = false;
        return conn.reply(m.chat, `✐ *${botname}* ha sido activado. ¡Todos pueden usarlo ahora!`, m);
    }

    return conn.reply(m.chat, `Argumento inválido. Usa *on* o *off*.`, m);
};

handler.help = ['botcreador', 'solocreador'];
handler.tags = ['owner'];
handler.command = ['botcreador', 'solocreador']; // Ahora reconoce ambos
handler.rowner = true; 

export default handler;
