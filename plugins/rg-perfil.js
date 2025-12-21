import moment from 'moment-timezone';

let handler = async (m, { conn, args }) => {
    let userId = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender);

    try {
        let user = global.db.data.users[userId];
        if (!user) return m.reply('❌ El usuario no está registrado en la base de datos.');

        // --- ESCUDO CONTRA NÚMEROS INFINITOS O CORRUPTOS ---
        const fixNumber = (num) => {
            if (num === Infinity || num >= 9007199254740991) return 'Máximo';
            return (num || 0).toLocaleString();
        };

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
☆ *Exp:* ${fixNumber(user.exp)}
❖ *Nivel:* ${fixNumber(user.level)}

⛁ *Cartera:* ${fixNumber(user.coin)}
⛃ *Banco:* ${fixNumber(user.bank)}
❁ *Premium:* ${user.premium ? '✅' : '❌'}

📝 *Descripción:* ${user.description || 'Sin descripción'}`.trim();

        // Enviamos con un pequeño retraso para asegurar estabilidad
        await conn.sendMessage(m.chat, { 
            image: { url: perfil }, 
            caption: profileText,
            mentions: mentions
        }, { quoted: m });

    } catch (e) {
        console.error("ERROR EN PERFIL:", e);
        // Respuesta final de emergencia si falla la imagen
        let u = global.db.data.users[userId];
        m.reply(`✅ Datos cargados:\nNivel: ${u.level}\nExp: ${u.exp}\n\nNota: Los datos de este usuario parecen estar saturados.`);
    }
};

handler.help = ['profile'];
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];

export default handler;
