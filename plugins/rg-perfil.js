import moment from 'moment-timezone';

let handler = async (m, { conn, args }) => {
    // Definimos userId al principio para que el catch siempre lo reconozca
    let userId = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender);

    try {
        let user = global.db.data.users[userId];
        if (!user) return m.reply('❌ El usuario no está registrado en la base de datos.');

        let name = await conn.getName(userId).catch(_ => 'Usuario');
        let perfil = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg');
        
        let parejaId = user.marry || null;
        let parejaText = parejaId ? `@${parejaId.split('@')[0]}` : 'Nadie';
        let mentions = [userId];
        if (parejaId) mentions.push(parejaId);

        let profileText = `
「✿」*PERFIL DE USUARIO*
✦ *Nombre:* ${name}
✦ *Tag:* @${userId.split('@')[0]}
✦ *Edad:* ${user.age || 'Desconocida'}
♛ *Cumpleaños:* ${user.birth || 'No especificado'}
⚥ *Género:* ${user.genre || 'No especificado'}
♡ *Pareja:* ${parejaText}

✎ *Rango:* ${user.role || 'Sin Rango'}
☆ *Exp:* ${(user.exp || 0).toLocaleString()}
❖ *Nivel:* ${user.level || 0}

⛁ *Cartera:* ${(user.coin || 0).toLocaleString()}
⛃ *Banco:* ${(user.bank || 0).toLocaleString()}
❁ *Premium:* ${user.premium ? '✅' : '❌'}

📝 *Descripción:* ${user.description || 'Sin descripción'}`.trim();

        // CAMBIO CLAVE: Enviar como imagen con descripción. 
        // Esto evita el error de "mensaje invisible" que causan los externalAdReply.
        await conn.sendMessage(m.chat, { 
            image: { url: perfil }, 
            caption: profileText,
            mentions: mentions
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        // Respuesta de emergencia si todo lo anterior falla
        let userSimple = global.db.data.users[userId];
        m.reply(`⚠️ Hubo un error crítico, pero aquí están tus datos básicos:\n\nNivel: ${userSimple?.level || 0}\nExp: ${userSimple?.exp || 0}`);
    }
};

handler.help = ['profile'];
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];

export default handler;
