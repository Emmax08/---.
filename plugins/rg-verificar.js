import fs from 'fs'
import path from 'path'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /^(.+)[.|]\s*([0-9]+)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  // Ruta manual al archivo JSON
  const dbPath = path.join(process.cwd(), 'src/database/db.json')
  
  // Cargamos la base de datos manualmente (Sin lib externa)
  let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
  if (!db.users) db.users = {}
  if (!db.users[m.sender]) db.users[m.sender] = {}
  
  let user = db.users[m.sender]
  let name2 = (await conn.getName(m.sender)) || 'Pecador Desconocido'
  let channel = 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T'
  let alastorImg = 'https://raw.githubusercontent.com/danielalejandrobasado-glitch/Yotsuba-MD-Premium/main/uploads/e80e10ee231c3732.jpg'

  if (user.registered === true) return m.reply(
    `🎙️ *¡Vaya, qué entusiasmo!* 🎙️\n\nYa estás registrado en mi libro de invitados, querido amigo. Si quieres romper nuestro trato, usa:\n*${usedPrefix}unreg*`
  )

  if (!Reg.test(text)) return m.reply(
    `📻 *Registro del Hotel* 📻\n\n*Formato correcto:*\n${usedPrefix + command} nombre.edad\n\n*Ejemplo:*\n${usedPrefix + command} ${name2}.25\n\n¡Haz tu registro para recibir tu tarjeta de invitado!`
  )

  let [_, name, age] = text.match(Reg)
  if (!name) return m.reply('🍷 El nombre no puede estar vacío. Intenta de nuevo.')
  if (!age) return m.reply('🍷 La edad no puede estar vacía. Intenta de nuevo.')
  if (name.length >= 30) return m.reply('🍷 El nombre es muy largo. Usa menos de 30 caracteres.')
  age = parseInt(age)
  if (age > 100) return m.reply('🍷 ¡Esa edad es demasiado alta! Usa una edad real.')
  if (age < 10) return m.reply('🍷 ¡Eres muy pequeño para hacer tratos conmigo!')

  // Guardando datos
  user.name = name.trim() + ' 🎙️'
  user.age = age
  user.regTime = +new Date
  user.registered = true
  user.coin = (user.coin || 0) + 66
  user.exp = (user.exp || 0) + 666
  user.joincount = (user.joincount || 0) + 20

  // Guardar cambios en el archivo JSON directamente
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  let regbot = `🎙️ *¡REGISTRO EXITOSO!* 🎙️\n\n👤 *Nombre:* ${name}\n🎂 *Edad:* ${age} años\n🆔 *ID:* ${sn}\n\n📻 *¡Bienvenido/a al Hazbin Hotel!* 📻\n\n🎁 *Recompensas iniciales:*\n💰 +66 monedas\n✨ +666 XP\n🎟️ +20 tickets`

  await m.react('🎙️')

  let thumbBuffer = null
  try {
    const res = await fetch(alastorImg)
    thumbBuffer = Buffer.from(await res.arrayBuffer())
  } catch (e) {
    console.log('Error descargando imagen:', e)
  }

  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: '📻 Registro en el Hazbin Hotel 📻',
        body: '¡Tu tarjeta está lista! 🔥',
        thumbnail: thumbBuffer,
        mediaType: 1,
        sourceUrl: channel,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler
