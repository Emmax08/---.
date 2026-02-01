import { createHash } from 'crypto'
import fetch from 'node-fetch'
import { readFileSync } from 'fs'

// Leer base de datos de enlaces
const dbLinks = JSON.parse(readFileSync('./src/database/db.json'))

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text }) {
  let user = global.db.data.users[m.sender]

  if (user.registered === true) throw `*『✦』Ya estás registrado. Para volver a registrarte usa: #unreg*`
  if (!Reg.test(text)) throw `*『✦』Formato incorrecto.*\nUsa:\n#reg Nombre.edad\n\nEjemplo:\n#reg Masha.18`

  let [_, name, splitter, age] = text.match(Reg)
  if (!name) throw '*『✦』El nombre es obligatorio.*'
  if (!age) throw '*『✦』La edad es obligatoria.*'
  if (name.length >= 30) throw '*『✦』El nombre no debe superar 30 caracteres.*'

  age = parseInt(age)
  if (age > 100) throw '*『😏』Viejo/a sabroso/a*'
  if (age < 5) throw '*『🍼』Ven aquí, te adoptare!!*'

  // Guardar en DB
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date()
  user.registered = true

  // Recompensas
  user.money += 600
  user.estrellas += 10
  user.exp += 245
  user.joincount += 5

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)

  // Lógica de Imagen (Prioridad: Perfil > JSON aleatorio)
  let imgPerfil
  try {
    imgPerfil = await conn.profilePictureUrl(m.sender, 'image')
  } catch (e) {
    // Si falla, elige una imagen aleatoria de tu db.json
    const imagenes = dbLinks.links.imagen
    imgPerfil = imagenes[Math.floor(Math.random() * imagenes.length)]
  }

  // Descargar imagen con node-fetch para validar
  let response = await fetch(imgPerfil)
  let buffer = await response.buffer()

  m.react('📩')

  let regbot = `👤 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗢 👤
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「💭」𝗡𝗼𝗺𝗯𝗿𝗲: ${name}
「✨️」𝗘𝗱𝗮𝗱: ${age} años
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
「🎁」𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
• 10 Estrellas 🌟
• 600 Monedas 🪙
• 245 Exp 💸
• 5 Tokens 💰
•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
${global.packname || 'Maria Kujou Bot'}`

  await conn.sendMessage(m.chat, {
    text: '⊱『✅ 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗗𝗢(𝗔) ✅』⊰\n\n' + regbot,
    contextInfo: {
      externalAdReply: {
        title: '𝗠𝗔𝗥𝗜𝗔 𝗞𝗨𝗝𝗢𝗨 𝗕𝗢𝗧',
        body: 'Registro exitoso',
        thumbnail: buffer,
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