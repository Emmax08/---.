import { createHash } from 'crypto'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text }) {
  let user = global.db.data.users[m.sender]
  
  if (user.registered === true) throw `*『✦』Ya estás registrado. Para volver a registrarte usa: #unreg*`
  if (!Reg.test(text)) throw `*『✦』Formato incorrecto.*\nUsa:\n#reg Nombre.edad\n\nEjemplo:\n#reg 𝐀𝐋𝐀𝐒𝐓𝐎𝐑.18`

  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw '*『✦』El nombre es obligatorio.*'
  if (!age) throw '*『✦』La edad es obligatoria.*'
  if (name.length >= 30) throw '*『✦』El nombre no debe superar 30 caracteres.*'

  age = parseInt(age)
  if (age > 100) throw '*『😏』¿Tan viejo/a? ¡Eres un fósil viviente!*'
  if (age < 5) throw '*『🍼』Ven aquí, ¡te voy a adoptar, pequeño/a!*'

  // --- Sincronización de Recompensas ---
  const recompensas = {
    money: 5,
    estrellas: 15,
    exp: 245,
    joincount: 12
  }

  // Guardar en Base de Datos
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date()
  user.registered = true
  
  // Aplicar recompensas
  user.money += recompensas.money
  user.estrellas += recompensas.estrellas
  user.exp += recompensas.exp
  user.joincount += recompensas.joincount

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)
  m.react('📩')

  let regbot = `👤 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗢 👤
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「💭」𝗡𝗼𝗺𝗯𝗿𝗲: ${name}
「✨️」𝗘𝗱𝗮𝗱: ${age} años
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「🎁」𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
• ${recompensas.estrellas} Estrellas 🌟
• ${recompensas.money} Monedas 🪙
• ${recompensas.exp} Exp 💸
• ${recompensas.joincount} Tokens 💰
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
Serial: ${sn}
${global.packname || '𝐀𝐋𝐀𝐒𝐓𝐎𝐑 Bot'}`

  const imagenRegistro = 'https://files.catbox.moe/qc75v7.jpg'

  await conn.sendMessage(m.chat, {
    text: '⊱『✅ 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗗𝗢(𝗔) ✅』⊰\n\n' + regbot,
    contextInfo: {
      externalAdReply: {
        title: '𝐀𝐋𝐀𝐒𝐓𝐎𝐑 Bot',
        body: '¡Registro completado con éxito!',
        thumbnailUrl: icons,
        sourceUrl: redes,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler
