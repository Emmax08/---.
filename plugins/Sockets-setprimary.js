// ༻✦༺ ༻✧༺ ༻✦༺ ༻⸙͎۪۫༺ ༻✦༺ ༻✧༺ ༻✦༺
//   Ascensión de Alastor - El Pecador Más Fuerte
// ༻✦༺ ༻✧༺ ༻✦༺ ༻⸙͎۪۫༺ ༻✦༺ ༻✧༺ ༻✦༺

import ws from 'ws'

const handler = async (m, { conn }) => {
  const activeBots = [...new Set([
    ...global.conns
      .filter((c) => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)
      .map((c) => c.user.jid)
  ])]
  
  if (global.conn?.user?.jid && !activeBots.includes(global.conn.user.jid)) {
    activeBots.push(global.conn.user.jid)
  }

  const chat = global.db.data.chats[m.chat]
  const who = m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : false)

  if (!who) return conn.reply(m.chat, `🎙️ *Transmisión Interrumpida*\n\nDebes mencionar a un pecador para designar quién posee el mayor poder.`, m)
  
  if (!activeBots.includes(who)) {
    return conn.reply(m.chat, `📻 *Veredicto de Alastor*\n\nEl ente @${who.split`@`[0]} es un alma demasiado débil o está fuera del aire.`, m, { mentions: [who] })
  }

  try {
    // ESTA ES LA CLAVE: Guardamos el JID del elegido
    chat.primaryBot = who 
    
    const txt = `🎙️ *¡Atención a todos los rincones del infierno!* ✨\n\n` +
                `El pecador @${who.split`@`[0]} ha sido proclamado como **El pecador más fuerte**.\n` +
                `Solo él tiene permiso de hablar en esta frecuencia.\n\n` +
                `*¡El espectáculo apenas comienza!*`
    
    await conn.reply(m.chat, txt, m, { mentions: [who] })
  } catch (e) {
    conn.reply(m.chat, `⚠️ *¡Error en la frecuencia!*`, m)
  }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = /^(setprimary)$/i 
handler.group = true
handler.admin = true

export default handler
