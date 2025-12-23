import Tesseract from 'tesseract.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image/.test(mime)) throw `*⚠️ Responde a una imagen con ${usedPrefix}${command}*`

    await m.reply('⏳ Leyendo texto, por favor espera...')

    try {
        // Intentar descargar el medio de dos formas diferentes para asegurar compatibilidad
        let img = await q.download?.() 
        if (!img) img = await conn.downloadMediaMessage(q)

        const { data: { text } } = await Tesseract.recognize(img, 'spa+eng')

        if (!text || text.trim().length < 1) throw '❌ No se encontró texto en la imagen.'

        await conn.reply(m.chat, `📖 *TEXTO EXTRAÍDO:* \n\n${text.trim()}`, m)

    } catch (e) {
        console.error(e)
        m.reply('❌ Error: Asegúrate de que instalaste la librería con "npm install tesseract.js"')
    }
}

handler.help = ['ocr']
handler.tags = ['tools']
// Usamos una expresión regular para que el bot lo detecte sí o sí
handler.command = /^(ocr|leer|extraer)$/i 

export default handler
