import axios from 'axios'
import { load } from 'cheerio'

let handler = async (m, { conn, usedPrefix, command }) => {
  // Mostramos un mensaje de espera
  m.reply('_Buscando las últimas noticias..._')

  try {
    // Usamos el feed de Google News para obtener noticias globales en español
    const response = await axios.get('https://news.google.com/rss/search?q=actualidad&hl=es-419&gl=AR&ceid=AR:es-419')
    const html = response.data
    
    // Extraemos los títulos y links (usando regex simple para RSS o un parser)
    const titles = html.match(/<title>(.*?)<\/title>/g).slice(1, 11) // Tomamos las primeras 10
    const links = html.match(/<link>(.*?)<\/link>/g).slice(1, 11)

    if (!titles || titles.length === 0) throw 'No se encontraron noticias en este momento.'

    let report = `* 🗞️ ÚLTIMAS NOTICIAS 🗞️*\n\n`
    
    titles.forEach((title, i) => {
      // Limpiamos las etiquetas XML
      let cleanTitle = title.replace('<title>', '').replace('</title>', '')
      let cleanLink = links[i].replace('<link>', '').replace('</link>', '')
      
      report += `*${i + 1}.* ${cleanTitle}\n`
      report += `🔗 _Más info:_ ${cleanLink}\n\n`
    })

    report += `*Utiliza ${usedPrefix}${command} para actualizar.*`

    // Enviamos el mensaje final
    await conn.reply(m.chat, report, m)

  } catch (e) {
    console.error(e)
    m.reply('❌ Hubo un error al obtener las noticias. Inténtalo más tarde.')
  }
}

// Configuración del comando con tus prefijos guardados
handler.help = ['news']
handler.tags = ['info']
handler.command = /^(news|noticias)$/i // Funciona con .news o .noticias

export default handler
