import gtts from 'node-gtts'
import { readFileSync, unlinkSync } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Si no hay texto, explicamos cómo usarlo
    if (!text) throw `*⚠️ Ejemplo de uso:*\n\n${usedPrefix + command} es Hola, ¿cómo estás?\n\n*Idiomas:* es (Español), en (Inglés), ja (Japonés), fr (Francés)`

    // Separamos el idioma del mensaje (ej: "es Hola" -> lang: es, mensaje: Hola)
    let lang = text.split(' ')[0]
    let mensaje = text.slice(lang.length).trim()

    // Si el usuario no pone el idioma primero, usamos español por defecto
    if (lang.length !== 2) {
        lang = 'es'
        mensaje = text
    }

    try {
        const tts = gtts(lang)
        const filePath = join(process.cwd(), 'tmp', `${Date.now()}.wav`)
        
        // Guardamos el audio temporalmente
        tts.save(filePath, mensaje, async () => {
            const audio = readFileSync(filePath)
            
            // Enviamos como Nota de Voz (PTT)
            await conn.sendMessage(m.chat, { 
                audio: audio, 
                mimetype: 'audio/mpeg', 
                ptt: true 
            }, { quoted: m })

            // Borramos el archivo temporal para no llenar el hosting
            unlinkSync(filePath)
        })

    } catch (e) {
        console.error(e)
        m.reply('❌ No pude procesar el audio. Asegúrate de usar un código de idioma válido (es, en, jp).')
    }
}

handler.help = ['iavoice']
handler.tags = ['fun']
handler.command = /^(iavoice|tovoz|voz|say)$/i 

export default handler
