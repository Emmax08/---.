import moment from 'moment-timezone';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    try {
        let userId;
        if (m.quoted && m.quoted.sender) {
            userId = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid[0]) {
            userId = m.mentionedJid[0];
        } else {
            userId = m.sender;
        }

        // Definir variables de respaldo por si no existen globalmente
        let moneda = global.moneda || 'Coins';
        let dev = global.author || 'Bot User';

        let user = global.db.data.users[userId];
        if (!user) return m.reply('❌ El usuario no está registrado en la base de datos.');

        // Obtener nombre de forma segura
        let name;
        try {
            name = await conn.getName(userId);
        } catch (e) {
            name = 'Usuario';
        }

        let cumpleanos = user.birth || 'No especificado';
        let genero = user.genre || 'No especificado';
        let parejaId = user.marry || null;
        let parejaText = 'Nadie';
        let mentions = [userId];

        if (parejaId) {
            let parejaName = await conn.getName(parejaId).catch(_ => 'Usuario');
            parejaText = `@${parejaId.split('@')[0]} (${parejaName})`;
            mentions.push(parejaId);
        }

        let description = user.description || 'Sin descripción';
        let exp = user.exp || 0;
        let nivel = user.level || 0;
        let role = user.role || 'Sin Rango';
        let coins = user.coin || 0;
        let bankCoins = user.bank || 0;

        // Foto de perfil con URL de respaldo si falla
        let perfil;
        try {
            perfil = await conn.profilePictureUrl(userId, 'image');
        } catch (e) {
            perfil = 'https://files.catbox.moe/xr2m6u.jpg';
        }

        let profileText = `
「✿」Perfil de @${userId.split('@')[0]}
✦ Edad: ${user.age || 'Desconocida'}
♛ Cumpleaños: ${cumpleanos}
⚥ Género: ${genero}
♡ Casado con: ${parejaText}

✎ Rango: ${role}
☆ Exp: ${exp.toLocaleString()}
❖ Nivel: ${nivel}

⛁ Coins Cartera: ${coins.toLocaleString()} ${moneda}
⛃ Coins Banco: ${bankCoins.toLocaleString()} ${moneda}
❁ Premium: ${user.premium ? '✅' : '❌'}

📝 Descripción: ${description}
`.trim();

        await conn.sendMessage(m.chat, { 
            text: profileText,
            contextInfo: {
                mentionedJid: mentions,
                externalAdReply: {
                    title: `✧ Perfil de ${name} ✧`,
                    body: dev,
                    thumbnailUrl: perfil,
                    sourceUrl: null,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Ocurrió un error al intentar mostrar el perfil. Intenta de nuevo.');
    }
};

handler.help = ['profile'];
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];

export default handler;
