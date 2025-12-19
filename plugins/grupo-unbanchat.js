let handler = async (m, { conn, usedPrefix, command, args, isOwner, isROwner, isAdmin }) => {
  let chat = global.db.data.chats[m.chat];
  let bot = global.db.data.settings[conn.user.jid] || {};
  let type = command.toLowerCase();

  // --- 1. APAGADO GLOBAL (Nivel: Rowner/Owner) ---
  if (type === 'botglobal') {
    if (!isROwner && !isOwner) return global.dfail('rowner', m, conn);
    
    if (args[0] === 'off') { // "off" para apagar el bot (activar la restricción global)
      bot.globalapagado = true;
      return conn.reply(m.chat, `⚠️ *BOT APAGADO GLOBALMENTE*\nEl bot ahora solo responderá a sus dueños (Owner/Rowner) en todos los chats.`, m);
    } else if (args[0] === 'on') { // "on" para prender el bot (quitar la restricción)
      bot.globalapagado = false;
      return conn.reply(m.chat, `✅ *BOT ACTIVADO GLOBALMENTE*\nEl bot vuelve a estar disponible para todos los usuarios.`, m);
    } else {
      return conn.reply(m.chat, `*¿Cómo usar?*\n> ${usedPrefix + command} off (Apagar bot global)\n> ${usedPrefix + command} on (Encender bot global)`, m);
    }
  }

  // --- 2. BLOQUEO LOCAL DE OWNER (Nivel: Rowner/Owner) ---
  if (type === 'botlock') {
    if (!isROwner && !isOwner) return global.dfail('rowner', m, conn);
    
    if (args[0] === 'off') {
      chat.isBotLocked = true;
      chat.isBanned = true; // Desactivamos el bot también
      return conn.reply(m.chat, `🔒 *BLOQUEO DE SEGURIDAD*\nEl bot se ha apagado en este grupo. Los administradores NO podrán encenderlo.`, m);
    } else if (args[0] === 'on') {
      chat.isBotLocked = false;
      return conn.reply(m.chat, `🔓 *BLOQUEO RETIRADO*\nLos administradores ahora pueden volver a usar el comando *${usedPrefix}bot*.`, m);
    } else {
      return conn.reply(m.chat, `*¿Cómo usar?*\n> ${usedPrefix + command} off (Bloquear grupo)\n> ${usedPrefix + command} on (Desbloquear grupo)`, m);
    }
  }

  // --- 3. BOT ESTÁNDAR (Nivel: Admins/Owner) ---
  if (type === 'bot') {
    // Si el owner bloqueó el bot, el admin no tiene poder
    if (chat.isBotLocked && !isOwner && !isROwner) {
      return conn.reply(m.chat, `❌ Este grupo tiene un bloqueo de seguridad impuesto por el Owner y no puede ser modificado por administradores.`, m);
    }

    if (!(isAdmin || isOwner)) return global.dfail('admin', m, conn);

    if (args[0] === 'off') {
      chat.isBanned = true;
      return conn.reply(m.chat, `✐ Has *desactivado* a ${botname} en este grupo.`, m);
    } else if (args[0] === 'on') {
      chat.isBanned = false;
      return conn.reply(m.chat, `✐ Has *activado* a ${botname} en este grupo.`, m);
    } else {
      const estado = chat.isBanned ? '✗ Desactivado' : '✓ Activado';
      return conn.reply(m.chat, `「✦」Estado actual: *${estado}*\n\nUsa:\n> *${usedPrefix}bot on*\n> *${usedPrefix}bot off*`, m);
    }
  }
};

handler.help = ['bot', 'botlock', 'botglobal'];
handler.tags = ['owner', 'grupo'];
handler.command = ['bot', 'botlock', 'botglobal'];

export default handler;
