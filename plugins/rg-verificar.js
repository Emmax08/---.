import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /^(.+)[.|]\s*([0-9]+)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender]
  let name2 = (await conn.getName(m.sender)) || 'IsagiDelantero'
  let channel = 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T'
  let isagiImg = 'https://files.catbox.moe/l8qiik.jpeg'

  if (user.registered === true) return m.reply(
    `🌟 *¡Ya estás registrado en el campo de Isagi Yoichi!* 🌟\n\n⚽️ Si quieres eliminar tu registro, usa:\n*${usedPrefix}unreg*`
  )

  if (!Reg.test(text)) return m.reply(
    `🏆 *Registro Isagi* 🏆\n\n*Formato correcto:*\n${usedPrefix + command} nombre.edad\n\n*Ejemplo:*\n${usedPrefix + command} ${name2}.18\n\n¡Haz tu registro para recibir tu tarjeta !`
  )

  let [_, name, age] = text.match(Reg)
  if (!name) return m.reply('🏆 El nombre no puede estar vacío. Intenta de nuevo.')
  if (!age) return m.reply('🏆 La edad no puede estar vacía. Intenta de nuevo.')
  if (name.length >= 30) return m.reply('🏆 El nombre es muy largo. Usa menos de 30 caracteres.')
  age = parseInt(age)
  if (age > 100) return m.reply('🏆 ¡Esa edad es demasiado alta! Usa una edad real.')
  if (age < 10) return m.reply('🏆 ¡Eres muy pequeño para usar el bot!')

  user.name = name.trim() + ' ✨'
  user.age = age
  user.regTime = +new Date
  user.registered = true
  user.coin = (user.coin || 0) + 39
  user.exp = (user.exp || 0) + 300
  user.joincount = (user.joincount || 0) + 20

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  let regbot = `🌟 *¡REGISTRO EXITOSO!* 🌟\n\n👤 *Nombre:* ${name}\n🎂 *Edad:* ${age} años\n🆔 *ID:* ${sn}\n\n⚽️ *¡Bienvenido/a al campo de Isagi Yoichi!* ⚽️\n\n🎁 *Recompensas iniciales:*\n💰 +39 monedas\n✨ +300 XP\n🎟️ +20 tickets`

  await m.react('⚽️')

  let thumbBuffer = null
  try {
    const res = await fetch(isagiImg)
    thumbBuffer = Buffer.from(await res.arrayBuffer())
  } catch (e) {
    console.log('Error descargando imagen:', e)
  }

  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: '🏆 Registro en Isagi Yoichi Bot 🏆',
        body: '¡Tu tarjeta está lista! 🔥',
        thumbnail: thumbBuffer,
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