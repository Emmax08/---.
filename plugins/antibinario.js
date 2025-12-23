let handler = async (m, { conn, text, usedPrefix, command, isAdmin, isBotAdmin }) => {
    // 1. LÓGICA DE CONFIGURACIÓN (ON/OFF)
    if (command === 'antibinario' || command === 'antibinarios') {
        if (!m.isGroup) return
        if (!isAdmin) return await conn.reply(m.chat, '🎙️ *Solo los directores de la estación (admins) pueden cambiar esta frecuencia.*', m)

        let chat = global.db.data.chats[m.chat]
        if (!text) return await conn.reply(m.chat, `🎙️ *Uso correcto:*\n*${usedPrefix + command} on*\n*${usedPrefix + command} off*`, m)

        let isEnable = /on|true|enable/i.test(text)
        let isDisable = /off|false|disable/i.test(text)

        if (isEnable) {
            chat.antibinario = true
            await conn.reply(m.chat, `🎙️ 📻 *Sintonía Protegida:* El filtro antibinarios ha sido **ACTIVADO**. ¡Nadie saturará mi señal! ✡️`, m)
        } else if (isDisable) {
            chat.antibinario = false
            await conn.reply(m.chat, `🎙️ 📻 *Señal Abierta:* El filtro antibinarios ha sido **DESACTIVADO**. 🍎`, m)
        }
    }
}

// 2. LÓGICA DE DETECCIÓN (Handler Before)
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return
    
    // Verificamos si existe en la base de datos y si está encendido
    let chat = global.db.data.chats[m.chat]
    if (!chat || !chat.antibinario) return 
    
    // Los admins no son afectados y el bot debe ser admin para borrar
    if (isAdmin || !isBotAdmin) return 

    // Límite de caracteres para considerar un "binario" (5000 caracteres)
    const charLimit = 5000 
    
    if (m.text && m.text.length > charLimit) {
        const aviso = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
✨ *¡ESTÁTICA ELIMINADA!* ✨
━━━━━━━━━━━━━━━━━━━━

¡Qué ruido tan molesto! He limpiado este intento de saturación. La radio debe sonar impecable. 📻

🎙️ *RECUERDA:* Las malas vibras no son bienvenidas en mi programa. ¡JAJAJA! 📻✨`.trim()

        await conn.reply(m.chat, aviso, m)
        await conn.sendMessage(m.chat, { delete: m.key })
    }
    return true
}

handler.help = ['antibinario on/off']
handler.tags = ['admin']
handler.command = /^(antibinario|antibinarios)$/i // Se ajusta a tus prefijos . y #
handler.group = true

export default handler
