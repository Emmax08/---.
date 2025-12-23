let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*⚠️ Uso correcto:* ${usedPrefix}${command} [tiempo] [mensaje]\n\n*Ejemplo:* ${usedPrefix}${command} 10m sacar el perro`

    // Expresión regular para separar el tiempo del mensaje (ejemplo: 10m, 1h, 30s)
    let [ , time, unit, message ] = text.match(/(\d+)([smh])\s+(.*)/i) || []
    
    if (!time || !unit || !message) throw `*❌ Formato inválido.*\n\nUsa *s* para segundos, *m* para minutos y *h* para horas.\nEjemplo: ${usedPrefix}${command} 5m Hacer la tarea`

    // Convertir todo a milisegundos
    let milliseconds = parseInt(time) * (unit === 's' ? 1000 : unit === 'm' ? 60000 : 3600000)

    // Límite de seguridad (máximo 24 horas para no sobrecargar el servidor)
    if (milliseconds > 86400000) throw '*❌ El tiempo máximo es de 24 horas.*'

    await m.reply(`✅ Recordatorio fijado para dentro de *${time}${unit}*.\nTe avisaré: "${message}"`)

    // Programar la alerta
    setTimeout(async () => {
        let reminderText = `
⏰ *RECORDATORIO* ⏰
────────────────
Hola @${m.sender.split`@` [0]}, me pediste que te recordara:
📌 *"${message}"*
────────────────
`.trim()

        await conn.reply(m.chat, reminderText, m, { mentions: [m.sender] })
    }, milliseconds)
}

handler.help = ['recordatorio']
handler.tags = ['tools']
handler.command = ['recordatorio', 'remind', 'alarm'] 

export default handler
