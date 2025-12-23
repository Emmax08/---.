let handler = async (m, { conn, text, usedPrefix, command, participants }) => {
    if (!m.isGroup) throw '*⚠️ Este comando solo sirve en grupos.*'
    
    // 1. Obtenemos la lista de admins de forma más segura
    const admins = participants.filter(p => p.admin !== null).map(p => p.id)
    
    // 2. Verificamos si el que escribe es admin o el dueño del bot
    const esAdmin = admins.includes(m.sender)
    const esOwner = global.opts['owner'] || [conn.user.jid].includes(m.sender) // Ajuste según tu base

    if (!esAdmin && !esOwner) throw '*❌ Error: Solo los administradores pueden usar este comando.*'

    if (!text) throw `*⚠️ Uso correcto:* ${usedPrefix}${command} [on/off]`

    let segundos;
    if (text.toLowerCase() === 'on') {
        segundos = 30; 
    } else if (text.toLowerCase() === 'off') {
        segundos = 0; 
    } else if (!isNaN(text)) {
        segundos = parseInt(text);
    } else {
        throw `*⚠️ Usa:* ${usedPrefix}${command} on | off`
    }

    try {
        await conn.query({
            tag: 'iq',
            attrs: {
                to: m.chat,
                type: 'set',
                xmlns: 'w:g2',
            },
            content: [{
                tag: 'slow_mode',
                attrs: {
                    seconds: segundos
                }
            }]
        })

        await m.reply(`✅ *Modo lento ${segundos > 0 ? 'activado (' + segundos + 's)' : 'desactivado'}* con éxito.`)

    } catch (e) {
        console.error(e)
        throw '*❌ Error:* Asegúrate de que el bot sea administrador del grupo.'
    }
}

handler.help = ['slowmode on/off']
handler.tags = ['group']
handler.command = ['slowmode', 'modolento']
handler.group = true
handler.botAdmin = true 

export default handler
