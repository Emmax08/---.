import { youtubeSearch } from '@bochilteam/scraper'
import yts from 'yt-search'
// Nota: Asegúrate de tener instaladas las librerías necesarias en tu bot

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*¡Falta la melodía, querido!* 🎙️\n\nPor favor, proporciona un enlace de YouTube o el nombre de una canción.\nEjemplo: ${usedPrefix + command} Hazbin Hotel Stayed Gone`

    try {
        // Alastor anuncia el inicio de la función
        await m.reply(`*¡Sintonizando la frecuencia correcta!* 📻\n\nBuscando tu solicitud en el éter... por favor, espera un momento mientras preparo el gramófono. ✨`)

        const search = await yts(text)
        const vid = search.all[0]
        if (!vid) throw '¡Oh, qué tragedia! No he podido encontrar esa sintonía.'

        const { title, thumbnail, timestamp, views, url } = vid
        const audioUrl = `https://api.lolhuman.xyz/api/ytaudio2?apikey=GataDios&url=${url}` // Ejemplo usando una API común en bots

        let report = `🎙️ *¡ESPECTÁCULO MUSICAL!* 🎙️\n\n` +
                     `📻 *Título:* ${title}\n` +
                     `⏱️ *Duración:* ${timestamp}\n` +
                     `👁️ *Vistas:* ${views}\n` +
                     `🔗 *Enlace:* ${url}\n\n` +
                     `_Enviando el audio... ¡Sonríe, el show es mejor con música!_`

        await conn.sendMessage(m.chat, { 
            image: { url: thumbnail }, 
            caption: report 
        }, { quoted: m })

        // Envío del archivo de audio
        await conn.sendMessage(m.chat, { 
            audio: { url: audioUrl }, 
            mimetype: 'audio/mp4', 
            fileName: `${title}.mp3` 
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        throw `*¡Vaya, parece que hay estática en la señal!* 🎙️\nNo pude procesar tu descarga. Inténtalo de nuevo más tarde.`
    }
}

handler.help = ['mp3', 'play'].map(v => v + ' <texto/link>')
handler.tags = ['descargas']
handler.command = /^(mp3|play|audio|ytmp3)$/i
handler.group = true // Activado en grupos

export default handler
