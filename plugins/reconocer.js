import axios from 'axios'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
    // Verificamos si el usuario respondió a un audio o video
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/audio|video/.test(mime)) throw `*¡Faltó el archivo!* 🎵\nResponde a un audio o video con el comando *${usedPrefix + command}*`

    await m.reply('✨ Escuchando... analizando audio con AudD API.')

    try {
        // Descargamos el archivo multimedia
        let media = await q.download()
        let ext = mime.split('/')[1]
        
        // Configuración de la petición a AudD
        let formData = new FormData()
        formData.append('file', media, { filename: `audio.${ext}` })
        formData.append('api_token', '2fbeae4aafbf31398a3b237965772403')
        formData.append('return', 'apple_music,spotify')

        const { data } = await axios.post('https://api.audd.io/', formData, {
            headers: formData.getHeaders(),
            timeout: 30000 // 30 segundos de espera máxima
        })

        if (data.status === 'error') throw data.error.error_message
        if (!data.result) throw '❌ No pude identificar la canción. Asegúrate de que el audio sea claro y dure al menos 5 segundos.'

        let res = data.result
        let txt = `🎧 *RESULTADO DEL RECONOCIMIENTO* 🎧\n\n`
        txt += `📌 *Título:* ${res.title}\n`
        txt += `👤 *Artista:* ${res.artist}\n`
        txt += `💿 *Álbum:* ${res.album || 'Desconocido'}\n`
        txt += `📅 *Lanzamiento:* ${res.release_date || 'Sin fecha'}\n\n`
        
        if (res.spotify) txt += `🟢 *Spotify:* ${res.spotify.external_urls.spotify}\n`
        if (res.apple_music) txt += `🍎 *Apple Music:* ${res.apple_music.url}\n`

        // Intentamos obtener la imagen de la carátula
        let cover = res.apple_music?.artwork?.url.replace('{w}x{h}', '500x500') || null

        if (cover) {
            await conn.sendMessage(m.chat, { image: { url: cover }, caption: txt }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
        }

    } catch (e) {
        console.error(e)
        m.reply(`❌ *Error:* ${e.message || 'Ocurrió un problema técnico al procesar el audio.'}`)
    }
}

handler.help = ['reconocer']
handler.tags = ['herramientas']
handler.command = /^(reconocer|shazam|whatmusic)$/i // Funciona con . o #

export default handler
