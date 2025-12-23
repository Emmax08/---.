// plugins.js - Comando .animesprox o #animesprox

const axios = require('axios');

async function handleCommand(client, message) {
    const text = message.body;
    
    // Verificamos si el mensaje empieza con .animesprox o #animesprox
    if (text.startsWith('.animesprox') || text.startsWith('#animesprox')) {
        const currentYear = new Date().getFullYear();
        
        try {
            // Consultamos la API de Jikan para la temporada actual/próxima
            // 'upcoming' nos trae los animes que están por salir
            const response = await axios.get(`https://api.jikan.moe/v4/seasons/upcoming`);
            const animes = response.data.data.slice(0, 10); // Limitamos a los 10 más populares

            if (!animes || animes.length === 0) {
                return client.sendMessage(message.from, `No encontré próximos estrenos para el ${currentYear}.`);
            }

            let responseText = `📅 *Próximos Estrenos de Anime - ${currentYear}*\n\n`;

            animes.forEach((anime, index) => {
                const title = anime.title_latin-american || anime.title;
                const type = anime.type || 'TV';
                const date = anime.aired.string || 'Por anunciar';
                
                responseText += `*${index + 1}. ${title}*\n`;
                responseText += `🔹 Tipo: ${type}\n`;
                responseText += `📅 Fecha: ${date}\n`;
                responseText += `🔗 Más info: ${anime.url}\n\n`;
            });

            responseText += `_Fuente: MyAnimeList (vía Jikan API)_`;

            await client.sendMessage(message.from, responseText);

        } catch (error) {
            console.error("Error al obtener animes:", error);
            await client.sendMessage(message.from, "❌ Hubo un error al conectar con la base de datos de anime.");
        }
    }
}

module.exports = { handleCommand };
