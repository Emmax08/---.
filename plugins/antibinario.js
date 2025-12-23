let handler = m => m

handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return
    
    // Verificamos si la función está encendida en este grupo
    let chat = global.db.data.chats[m.chat]
    if (!chat.antibinario) return // Si está en 'off', no hace nada
    
    if (isAdmin || !isBotAdmin) return 

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

export default handler
