import fs from 'fs'
import path from 'path'

var handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // Reacción inicial de Alastor
        await m.react('🎙️') 
        conn.sendPresenceUpdate('composing', m.chat)

        const pluginsDir = './plugins'
        const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'))

        let response = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️\n`
        response += `   ✨ *ALASTOR'S SYNTAX SCAN* ✨\n`
        response += `━━━━━━━━━━━━━━━━━━━━\n\n`
        
        let hasErrors = false
        let errorCount = 0

        for (const file of files) {
            try {
                // Forzamos un re-import o chequeo de sintaxis
                // Nota: Algunos entornos requieren un timestamp para evitar el caché del import
                await import(path.resolve(pluginsDir, file) + `?update=${Date.now()}`)
            } catch (error) {
                hasErrors = true
                errorCount++
                const stackLines = error.stack.split('\n')
                const errorLineMatch = stackLines[0].match(/:(\d+):\d+/) 
                const errorLine = errorLineMatch ? errorLineMatch[1] : 'Desconocida'

                response += `🍎 *FALLO EN LA TRANSMISIÓN:* \n`
                response += `> 📂 *Archivo:* ${file}\n`
                response += `> 💬 *Error:* ${error.message}\n`
                response += `> 📍 *Línea:* ${errorLine}\n\n`
            }
        }

        if (!hasErrors) {
            response += `🎶 ¡JAJAJA! ¡Todo está en perfecta sintonía, querido! No hay interferencias en tus archivos de plugins. ¡Sigue sonriendo! ✨`
        } else {
            response += `━━━━━━━━━━━━━━━━━━━━\n`
            response += `⚠️ *RECUENTO:* He encontrado ${errorCount} interferencias. ¡Arréglalas antes de que pierda la paciencia! 📻`
        }

        response += `\n\n🎙️ *RECUERDA:* ¡Nunca estás completamente vestido sin una sonrisa! 📻✨`

        await conn.reply(m.chat, response, m)
        await m.react('✅')
        
    } catch (err) {
        await m.react('❌') 
        await conn.reply(m.chat, `🎙️ 📻 *¡ESTÁTICA!* Ocurrió un error inesperado al escanear las almas: ${err.message}`, m)
    }
}

handler.command = ['detectarsyntax', 'detectar', 'scan']
handler.help = ['detectarsyntax']
handler.tags = ['tools']
handler.rowner = true // Solo el dueño del bot puede usarlo por seguridad

export default handler
