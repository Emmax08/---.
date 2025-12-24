let handler = async (m, { conn, participants, usedPrefix, command, isBotAdmin, isAdmin }) => {
    // 1. Validaciones de Poder
    if (!m.chat.endsWith('@g.us')) return 
    if (!isAdmin && !m.isOwner) return conn.reply(m.chat, '🎙️ 📻 *¡JAJAJA!* Solo los administradores pueden invocar mi poder de limpieza, querido.', m)
    if (!isBotAdmin) return conn.reply(m.chat, '🎙️ 📻 Necesito ser administrador para borrar rastros y expulsar invitados.', m)

    // 2. Determinar el objetivo (por cita de mensaje)
    if (!m.quoted) return conn.reply(m.chat, `🎙️ 📻 *¿A quién debo exterminar?* Por favor, cita un mensaje de la persona para borrar su historial y expulsarla.`, m)
    
    let userToKick = m.quoted.sender
    const MESSAGES_TO_DELETE = 50 // Límite de mensajes a borrar

    // Protecciones
    const groupMetadata = await conn.groupMetadata(m.chat)
    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const ownerBot = (global.owner?.[0]?.[0] || '') + '@s.whatsapp.net'

    if (userToKick === conn.user.jid) return conn.reply(m.chat, `❌ No puedo eliminarme a mí mismo.`, m)
    if (userToKick === ownerGroup || userToKick === ownerBot) return conn.reply(m.chat, `❌ Este usuario es demasiado poderoso para ser borrado.`, m)

    await m.reply(`🎙️ 📻 *INICIANDO LIMPIEZA...*\n\nBorrando los últimos mensajes de @${userToKick.split('@')[0]} y procediendo a su expulsión.`, null, { mentions: [userToKick] })

    try {
        // 3. Carga de mensajes para borrar
        // En Baileys, esto busca en los mensajes cargados en la sesión actual
        let messages = await conn.loadMessages(m.chat, 100) 
        let deletedCount = 0

        for (let msg of messages) {
            // Verificamos que el mensaje sea del usuario citado
            if (msg.key && (msg.key.participant === userToKick || msg.participant === userToKick)) {
                await conn.sendMessage(m.chat, { delete: msg.key })
                deletedCount++
                if (deletedCount >= MESSAGES_TO_DELETE) break
            }
        }

        // 4. Expulsión
        await conn.groupParticipantsUpdate(m.chat, [userToKick], 'remove')

        // 5. Respuesta Final Estilo Alastor
        let textoFinal = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️\n`
        textoFinal += `✨ *USUARIO EXTERMINADO* ✨\n`
        textoFinal += `━━━━━━━━━━━━━━━━━━━━\n\n`
        textoFinal += `👤 *OBJETIVO:* @${userToKick.split('@')[0]}\n`
        textoFinal += `🗑️ *MENSAJES BORRADOS:* ${deletedCount}\n`
        textoFinal += `🚪 *ESTADO:* Eliminado del hotel.\n\n`
        textoFinal += `🎙️ ¡Qué placer es el silencio! ¡Nunca dejes de sonreír! 📻✨`

        await conn.reply(m.chat, textoFinal, m, { mentions: [userToKick] })

    } catch (e) {
        console.error(e)
        // Si el borrado falla por falta de mensajes en memoria, al menos lo saca
        await conn.groupParticipantsUpdate(m.chat, [userToKick], 'remove')
        await conn.reply(m.chat, `🎙️ 📻 Hubo interferencia con los mensajes, pero el usuario ha sido expulsado exitosamente.`, m)
    }
}

handler.help = ['kickdel']
handler.tags = ['group']
handler.command = ['kickdel', 'kickdelete', 'sacaryborrar'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
