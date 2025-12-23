import Tesseract from 'tesseract.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image/.test(mime)) throw `*⚠️ Responde a una imagen con ${usedPrefix}${command}*`

    // Mensaje de espera
    await conn.sendMessage(m.chat, { text: '⏳ Leyendo imagen...' }, { quoted: m })

    try {
        // DESCARGA: Esta es la forma más compatible en plugins
        let img = await q.download?.()
        if (!img) img = await conn.downloadMediaMessage(q)

        const { data: { text } } = await Tesseract.recognize(img, 'spa+eng')

        if (!text.trim()) throw '❌ No encontré texto.'

        await conn.reply(m.chat, `📖 *TEXTO:* \n\n${text.trim()}`, m)

    } catch (e) {
        console.error(e)
        m.reply('❌ Error al procesar. Verifica que la librería tesseract.js esté instalada.')
    }
}

handler.help = ['ocr']
handler.tags = ['tools']
handler.command = /^(ocr|leer)$/i // Esto acepta .ocr o .leer sin importar mayúsculas

export default handler
