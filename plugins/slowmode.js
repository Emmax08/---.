let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!m.isGroup) throw '*⚠️ Este comando solo sirve en grupos.*'
    
    // Verificamos si es admin el que lo usa
    let participants = (await conn.groupMetadata(m.chat)).participants
    let isAdmin = participants.find(p => p.id === m.sender)?.admin
    if (!isAdmin) throw '*❌ Solo los administradores pueden usar este comando.*'

    if (!text) throw `*⚠️ Uso correcto:* ${usedPrefix}${command} [on/off]\n\n*Ejemplo:* ${usedPrefix}${command} on`

    let segundos;
    if (text.toLowerCase() === 'on') {
        segundos = 30; // Tiempo por defecto cuando se activa
    } else if (text.toLowerCase() === 'off') {
        segundos = 0; // Desactivado
    } else if (!isNaN(text)) {
        segundos = parseInt(text); // Permite también poner un número personalizado
    } else {
        throw `*⚠️ Opción inválida.* Usa *${usedPrefix}${command} on* o *off*.`
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

        if (segundos > 0) {
            await m.reply(`✅ *Modo lento activado:* Los miembros deben esperar *${segundos} segundos* entre mensajes.`)
        } else {
            await m.reply(`✅ *Modo lento desactivado.*`)
        }

    } catch (e) {
        console.error(e)
        throw '*❌ Error:* El bot debe ser administrador para cambiar esta configuración.'
    }
}

handler.help = ['slowmode on/off']
handler.tags = ['group']
handler.command = ['slowmode', 'modolento']
handler.group = true
handler.botAdmin = true 

export default handler
