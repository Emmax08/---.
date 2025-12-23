import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
    const currentYear = new Date().getFullYear()
    
    // Enviamos un mensaje de espera
    m.reply('_Cargando próximos estrenos de anime..._')

    try {
        // Consultamos la API de Jikan para los próximos estrenos (upcoming)
        const response = await axios.get(`https://api.jikan.moe/v4/seasons/upcoming`)
        const animes = response.data.data.slice(0, 12) // Limitamos a 12 resultados

        if (!animes || animes.length === 0) {
            return m.reply(`No se encontraron próximos estrenos para el año ${currentYear}.`)
        }

        let txt = `📅 *PRÓXIMOS ANIMES (${currentYear})*\n\n`

        for (let anime of animes) {
            let titulo = anime.title_english || anime.title
            let temporada = anime.season ? anime.season.toUpperCase() : 'PENDIENTE'
            
            txt += `⭐ *${titulo}*\n`
            txt += `🔹 *Tipo:* ${anime.type || 'TV'}\n`
            txt += `🕒 *Temporada:* ${temporada} ${anime.year || ''}\n`
            txt += `🔗 *Link:* ${anime.url}\n`
            txt += `──────────────────\n\n`
        }

        txt += `*Utiliza ${usedPrefix}anime <nombre> para buscar uno específico.*`

        // Enviamos el mensaje final
        await conn.sendMessage(m.chat, { text: txt }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('❌ Lo siento, hubo un error al obtener la lista de animes.')
    }
}

// Configuración del handler
handler.help = ['animesprox']
handler.tags = ['info', 'entretenimiento']
// Expresión regular para que funcione con . o # según tus prefijos configurados
handler.command = /^(animesprox|proximosanimes|estrenosanime)$/i

export default handler
