let handler = async (m, { conn, participants, usedPrefix, command, isBotAdmin, isAdmin }) => {
    // 1. Validaciones de Poder (Solo administradores y en grupos)
    if (!m.chat.endsWith('@g.us')) return 
    if (!isAdmin && !m.isOwner) return conn.reply(m.chat, '🎙️ 📻 *¡JAJAJA!* Solo los administradores tienen el privilegio de invocar mi poder de limpieza, querido.', m)
    if (!isBotAdmin) return conn.reply(m.chat, '🎙️ 📻 Necesito ser administrador para poder "reorganizar" a los invitados de este hotel.', m)

    // 2. Determinar quién es el objetivo (por cita o mención)
    let userToKick = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null)
    
    if (!userToKick) {
        return conn.reply(m.chat, `🎙️ 📻 *¿A quién quieres exterminar?* Responde a su mensaje o menciónalo para borrar su historial de 15 minutos y expulsarlo.`, m)
    }

    // Protecciones básicas
    const groupMetadata = await conn.groupMetadata(m.chat)
    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    
    if (userToKick === conn.user.jid) return conn.reply(m.chat, `❌ No puedo borrar mi propia existencia de este chat.`, m)
    if (userToKick === ownerGroup) return conn.reply(m.chat, `❌ El dueño del grupo es intocable, incluso para mí.`, m)

    await m.reply(`🎙️ 📻 *INICIANDO TRANSMISIÓN DE LIMPIEZA...*\n\nBuscando rastros de @${userToKick.split('@')[0]} en los últimos 15 minutos.`, null, { mentions: [userToKick] })

    try {
        // 3. Cargar mensajes del historial (últimos 100-200 mensajes)
        let messages = await conn.loadMessages(m.chat, 200) 
        const fifteenMinsAgo = Date.now() - (15 * 60 * 1000)

        // Filtramos mensajes del usuario objetivo dentro del rango de 15 min
        let toDelete = messages.filter(v => 
            v.key.participant === userToKick && 
            v.messageTimestamp * 1000 > fifteenMinsAgo
        )

        // 4. Ejecución del borrado masivo
        for (let msg of toDelete) {
            await conn.sendMessage(m.chat, { delete: msg.key })
        }

        // 5. Expulsión definitiva
        await conn.groupParticipantsUpdate(m.chat, [userToKick], 'remove')

        // Mensaje de éxito al estilo Alastor
        let textoFinal = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️\n`
        textoFinal += `✨ *EXTERMINACIÓN COMPLETADA* ✨\n`
        textoFinal += `━━━━━━━━━━━━━━━━━━━━\n\n`
        textoFinal += `👤 *OBJETIVO:* @${userToKick.split('@')[0]}\n`
        textoFinal += `🗑️ *RASTROS BORRADOS:* ${toDelete.length} mensajes.\n`
        textoFinal += `🚪 *ESTADO:* Expulsado del recinto.\n\n`
        textoFinal += `🎙️ ¡Qué placer es ver el canal sin estática! ¡Nunca dejes de sonreír! 📻✨`

        await conn.reply(m.chat, textoFinal, m, { mentions: [userToKick] })

    } catch (e) {
        console.error(e)
        // Si hay error en el borrado, procedemos con el ban de todos modos
        await conn.groupParticipantsUpdate(m.chat, [userToKick], 'remove')
        await conn.reply(m.chat, `🎙️ 📻 Hubo una interferencia al borrar los mensajes, pero el invitado ya ha sido retirado del hotel.`, m)
    }
}

handler.help = ['kickall']
handler.tags = ['group']
handler.command = ['kickall', 'banall', 'exterminar'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
