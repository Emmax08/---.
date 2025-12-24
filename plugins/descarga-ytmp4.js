import { youtubeSearch } from '@bochilteam/scraper'
import yts from 'yt-search'
import fetch from 'node-fetch'

const newsletterJid = '120363422454443738@newsletter'
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ 𝐀𝐋𝐀𝐒𝐓𝐎𝐑\'s 𝐒ervice'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    const name = conn.getName(m.sender)
    
    if (!text) throw `🎙️ *¡Falta la señal visual, Proxy ${name}!* Necesito un nombre o un enlace de YouTube.\n\n_Ejemplo: ${usedPrefix + command} Stayed Gone Video_`

    const contextInfo = {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: { newsletterJid, newsletterName, serverMessageId: -1 },
        externalAdReply: {
            title: '𝐀𝐋𝐀𝐒𝐓𝐎𝐑: Cinema Infernal 🎬',
            body: `Proyectando para: ${name}`,
            thumbnail: global.icono,
            mediaType: 1,
            sourceUrl: global.redes
        }
    }

    try {
        await m.reply(`🔄 *Ajustando el proyector...* Buscando la frecuencia visual para ti, Proxy. ✨`)

        // Busca por nombre o link
        const search = await yts(text)
        const video = search.all[0]
        if (!video) throw '¡Oh, qué tragedia! No encontré ninguna transmisión.'

        const { title, thumbnail, timestamp, views, url } = video

        // Servidor de respaldo 1
        const res = await fetch(`https://api.lolhuman.xyz/api/ytvideo2?apikey=${global.lolkeysapi || 'GataDios'}&url=${url}`)
        const json = await res.json()

        if (!json.result || !json.result.link) {
            throw new Error('Estática en la señal')
        }

        const downloadUrl = json.result.link
        const size = json.result.size || 'Desconocido'

        const caption = `╭━━━━[ 𝚈𝚃𝙼𝙿𝟺: 𝚅𝚒𝚜𝚒𝚘́𝚗 𝚂𝚎𝚐𝚞𝚛𝚊 ]━━━━⬣\n📌 *Título:* ${title}\n⏱️ *Duración:* ${timestamp}\n📂 *Peso:* ${size}\n👁️ *Vistas:* ${views.toLocaleString()}\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣\n\n_Disfruta del show... ¡La imagen es impecable!_ 🎙️✨`

        await conn.sendMessage(m.chat, { 
            video: { url: downloadUrl }, 
            caption: caption,
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`
        }, { quoted: m, contextInfo })

        await m.react("✅")

    } catch (e) {
        console.error(e)
        await m.react("❌")
        await conn.reply(m.chat, `⚠️ *Anomalía detectada, Proxy ${name}.*\n\nLa transmisión se perdió en la estática. ¡Intenta con otro título! 📻`, m, { contextInfo })
    }
}

handler.help = ['ytmp4 <nombre/link>']
handler.tags = ['descargas']
handler.command = /^(ytmp4|video|v)$/i // Esto asegura que responda a .ytmp4, .video o .v
handler.register = true

export default handler
