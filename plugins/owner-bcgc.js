import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn, isOwner, isROwner, text, usedPrefix, command }) => {
  // 1. Verificación de permisos
  if (!(isOwner || isROwner)) return global.dfail('owner', m, conn)

  // 2. Determinar el mensaje a enviar
  // Si hay un mensaje citado, usamos ese. Si no, usamos el texto del mensaje actual.
  let q = m.quoted ? m.quoted : m
  let content = q.msg || q
  
  // Extraer el texto limpio (sin el comando ni el prefijo)
  let txt = m.quoted ? (q.text || text || '') : text

  if (!m.quoted && !text) {
    return conn.reply(m.chat, `*《✦》Instrucciones de uso:*\n\n> ✐ Responde a un mensaje con *${usedPrefix}${command}*\n> ✐ O escribe: *${usedPrefix}${command}* tu mensaje.`, m)
  }

  // 3. Obtener lista de grupos actualizada
  let groups = Object.keys(await conn.groupFetchAllParticipating())
  
  m.reply(`📢 *DIFUSIÓN EN PROCESO*\n\n«✦» *Destinos:* ${groups.length} grupos\n«✦» *Estado:* Enviando multimedia y texto...`)

  // 4. Ciclo de envío
  for (let id of groups) {
    await new Promise((res) => setTimeout(res, 2000)) // Delay de 2s para evitar Ban
    
    try {
      if (m.quoted) {
        // Si es un mensaje citado, lo reenvía tal cual (mantiene fotos, videos, etc.)
        await conn.copyNForward(id, q, true)
      } else {
        // Si es solo texto escrito tras el comando, envía solo el texto limpio
        await conn.sendMessage(id, { text: txt }, { quoted: null })
      }
    } catch (e) {
      console.log(`Error al enviar a ${id}:`, e)
    }
  }

  conn.reply(m.chat, `✨ *D I F U S I Ó N  F I N A L I Z A D A*\n\n«✦» *Grupos:* ${groups.length}\n«✦» *Estado:* Éxito ✅`, m)
}

handler.help = ['bcgc']
handler.tags = ['owner']
handler.command = ['bcgc', 'broadcastgc']
handler.owner = true 

export default handler
