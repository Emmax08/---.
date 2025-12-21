import moment from 'moment-timezone';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    let userId;
    if (m.quoted && m.quoted.sender) {
        userId = m.quoted.sender;
    } else {
        userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    }

    let user = global.db.data.users[userId];
    if (!user) return m.reply('❌ Usuario no encontrado en la base de datos.');

    let name = conn.getName(userId);
    let cumpleanos = user.birth || 'No especificado';
    let genero = user.genre || 'No especificado';
    let pareja = user.marry || 'Nadie';
    let description = user.description || 'Sin Descripción';
    let exp = user.exp || 0;
    let nivel = user.level || 0;
    let role = user.role || 'Sin Rango';
    let coins = user.coin || 0;
    let bankCoins = user.bank || 0;
    let moneda = 'Coins'; // Asegura que esta variable exista

    let perfil = await conn.profilePictureUrl(userId, 'image').catch(_ => null);

    let profileText = `
⚽️ *Perfil* ◢@${userId.split('@')[0]}◤
${description}

🐱‍🏍 Edad » ${user.age || 'Desconocida'}
🎉 *Cumpleaños* » ${cumpleanos}
🚻 *Género» ${genero}
💍 *Casado con* » ${pareja}

💫 *Experiencia* » ${exp.toLocaleString()}
📈 *Nivel* » ${nivel}
🔌 *Rango* » ${role}

💎 *Coins Cartera* » ${coins.toLocaleString()} ${moneda}
🎫 *Coins Banco* » ${bankCoins.toLocaleString()} ${moneda}
🔰 *Premium* » ${user.premium ? '✅' : '❌'}
    `.trim();

    // FORMA COMPATIBLE CON TODOS LOS WHATSAPP
    if (perfil) {
        await conn.sendFile(m.chat, perfil, 'profile.jpg', profileText, m, null, {
            mentions: [userId]
        });
    } else {
        // Si no hay imagen de perfil, enviar solo texto
        await conn.reply(m.chat, profileText, m, {
            mentions: [userId]
        });
    }
};

handler.help = ['profile', 'perfil'];
handler.tags = ['rg'];
handler.command = /^(profile|perfil)$/i;

export default handler;