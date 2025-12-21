import { canvg } from 'canvg'; 
import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    let userId = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender);

    try {
        // 1. Obtener datos con seguridad total
        let user = global.db.data.users[userId];
        if (!user) return m.reply('❌ El usuario no está registrado en la base de datos.');

        let moneda = global.moneda || 'Coins';
        let dev = global.dev || 'Bot System';

        // 2. Limpiar números para evitar errores de buffer
        const fNum = (num) => {
            if (!num || num >= 9007199254740991 || num === Infinity) return 'Máximo';
            return num.toLocaleString();
        };

        let name = await conn.getName(userId).catch(_ => 'Usuario');
        let cumpleanos = user.birth || 'No especificado';
        let genero = user.genre || 'No especificado';
        let description = user.description || 'Sin descripción';
        let role = user.role || 'Sin Rango';
        
        let parejaId = user.marry || null;
        let parejaText = 'Nadie';
        let mentions = [userId];

        if (parejaId) {
            let parejaName = await conn.getName(parejaId).catch(_ => 'Usuario');
            parejaText = `@${parejaId.split('@')[0]} (${parejaName})`;
            mentions.push(parejaId);
        }

        // 3. Intentar obtener la imagen, si falla usamos la de respaldo directamente
        let perfil;
        try {
            perfil = await conn.profilePictureUrl(userId, 'image');
        } catch (e) {
            perfil = 'https://files.catbox.moe/xr2m6u.jpg';
        }

        // 4. Texto con el diseño original solicitado
        let profileText = `
「✿」Perfil de @${userId.split('@')[0]}
✦ Edad: ${user.age || 'Desconocida'}
♛ Cumpleaños: ${cumpleanos}
⚥ Género: ${genero}
♡ Casado con: ${parejaText}

✎ Rango: ${role}
☆ Exp: ${fNum(user.exp)}
❖ Nivel: ${fNum(user.level)}

⛁ Coins Cartera: ${fNum(user.coin)} ${moneda}
⛃ Coins Banco: ${fNum(user.bank)} ${moneda}
❁ Premium: ${user.premium ? '✅' : '❌'}

📝 Descripción: ${description}
`.trim();

        // 5. ENVÍO SEGURO: 
        // Primero intentamos enviar con imagen (es lo que garantiza visibilidad)
        // Eliminamos externalAdReply complejo porque es lo que causa que solo el bot lo vea
        await conn.sendMessage(m.chat, { 
            image: { url: perfil }, 
            caption: profileText,
            mentions: mentions,
            contextInfo: {
                mentionedJid: mentions,
                // Solo dejamos lo básico para evitar errores de red
                externalAdReply: {
                    title: `✧ Perfil de ${name} ✧`,
                    body: dev,
                    thumbnailUrl: perfil,
                    mediaType: 1,
                    showAdAttribution: false,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m });

    } catch (err) {
        console.error("FALLO TOTAL:", err);
        // Si todo falla (incluyendo el envío de imagen), enviamos solo texto
        // Esto garantiza que el usuario reciba su respuesta pase lo que pase
        let userErr = global.db.data.users[userId];
        let backupText = `⚠️ Error visual, mostrando datos básicos:\n\nNivel: ${userErr.level}\nExp: ${userErr.exp}\nCartera: ${userErr.coin}`;
        m.reply(backupText);
    }
};

handler.help = ['profile'];
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];

export default handler;
