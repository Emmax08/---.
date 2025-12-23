let handler = async (m, { conn, text, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat]
    if (!text) throw `*⚠️ Uso correcto:* ${usedPrefix}${command} [on/off]\n\n*Ejemplo:* ${usedPrefix}${command} on`

    if (text === 'on') {
        chat.antiviewonce = true
        m.reply('✅ *Antiviewonce activado:* Ahora recuperaré los mensajes de una sola vista en este grupo.')
    } else if (text === 'off') {
        chat.antiviewonce = false
        m.reply('❌ *Antiviewonce desactivado:* Ya no recuperaré los mensajes de una sola vista.')
    } else {
        throw `*⚠️ Opción inválida.* Usa *on* para activar o *off* para desactivar.`
    }
}

// Esta es la parte que escucha los mensajes constantemente
handler.before = async function (m, { conn }) {
    let chat = global.db.data.chats[m.chat]
    if (!chat || !chat.antiviewonce) return // Si está en 'off' o no existe, no hace nada

    let q = m.quoted ? m.quoted : m
    if (m.msg && m.msg.viewOnce) {
        try {
            let buffer = await m.download()
            let cap = `📌 *ANTIVIEWONCE RECUPERADO*\n👤 *De:* @${m.sender.split`@` [0]}`.trim()

            if (/image/.test(m.msg.mimetype)) {
                await conn.sendFile(m.chat, buffer, 'error.jpg', cap, m, false, { mentions: [m.sender] })
            } else if (/video/.test(m.msg.mimetype)) {
                await conn.sendFile(m.chat, buffer, 'error.mp4', cap, m, false, { mentions: [m.sender] })
            }
        } catch (e) {
            console.error(e)
        }
    }
}

handler.help = ['antiviewonce [on/off]']
handler.tags = ['group']
handler.command = ['antiviewonce', 'antiver'] // Comandos para activar/desactivar
handler.admin = true // Solo los admins pueden cambiar esta configuración

export default handler
