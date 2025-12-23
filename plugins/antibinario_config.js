let handler = async (m, { conn, text, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat]
    let isEnable = /true|enable|(on)/i.test(text)
    let isDisable = /false|disable|(off)/i.test(text)

    if (!text) return await conn.reply(m.chat, `🎙️ *¿Qué deseas hacer con la frecuencia?*\n\nUso correcto:\n*${usedPrefix + command} on*\n*${usedPrefix + command} off*`, m)

    if (isEnable) {
        chat.antibinario = true
        await conn.reply(m.chat, `🎙️ 📻 *Sintonía Protegida:* El filtro antibinarios ha sido **ACTIVADO**. ¡Nadie saturará mi señal! ✡️`, m)
    } else if (isDisable) {
        chat.antibinario = false
        await conn.reply(m.chat, `🎙️ 📻 *Señal Abierta:* El filtro antibinarios ha sido **DESACTIVADO**. Bajo su propio riesgo, pecadores... 🍎`, m)
    }
}

handler.help = ['antibinario on/off']
handler.tags = ['admin']
handler.command = /^(antibinario|antibinarios)$/i
handler.admin = true // Solo admins del grupo pueden usarlo
handler.group = true

export default handler
