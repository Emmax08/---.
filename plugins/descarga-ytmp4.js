import fetch from 'node-fetch';

// --- Constantes de Configuración ---
const newsletterJid = '120363422454443738@newsletter';
const newsletterName = '⏤͟͞ू⃪፝͜⁞⟡ 𝐀𝐋𝐀𝐒𝐓𝐎𝐑\'s 𝐒ervice';
const emoji = '🎬'; 

// --- Configuración de la API de Video (XFARR) ---
const XFARR_API_KEY = 'Maria-Kojuo'; 
const XFARR_API_URL = 'https://api.xfarr.com/api/ytmp4'; // Cambiado a ytmp4

var handler = async (m, { conn, args, usedPrefix, command }) => {
    const name = conn.getName(m.sender);

    const contextInfo = {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid,
            newsletterName,
            serverMessageId: -1
        },
        externalAdReply: {
            title: '𝐀𝐋𝐀𝐒𝐓𝐎𝐑: Transmisión Visual. 📺',
            body: `Proyectando video para el/la Proxy ${name}...`,
            thumbnail: global.icono, 
            sourceUrl: global.redes, 
            mediaType: 1,
            renderLargerThumbnail: false
        }
    };

    if (!args[0]) {
        return conn.reply(
            m.chat,
            `${emoji} *Rastro frío, Proxy ${name}.* Necesito un enlace de YouTube para proyectar las imágenes.\n\n_Ejemplo: ${usedPrefix + command} https://youtu.be/KHgllosZ3kA_`,
            m, { contextInfo, quoted: m }
        );
    }

    const youtubeUrl = args[0];

    try {
        if (!youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/)) {
            return conn.reply(
                m.chat,
                `❌ *¡Qué falta de modales! Eso no es un enlace válido de YouTube, Proxy ${name}.*`,
                m, { contextInfo, quoted: m }
            );
        }

        await conn.reply(
            m.chat,
            `🔄 *Ajustando los lentes de la cámara...* Aguarda, Proxy ${name}. Estoy preparando el proyector de cine. 📽️✨`,
            m, { contextInfo, quoted: m }
        );

        const result = await Vid(youtubeUrl);

        if (result && result.url) {
            const downloadURL = result.url;
            const apiUsed = result.api;

            let title = `Video_YT_${apiUsed}`;
            let duration = 'Desconocida';
            let size = 'Desconocido';

            if (apiUsed === 'XFARR' && result.fullResponse?.result) {
                const xfarrResult = result.fullResponse.result;
                title = xfarrResult.title || title;
                duration = xfarrResult.duration || duration;
                size = xfarrResult.size || size;
            }

            const caption = ` 
╭━━━━[ 𝚈𝚃𝙼𝙿𝟺 𝙳𝚎𝚌𝚘𝚍𝚎𝚍 ]━━━━⬣
📌 *Título:* ${title}
📺 *Proyector:* ${apiUsed}
⏱️ *Duración:* ${duration}
📂 *Peso:* ${size}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬣\n_¡Disfruta de la función, Proxy!_ 🍿🎙️`;

            // Enviar archivo de Video (MP4)
            await conn.sendMessage(
                m.chat, {
                    video: { url: downloadURL },
                    mimetype: 'video/mp4',
                    fileName: `${title}.mp4`,
                    caption: caption
                }, { contextInfo, quoted: m }
            );
            
            await m.react("✅");

        } else {
            throw new Error(`Las sombras no pudieron proyectar el video.`);
        }
    } catch (e) {
        console.error(e);
        await m.react("❌");
        await conn.reply(m.chat, `⚠️ *Anomalía detectada, Proxy ${name}.*\nError en la proyección: ${e.message}`, m, { contextInfo, quoted: m });
    }
};

async function Vid(url) {
    if (!global.APIs) throw new Error("Configuración de APIs global no encontrada.");
    
    const xfarrUrl = `${XFARR_API_URL}?url=${encodeURIComponent(url)}&apikey=${XFARR_API_KEY}`;
    
    const apis = [
        { api: 'XFARR', endpoint: xfarrUrl, extractor: res => res.result?.download?.mp4, timeout: 15000 },
        { api: 'Vreden', endpoint: `${global.APIs.vreden.url}/api/v1/download/youtube/video?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download?.url, timeout: 12000 },
        { api: 'Xyro', endpoint: `${global.APIs.xyro.url}/download/youtubemp4?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download, timeout: 12000 }
    ];
    
    for (const config of apis) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);
            const res = await fetch(config.endpoint, { signal: controller.signal }).then(r => r.json());
            clearTimeout(timeoutId);
            const link = config.extractor(res);
            if (link) return { url: link, api: config.api, fullResponse: res };
        } catch (e) {
            console.error(`[FALLO EN API VIDEO] ${config.api}`);
        }
    }
    return null;
}

// Configuración de comandos para VIDEO (MP4)
handler.help = ['ytmp4', 'ytvideo'].map(v => v + ' <url>');
handler.tags = ['descargas'];
handler.command = /^(ytmp4|ytvideo|video|v)$/i; 
handler.register = true;
handler.limit = true;
handler.coin = 5; // Los videos suelen costar más energía/monedas

export default handler;
