let handler = async (m, { text, usedPrefix, command }) => {
    const userId = m.sender;
    if (!global.db.data.users[userId]) global.db.data.users[userId] = {};
    const user = global.db.data.users[userId];

    if (command === 'setmeta') {
        if (!text) return m.reply(`❌ Debes escribir el nombre.\n> Ejemplo: *${usedPrefix + command} ঔৣ⃟▒𝐄𝐌𝐌𝐀𝐗ღೋ*`);

        user.customStickerName = text; // Guardamos el nombre único
        await global.db.write();

        return m.reply(`✅ *Nombre de sticker configurado:*\n"${text}"\n\nAhora todos tus stickers tendrán este nombre.`);
    }

    if (command === 'delmeta') {
        if (!user.customStickerName) return m.reply(`ℹ️ No tienes un nombre personalizado configurado.`);
        
        delete user.customStickerName;
        await global.db.write();
        return m.reply(`🗑️ Se ha restablecido el nombre por defecto.`);
    }
};

handler.help = ['setmeta', 'delmeta'];
handler.tags = ['tools'];
handler.command = ['setmeta', 'delmeta'];
handler.register = true;

export default handler;
