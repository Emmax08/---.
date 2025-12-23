import PDFDocument from 'pdfkit'
import { sticker } from '../lib/sticker.js' // Algunos bots requieren importar librerías de medios

let handler = async (m, { conn, usedPrefix, command }) => {
    // 1. Verificamos si el usuario respondió a una imagen o envió una imagen con el comando
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image/.test(mime)) throw `*❌ Debes responder a una imagen o enviarla con el comando ${usedPrefix}${command}*`

    await m.reply('⏳ Generando documento PDF... por favor espera.')

    try {
        // 2. Descargamos la imagen en memoria
        let img = await q.download()
        
        // 3. Creamos el PDF
        let bufs = []
        let doc = new PDFDocument({ margin: 0, size: 'A4' })

        doc.on('data', data => bufs.push(data))
        doc.on('end', async () => {
            let buf = Buffer.concat(bufs)
            
            // 4. Enviamos el PDF al chat
            await conn.sendMessage(m.chat, { 
                document: buf, 
                mimetype: 'application/pdf', 
                fileName: `documento_${m.sender.split('@')[0]}.pdf` 
            }, { quoted: m })
        })

        // Ajustamos la imagen para que quepa en la página (puedes cambiar los valores de width/height)
        doc.image(img, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' })
        doc.end()

    } catch (e) {
        console.error(e)
        throw '❌ Ocurrió un error al convertir la imagen a PDF.'
    }
}

handler.help = ['pdf']
handler.tags = ['tools']
handler.command = ['pdf', 'topdf'] // Responde a .pdf o .topdf

export default handler
