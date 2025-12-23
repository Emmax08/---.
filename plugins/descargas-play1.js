import fetch from "node-fetch";
import { ogmp3 } from '../lib/youtubedl.js';
import yts from "yt-search";
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SIZE_LIMIT_MB = 100;
const newsletterJid = '120363406360158608@newsletter';
const newsletterName = '🎙️ 𝐀𝐋𝐀𝐒𝐓𝐎𝐑 𝐑𝐀𝐃𝐈𝐎 𝐒𝐇𝐎𝐖';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const name = conn.getName(m.sender);
  args = args.filter(v => v?.trim());

  // Configuración de la estética "Alastor"
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
      title: '📻 ⏤͟͟͞͞𝐀𝐋𝐀𝐒𝐓𝐎𝐑 𝐒𝐄𝐑𝐕𝐈𝐂𝐄',
      body: `🎙️ El espectáculo está por comenzar, ${name}...`,
      thumbnail: global.icons || null, // Asegúrate de que 'icons' esté definido globalmente
      sourceUrl: global.redes || '',
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };

  if (!args[0]) {
    return conn.reply(m.chat, `🎙️ *¿Vienes a pedir un deseo sin saber qué quieres?*\n\nDi el nombre de la melodía que buscas... o lárgate antes de que pierda mi sonrisa. ¡JAJAJA!\n\n🎧 *Ejemplo:* \n${usedPrefix + command} Moonlight - Kali Uchis`, m, { contextInfo });
  }

  const isMode = ["audio", "video"].includes(args[0].toLowerCase());
  const queryOrUrl = isMode ? args.slice(1).join(" ") : args.join(" ");
  const isInputUrl = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/.+$/i.test(queryOrUrl);

  let video;

  // --- LÓGICA DE DESCARGA DIRECTA (Si el usuario especificó audio/video + URL) ---
  if (isMode && isInputUrl) {
    await m.react("📥");
    const mode = args[0].toLowerCase();

    try {
      const mediaResult = await processDownload(mode, queryOrUrl);
      if (!mediaResult?.url) throw new Error("Sin enlace");

      const title = await getVideoTitle(queryOrUrl);
      const response = await axios.head(mediaResult.url);
      const fileSizeMb = (response.headers['content-length'] || 0) / (1024 * 1024);

      if (fileSizeMb > SIZE_LIMIT_MB) {
        await conn.sendMessage(m.chat, {
          document: { url: mediaResult.url },
          fileName: `${title}.${mode === 'audio' ? 'mp3' : 'mp4'}`,
          mimetype: mode === 'audio' ? 'audio/mpeg' : 'video/mp4',
          caption: `📻 *¡Demasiado pesado para mi antena!* (${fileSizeMb.toFixed(2)} MB)\nLo envío como documento, querido. ¡Ten paciencia!`
        }, { quoted: m });
      } else {
        const mediaOptions = mode === 'audio'
          ? { audio: { url: mediaResult.url }, mimetype: "audio/mpeg" }
          : { video: { url: mediaResult.url }, caption: `🎙️ *¡Aquí tienes tu basura auditiva!* \n🖤 *Título:* ${title}` };

        await conn.sendMessage(m.chat, mediaOptions, { quoted: m });
      }
      return await m.react("📻");

    } catch (e) {
      // Intento de respaldo con ogmp3
      await conn.reply(m.chat, `🎙️ *Interferencia detectada...* Intentando una frecuencia de respaldo.`, m);
      const tempPath = path.join(process.cwd(), './tmp', `${Date.now()}.${mode === 'audio' ? 'mp3' : 'mp4'}`);
      
      try {
        const dl = await ogmp3.download(queryOrUrl, tempPath, mode);
        if (dl.status) {
            await conn.sendMessage(m.chat, { 
                [mode]: fs.readFileSync(tempPath), 
                mimetype: mode === 'audio' ? 'audio/mpeg' : 'video/mp4',
                caption: `📻 *Transmisión recuperada:* ${dl.result.title}`
            }, { quoted: m });
            return fs.unlinkSync(tempPath);
        }
      } catch (err) {
          await m.react("❌");
          return conn.reply(m.chat, `🎙️ *¡Qué decepción!* La señal se ha perdido por completo. Inténtalo más tarde, si es que sigues vivo.`, m);
      }
    }
  }

  // --- LÓGICA DE BÚSQUEDA ---
  await m.react("🔍");
  try {
    const searchResult = isInputUrl ? await yts({ videoId: new URL(queryOrUrl).searchParams.get('v') || queryOrUrl.split('/').pop() }) : await yts(queryOrUrl);
    video = isInputUrl ? searchResult : searchResult.videos?.[0];
  } catch (e) {
    return conn.reply(m.chat, `🎙️ *¡ESTÁTICA!* No encuentro nada con ese nombre. ¿Seguro que no estás sintonizando el canal equivocado?`, m);
  }

  if (!video) return conn.reply(m.chat, `🎙️ *¡Pura estática!* No hay nada para ti hoy.`, m);

  const buttons = [
    { buttonId: `${usedPrefix}play audio ${video.url}`, buttonText: { displayText: '🎧 𝘼𝙐𝘿𝙄𝙊' }, type: 1 },
    { buttonId: `${usedPrefix}play video ${video.url}`, buttonText: { displayText: '🎬 𝙑𝙄𝘿𝙀𝙊' }, type: 1 }
  ];

  const caption = `
🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *¡SALUDOS SINTONIZADOS!* ✨
━━━━━━━━━━━━━━━━━━━━

📻 *TÍTULO:* _${video.title}_
⏳ *DURACIÓN:* _${video.timestamp}_
👁️ *AUDIENCIA:* _${video.views.toLocaleString()} almas_
👤 *INVITADO:* _${video.author.name}_
📅 *HACE:* _${video.ago}_

━━━━━━━━━━━━━━━━━━━━
🎙️ *RECUERDA:* Nunca estás totalmente vestido sin una sonrisa. ¡JAJAJA! 📻✨`.trim();

  await conn.sendMessage(m.chat, {
    image: { url: video.thumbnail },
    caption,
    footer: 'Dime cómo quieres tu espectáculo... ┐(￣ー￣)┌.',
    buttons,
    headerType: 4,
    contextInfo
  }, { quoted: m });
};

// --- FUNCIONES AUXILIARES ---
async function processDownload(mode, url) {
  const apis = mode === 'audio' ? [
    { endpoint: `${global.APIs.zenzxz.url}/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download_url },
    { endpoint: `${global.APIs.vreden.url}/api/v1/download/youtube/audio?url=${encodeURIComponent(url)}&quality=128`, extractor: res => res.result?.download?.url }
  ] : [
    { endpoint: `${global.APIs.zenzxz.url}/downloader/ytmp4?url=${encodeURIComponent(url)}&resolution=360p`, extractor: res => res.data?.download_url },
    { endpoint: `${global.APIs.vreden.url}/api/v1/download/youtube/video?url=${encodeURIComponent(url)}&quality=360`, extractor: res => res.result?.download?.url }
  ];

  for (const { endpoint, extractor } of apis) {
    try {
      const res = await fetch(endpoint).then(r => r.json());
      const link = extractor(res);
      if (link) return { url: link };
    } catch (e) { continue; }
  }
  return null;
}

async function getVideoTitle(url) {
  try {
    const search = await yts(url);
    return search.videos[0]?.title || 'Melodía Infernal';
  } catch { return 'Melodía Infernal'; }
}

handler.help = ['play'].map(v => v + ' <búsqueda>');
handler.tags = ['descargas'];
handler.command = ['play'];
handler.register = true;

export default handler;
