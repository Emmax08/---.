import { existsSync, promises as fs } from "fs";
import path, { join } from 'path';
import ws from 'ws';

let handler = async (m, { conn, command, usedPrefix, args, text, isOwner }) => {
  const jadi = 'jadibts'; 
  
  const isDeleteSession = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
  const isPauseBot = /^(stop|pausarai|pausarbot)$/i.test(command);
  const isShowBots = /^(bots|sockets|socket)$/i.test(command);

  const reportError = async (e) => {
    await m.reply(`🎙️ *¡Sintonizando interferencia!* Ocurrió un error en la transmisión, querido...`)
    console.error(e);
  };

  switch (true) {
    case isDeleteSession: {
      const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
      const uniqid = `${who.split('@')[0]}`;
      const dirPath = join(process.cwd(), jadi, uniqid);

      if (global.conn.user.jid !== conn.user.jid) {
        return await conn.sendMessage(m.chat, {
          text: `📻 *¡Error de sintonía!* Este truco solo puede realizarlo el anfitrión principal.\n\nBusca la señal original aquí:\nhttps://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}`
        }, { quoted: m });
      }

      if (!existsSync(dirPath)) {
        return await conn.sendMessage(m.chat, {
          text: `🍎 *¿Buscando algo que no existe?* No hay un contrato (sesión) activo para ti en mis registros, querido.`
        }, { quoted: m });
      }

      try {
        await fs.rm(dirPath, { recursive: true, force: true });
        await conn.sendMessage(m.chat, {
          text: `🎙️ *¡JAJAJA!* Tu rastro ha sido borrado. El contrato con *@${uniqid}* se ha vuelto cenizas. ¡Disfruta de tu libertad... mientras dure! 🦌✨`,
          mentions: [who]
        }, { quoted: m });
      } catch (e) {
        reportError(e);
      }
      break;
    }

    case isPauseBot: {
      if (global.conn.user.jid == conn.user.jid) {
        conn.reply(m.chat, `📻 *¡Qué propuesta tan aburrida!* No puedo silenciar mi propia estación de radio. ¡El espectáculo debe continuar!`, m);
      } else {
        await conn.reply(m.chat, `🎙️ *Estática finalizando...* El show de ${global.botname || 'la radio'} se toma un descanso. ¡No cambien de frecuencia! 📻💤`, m);
        conn.ws.close();
      }
      break;
    }

    case isShowBots: {
      const users = [...new Set([...global.conns.filter(conn => conn.user && conn.ws?.readyState !== ws.CLOSED)])];

      const convertirMs = (ms) => {
        let seg = Math.floor(ms / 1000);
        let min = Math.floor(seg / 60);
        let hor = Math.floor(min / 60);
        let dias = Math.floor(hor / 24);
        return [
          dias ? `${dias}d` : '',
          hor % 24 ? `${hor % 24}h` : '',
          min % 60 ? `${min % 60}m` : ''
        ].filter(Boolean).join(' ');
      };

      const listaSubBots = users.map((v, i) => 
`📻 *EMISORA #${i + 1}*
👤 *Invitado:* ${v.user.name || 'Alma perdida'}
📱 *Frecuencia:* wa.me/${v.user.jid.split('@')[0]}
⏳ *En el aire:* ${v.uptime ? convertirMs(Date.now() - v.uptime) : 'Recién llegado'}`)
      .join('\n\n━━━━━━━━━━━━━━\n\n');

      const msg = `
🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *¡SALUDOS DESDE EL INFIERNO!* ✨
      *Transmisión de Alastor activa*

*¡Miren a todas estas almas sintonizadas!* 🍎
Si deseas unirte a nuestra transmisión, ¡solo tienes que pedirlo! Pero recuerda... todo tiene un precio.

━━━━━━━━━━━━━━━━━━━━
🦌 *ALMAS BAJO CONTRATO:* ${users.length}
━━━━━━━━━━━━━━━━━━━━

${listaSubBots.length === 0 ? '🎙️ *¡Pura estática!* No hay emisoras activas en este momento... qué decepcionante.' : listaSubBots}

🎙️ *RECUERDEN:* Nunca están totalmente vestidos sin una sonrisa. ¡JAJAJAJA! 📻✨`.trim();

      await conn.sendMessage(m.chat, {
        text: msg,
        mentions: conn.parseMention(msg)
      }, { quoted: m });
      break;
    }
  }
};

handler.tags = ['serbot'];
handler.help = ['sockets', 'deletesesion', 'pausarai'];
handler.command = [
  'deletesesion', 'deletebot', 'deletesession', 'deletesesaion',
  'stop', 'pausarai', 'pausarbot',
  'bots', 'sockets', 'socket'
];

export default handler;
