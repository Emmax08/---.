import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*⚠️ Ejemplo de uso:*\n\n${usedPrefix + command} Hola como estas?`

    let lang = 'es' // Idioma por defecto
    let textToSay = text

    // Si quieres cambiar idioma (ej: .voz en Hello)
    if (text.startsWith('en ')) {
        lang = 'en'
        textToSay = text.slice(3)
    }

    try {
        // API directa de Google Translate TTS
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textToSay)}&tl=${lang}&client=tw-ob`
        
        await conn.sendMessage(m.chat, { 
            audio: { url: url }, 
            mimetype: 'audio/mp4', 
            ptt: true 
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('❌ Error al generar el audio.')
    }
}

handler.help = ['iavoice']
handler.tags = ['fun']
handler.command = /^(iavoice|tovoz|voz|say)$/i 

export default handler
