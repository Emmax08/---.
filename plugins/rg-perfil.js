import moment from 'moment-timezone';

let handler = async (m, { conn, args }) => {
    try {
        let userId = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender);

        let user = global.db.data.users[userId];
        if (!user) return m.reply('❌ El usuario no está registrado.');

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

        // Enviamos el mensaje de forma más "ligera" para evitar errores de red
        await conn.sendMessage(m.chat, { 
            text: profileText,
            mentions: mentions,
            contextInfo: {
                mentionedJid: mentions,
                externalAdReply: {
                    title: `PERFIL DE ${name.toUpperCase()}`,
                    body: 'Sistema de Usuario',
                    thumbnailUrl: perfil,
                    mediaType: 1,
                    // Eliminamos campos innecesarios que causan errores de visibilidad
                    showAdAttribution: false, 
                    renderLargerThumbnail: false // Desactiva esto si sigue fallando
                }
            }
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        // Si falla el mensaje con diseño, enviamos uno de texto simple como respaldo
        m.reply('Hubo un problema visual, enviando perfil simple...');
        m.reply(`Perfil de @${userId.split('@')[0]}: ${global.db.data.users[userId].level || 0} nivel.`);
    }
};

handler.help = ['profile'];
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];

export default handler;
