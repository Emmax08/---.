import Tesseract from 'tesseract.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    // 1. Verificamos si el usuario respondió a una imagen o envió una con el comando
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image/.test(mime)) throw `*⚠️ Responde a una imagen o envíala con el comando ${usedPrefix}${command} para leer su contenido.*`

    await m.reply('⏳ Leyendo el texto de la imagen... Esto puede tardar unos segundos.')

    try {
        // 2. Descargamos la imagen del mensaje
        let img = await q.download()

        // 3. Procesamos la imagen con Tesseract (idioma español + inglés)
        const { data: { text } } = await Tesseract.recognize(img, 'spa+eng', {
            // logger: m => console.log(m) // Opcional: para ver el progreso en consola
        })

        // 4. Verificamos si se encontró texto
        if (!text || text.trim().length === 0) {
            return m.reply('❌ No pude encontrar ningún texto legible en esta imagen.')
        }

        let respuesta = `
📖 *TEXTO EXTRAÍDO* 📖
────────────────
${text.trim()}
────────────────
`.trim()

        await m.reply(respuesta)

    } catch (e) {
        console.error(e)
        throw `*❌ Error:* Ocurrió un fallo al procesar la imagen. Asegúrate de que la foto sea clara.`
    }
}

handler.help = ['ocr']
handler.tags = ['tools']
handler.command = ['ocr', 'leer', 'extraer'] 

export default handler
