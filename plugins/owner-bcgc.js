let handler = async (m, { conn, isOwner, isROwner, text, usedPrefix, command }) => {
  // 1. Verificación de permisos (Owner o ROwner)
  if (!(isOwner || isROwner)) return global.dfail('owner', m, conn)

  // 2. Identificar el contenido (mensaje respondido o texto nuevo)
  let q = m.quoted ? m.quoted : m
  
  if (!m.quoted && !text) {
    return conn.reply(m.chat, `*《✦》Instrucciones de uso:*\n\n> ✐ Responde a un mensaje (foto, video, audio, texto) con el comando *${usedPrefix}${command}*\n> ✐ O escribe el comando seguido del texto.`, m)
  }

  // 3. Obtener grupos y preparar lista
  let getGroups = await conn.groupFetchAllParticipating()
  let groups = Object.values(getGroups)
  let anu = groups.map((v) => v.id)

  m.reply(`📢 *DIFUSIÓN EN PROCESO*\n\n«✦» *Destinos:* ${anu.length} grupos\n«✦» *Tiempo estimado:* ${(anu.length * 1.5).toFixed(0)} segundos\n\n> _Por seguridad, hay un breve retraso entre envíos._`)

  // 4. Ciclo de envío con copyNForward (mantiene fotos/texto/formato)
  for (let i of anu) {
    await new Promise((res) => setTimeout(res, 1500)) // Delay de 1.5s para evitar ban
    try {
      await conn.copyNForward(i, q, true)
    } catch (e) {
      console.log(`Error al enviar a ${i}: ${e.message}`)
    }
  }

  // 5. Mensaje de éxito final
  let mensajeFinal = `✨ *D I F U S I Ó N  C O M P L E T A*\n\n` +
                     `«✦» *Grupos alcanzados:* ${anu.length}\n` +
                     `«✦» *Estado:* Finalizado con éxito ✅`
  
  conn.reply(m.chat, mensajeFinal, m)
}

handler.help = ['bcgc']
handler.tags = ['owner']
handler.command = ['bcgc', 'broadcastgc']

// Permitir que ambos rangos lo usen
handler.owner = true 

export default handler
