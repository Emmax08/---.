import PDFDocument from 'pdfkit'

let handler = async (m, { conn, usedPrefix, command }) => {
    // 1. Verificamos si hay una imagen (enviada o citada)
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!/image/.test(mime)) throw `*❌ Debes etiquetar o enviar una imagen con el comando ${usedPrefix}${command}*`

    await m.reply('⏳ Convirtiendo imagen a PDF... por favor espera.')

    try {
        // 2. Descargamos la imagen
        let img = await q.download()

        // 3. Configuración del PDF
        let bufs = []
        let doc = new PDFDocument({ margin: 0, size: 'A4' })

        doc.on('data', data => bufs.push(data))
        doc.on('end', async () => {
            let buf = Buffer.concat(bufs)

            // 4. Envío del archivo final
            await conn.sendMessage(m.chat, { 
                document: buf, 
                mimetype: 'application/pdf', 
                fileName: `Archivo_${Date.now()}.pdf` 
            }, { quoted: m })
        })

        // Dibujamos la imagen centrada y ajustada al tamaño A4
        doc.image(img, 0, 0, { 
            fit: [595.28, 841.89], 
            align: 'center', 
            valign: 'center' 
        })
        
        doc.end()

    } catch (e) {
        console.error(e)
        throw '❌ Ocurrió un error inesperado al generar el PDF.'
    }
}

handler.help = ['pdf']
handler.tags = ['tools']
handler.command = ['pdf', 'topdf', 'aimagenpdf'] 

export default handler
