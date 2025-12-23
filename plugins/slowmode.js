let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!m.isGroup) return m.reply('*⚠️ Este comando solo sirve en grupos.*')

    // 1. Obtener datos del grupo de forma forzada
    const groupMetadata = await conn.groupMetadata(m.chat).catch(e => ({}))
    const participants = groupMetadata.participants || []
    
    // 2. Limpiar IDs para evitar errores de formato (eliminar :1, :2, etc)
    const userSender = m.sender.split('@')[0] + '@s.whatsapp.net'
    
    // 3. Buscar si eres admin o el creador del bot
    const userAdmin = participants.find(p => p.id === userSender)
    const isAdmin = userAdmin && (userAdmin.admin === 'admin' || userAdmin.admin === 'superadmin')
    
    // TRUCO: Si tú eres el dueño del bot (owner), te deja pasar aunque el bot no te vea como admin
    const isOwner = m.fromMe || global.owner.some(v => v[0] + '@s.whatsapp.net' === m.sender)

    if (!isAdmin && !isOwner) {
        return m.reply('*❌ Error:* No apareces en mi lista de administradores. Intenta darte admin de nuevo o asegúrate de que no tienes el número oculto.')
    }

    if (!text) throw `*⚠️ Uso:* ${usedPrefix}${command} on | off`

    let segundos = text.toLowerCase() === 'on' ? 30 : text.toLowerCase() === 'off' ? 0 : parseInt(text)
    
    if (isNaN(segundos)) throw '*⚠️ Formato inválido. Usa on, off o un número.*'

    try {
        await conn.groupSettingUpdate(m.chat, 'slow_mode', segundos)
        await m.reply(`✅ *Modo lento ${segundos > 0 ? 'activado (' + segundos + 's)' : 'desactivado'}* correctamente.`)
    } catch (e) {
        console.error(e)
        m.reply('*❌ Error:* No pude cambiar el ajuste. ¿Es el bot administrador?')
    }
}

handler.help = ['slowmode on/off']
handler.tags = ['group']
handler.command = ['slowmode', 'modolento']
handler.group = true
handler.botAdmin = true 

export default handler
