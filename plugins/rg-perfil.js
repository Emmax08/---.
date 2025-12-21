import moment from 'moment-timezone';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    // 1. Identificación del usuario (Prioridad: Citado > Mencionado > Yo)
    let userId = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender);

    try {
        let user = global.db.data.users[userId];
        if (!user) return m.reply('❌ El usuario no está registrado en la base de datos.');

        // 2. Variables de entorno (Moneda y Creador)
        let moneda = global.moneda || 'Coins';
        let dev = global.dev || 'Bot System';

        // 3. Función para limpiar números gigantes/infinitos (Evita que el mensaje se bloquee)
        const formatNum = (num) => {
            if (num >= 9007199254740991 || num === Infinity) return '∞';
            return (num || 0).toLocaleString();
        };

        // 4. Obtención de datos del usuario
        let name = await conn.getName(userId).catch(_ => 'Usuario');
        let cumpleanos = user.birth || 'No especificado';
        let genero = user.genre || 'No especificado';
        let description = user.description || 'Sin descripción';
        let role = user.role || 'Sin Rango';
        
        // Manejo de Pareja
        let parejaId = user.marry || null;
        let parejaText = 'Nadie';
        let mentions = [userId];

        if (parejaId) {
            let parejaName = await conn.getName(parejaId).catch(_ => 'Usuario');
            parejaText = `@${parejaId.split('@')[0]} (${parejaName})`;
            mentions.push(parejaId);
        }

        // 5. Foto de perfil (Con respaldo si falla)
        let perfil = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg');

        // 6. Construcción del Perfil (Diseño Original)
        let profileText = `
「✿」Perfil de @${userId.split('@')[0]}
✦ Edad: ${user.age || 'Desconocida'}
♛ Cumpleaños: ${cumpleanos}
⚥ Género: ${genero}
♡ Casado con: ${parejaText}

✎ Rango: ${role}
☆ Exp: ${formatNum(user.exp)}
❖ Nivel: ${formatNum(user.level)}

⛁ Coins Cartera: ${formatNum(user.coin)} ${moneda}
⛃ Coins Banco: ${formatNum(user.bank)} ${moneda}
❁ Premium: ${user.premium ? '✅' : '❌'}

📝 Descripción: ${description}
`.trim();

        // 7. Envío del Mensaje (Imagen + Texto + Menciones)
        // Usamos imagen directa para garantizar que TODOS vean el mensaje
        await conn.sendMessage(m.chat, { 
            image: { url: perfil }, 
            caption: profileText,
            mentions: mentions,
            contextInfo: {
                mentionedJid: mentions,
                externalAdReply: {
                    title: `✧ Perfil de ${name} ✧`,
                    body: dev,
                    thumbnailUrl: perfil,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: false // En 'false' es más estable para evitar el bug de invisibilidad
                }
            }
        }, { quoted: m });

    } catch (e) {
        console.error("ERROR CRÍTICO EN PERFIL:", e);
        m.reply('⚠️ Hubo un error al generar el perfil visual. Intenta de nuevo o contacta al soporte.');
    }
};

handler.help = ['profile'];
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];

export default handler;
