// ༻✦༺ ༻✧༺ ༻✦༺ ༻⸙͎۪۫༺ ༻✦༺ ༻✧༺ ༻✦༺
//   Ascensión de Alastor - El Pecador Más Fuerte
// ༻✦༺ ༻✧༺ ༻✦༺ ༻⸙͎۪۫༺ ༻✦༺ ༻✧༺ ༻✦༺

import ws from 'ws'

const handler = async (m, { conn, usedPrefix, command }) => {
  // 1. Filtrar lista de Entidades activas en el dial
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

  // 2. Validaciones de jerarquía
  if (!who) return conn.reply(m.chat, `🎙️ *Transmisión Interrumpida*\n\nDebes mencionar a un pecador o responder a su mensaje para designar quién posee el mayor poder.`, m)
  
  if (!activeBots.includes(who)) {
    return conn.reply(m.chat, `📻 *Veredicto de Alastor*\n\nEl ente @${who.split`@`[0]} es un alma demasiado débil o su señal se ha extinguido en el vacío.`, m, { mentions: [who] })
  }

  if (chat.primaryBot === who) {
    return conn.reply(m.chat, `👸 *Jerarquía Absoluta*\n\n@${who.split`@`[0]} ya es reconocido como el pecador más fuerte de este infierno.`, m, { mentions: [who] })
  }

  // 3. Ejecución del Cambio de Poder
  try {
    chat.primaryBot = who
    const txt = `🎙️ *¡Atención a todos los rincones del infierno!* ✨\n\n` +
                `El pecador @${who.split`@`[0]} ha sido proclamado como **El pecador más fuerte**.\n` +
                `Que su sombra se extienda y su poder silencie a los mediocres.\n\n` +
                `*¡El espectáculo apenas comienza!*`
    
    await conn.reply(m.chat, txt, m, { mentions: [who] })
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `⚠️ *¡Error en la frecuencia!*\n\nLa estática ha impedido que el pecador más fuerte tome su lugar.`, m)
  }
}

handler.help = ['setprimary']
handler.tags = ['grupo']
handler.command = /^(setprimary)$/i // Funciona con . y #
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

// ༻✦༺ ༻✧༺ ༻✦༺ ༻⸙͎۪۫༺ ༻✦༺ ༻✧༺ ༻✦༺
//   El pecador más fuerte ha tomado el control del dial
// ༻✦༺ ༻✧༺ ༻✦༺ ༻⸙͎۪۫༺ ༻✦༺ ༻✧༺ ༻✦༺
