import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Verificamos si el usuario ingresó un término de búsqueda
  if (!text) throw `*¡Faltó el tema!* 🔍\nUso correcto: ${usedPrefix + command} [término]\nEjemplo: *${usedPrefix + command} Nikola Tesla*`;

  try {
    // Realizamos la búsqueda en la Wikipedia en español
    const response = await axios.get(`https://es.wikipedia.org/wiki/${encodeURIComponent(text)}`);
    const $ = cheerio.load(response.data);
    
    // Extraemos el título y los párrafos del contenido
    let titulo = $('#firstHeading').text();
    let contenido = [];
    
    $('#mw-content-text p').each((i, el) => {
      let p = $(el).text().trim();
      if (p.length > 0) contenido.push(p);
    });

    // Tomamos el primer párrafo (resumen principal)
    let resumen = contenido[0] || "No se encontró un resumen detallado.";

    let txt = `📚 *WIKIPEDIA* 📚\n\n`;
    txt += `📌 *Título:* ${titulo}\n\n`;
    txt += `📖 *Resumen:* ${resumen}\n\n`;
    txt += `🔗 *Enlace:* https://es.wikipedia.org/wiki/${encodeURIComponent(text)}`;

    // Enviamos la respuesta al chat
    await conn.sendMessage(m.chat, { text: txt }, { quoted: m });

  } catch (e) {
    // Manejo de error si la página no existe
    console.error(e);
    m.reply(`❌ No se encontró información sobre "${text}". Intenta con algo más específico.`);
  }
};

// Configuración de los disparadores (Prefix . y #)
handler.help = ['wiki [tema]'];
handler.tags = ['herramientas'];
handler.command = /^(wiki|wikipedia)$/i; // Se activa con .wiki o #wiki

export default handler;
