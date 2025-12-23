let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. Verificación básica
    if (!m.isGroup) return m.reply('*⚠️ Este comando solo sirve en grupos.*')

    // 2. Obtener admins de forma ultra compatible
    const groupMetadata = await conn.groupMetadata(m.chat)
    const participants = groupMetadata.participants
    const admins = participants.filter(p => p.admin).map(p => p.id)
    const isBotAdmin = admins.includes(conn.user.jid.split(':')[0] + '@s.whatsapp.net')
    const isAdmin = admins.includes(m.sender)

    if (!isAdmin) return m.reply('*❌ Error: Solo los administradores pueden usar este comando.*')
    if (!isBotAdmin) return m.reply('*❌ El bot necesita ser admin para activar el modo lento.*')

    // 3. Lógica de encendido/apagado
    let segundos = 0
    if (text.toLowerCase() === 'on') {
        segundos = 30
    } else if (text.toLowerCase() === 'off') {
        segundos = 0
    } else if (!isNaN(text) && text !== '') {
        segundos = parseInt(text)
    } else {
        return m.reply(`*⚠️ Uso correcto:* ${usedPrefix}${command} on | off`)
    }

    try {
        // Enviar la orden a WhatsApp
        await conn.groupSettingUpdate(m.chat, 'slow_mode', segundos)
        
        await m.reply(`✅ *Modo lento ${segundos > 0 ? 'activado (' + segundos + 's)' : 'desactivado'}* con éxito.`)
    } catch (e) {
        console.log("ERROR EN SLOWMODE:", e)
        // Si falla la función anterior, intentamos con el método de consulta manual
        try {
            await conn.query({
                tag: 'iq',
                attrs: { to: m.chat, type: 'set', xmlns: 'w:g2' },
                content: [{ tag: 'slow_mode', attrs: { seconds: segundos } }]
            })
            await m.reply(`✅ *Modo lento ${segundos > 0 ? 'activado' : 'desactivado'}* (Método alterno).`)
        } catch (err) {
            m.reply('*❌ Error crítico:* Tu versión de la librería de WhatsApp no soporta cambiar el modo lento o el bot no tiene permisos suficientes.')
        }
    }
}

handler.help = ['slowmode on/off']
handler.tags = ['group']
handler.command = ['slowmode', 'modolento']
handler.group = true

export default handler
