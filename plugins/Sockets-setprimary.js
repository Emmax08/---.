// ༻✦༺ ༻✧༺ ༻✦༺ ༻⸙͎۪۫༺ ༻✦༺ ༻✧༺ ༻✦༺
//   Coronación del Guardián Principal - Código de la Casa Waguri
// ༻✦༺ ༻✧༺ ༻✦༺ ༻⸙͎۪۫༺ ༻✦༺ ༻✧༺ ༻✦༺

import ws from 'ws'

const handler = async (m, { conn }) => {
  const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn.user.jid)])]
  if (global.conn?.user?.jid && !subBots.includes(global.conn.user.jid)) {
    subBots.push(global.conn.user.jid)
  }
  const chat = global.db.data.chats[m.chat]
  const mentionedJid = await m.mentionedJid
  const who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : false
  if (!who) return conn.reply(m.chat, `🖤 *Menciona al pecador que deseas colocar como el mas fuerte.*`, m)
  if (!subBots.includes(who)) return conn.reply(m.chat, `✡️ *Este es un pecador debil.*\n\nNo poseo la capacidad de designarlo como pecador mas fuerte.`, m, rcanal)
  if (chat.primaryBot === who) {
    return conn.reply(m.chat, `👑 *@${who.split`@`[0]} ya es el guardián principal de este jardín.*`, m, { mentions: [who] });
  }
  try {
    chat.primaryBot = who
    conn.reply(m.chat, `😈 *Ahora  @${who.split`@`[0]} es el pecador principal.*\n\nAhora soy el mas fuerte pobres perras.`, m, { mentions: [who] })
  } catch (e) {
    conn.reply(m.chat, `👿 *He fallado al ser el pecado mas fuerte.*\n\nLa conexión con el infierno se ha interrumpido.`, m, rcanal)
  }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = ['setprimary']
handler.group = true
handler.admin = true

export default handler

// ༻✦༺ ༻✧༺ ༻✦༺ ༻⸙͎۪۫༺ ༻✦༺ ༻✧༺ ༻✦༺
//   Que el guardián elegido proteja el jardín con sabiduría
// ༻✦༺ ༻✧༺ ༻✦༺ ༻⸙͎۪۫༺ ༻✦༺ ༻✧༺ ༻✦༺