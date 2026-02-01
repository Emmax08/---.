import fs from 'fs'
import path from 'path'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /^(.+)[.|]\s*([0-9]+)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  // Definimos la ruta del archivo
  const dbPath = path.join(process.cwd(), 'src/database/db.json')
  
  // Leemos el archivo JSON manualmente
  let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
  
  // Si el usuario no existe en el JSON, lo creamos
  if (!db.users) db.users = {}
  if (!db.users[m.sender]) db.users[m.sender] = {}
  
  let user = db.users[m.sender]
  let name2 = (await conn.getName(m.sender)) || 'Pecador Desconocido'
  let channel = 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T'
  let alastorImg = 'https://files.catbox.moe/p9p4v4.jpg' 

  if (user.registered === true) return m.reply(
    `🎙️ *¡Vaya, qué entusiasmo!* 🎙️\n\nTu alma ya está en mi colección. Si quieres romper el contrato, usa:\n*${usedPrefix}unreg*`
  )

  if (!Reg.test(text)) return m.reply(
    `📻 *Sintonizando el Registro* 📻\n\n*Formato:* ${usedPrefix + command} nombre.edad\n*Ejemplo:* ${usedPrefix + command} ${name2}.25`
  )

  let [_, name, age] = text.match(Reg)
  age = parseInt(age)

  if (!name || name.length >= 30) return m.reply('🍷 ¡Un nombre válido y corto, por favor!')
  if (isNaN(age) || age > 100 || age < 10) return m.reply('🍷 Esa edad no me sirve para mis registros.')

  // Guardamos los datos en nuestro objeto local
  user.name = name.trim() + ' 🎙️'
  user.age = age
  user.regTime = +new Date
  user.registered = true
  user.coin = (user.coin || 0) + 66 
  user.exp = (user.exp || 0) + 666
  user.joincount = (user.joincount || 0) + 10

  // --- EL TRATO: Guardar de vuelta al archivo JSON ---
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
  let regbot = `🎙️ *¡CONTRATO SELLADO!* 🎙️\n\n👤 *Nombre:* ${name}\n🎂 *Edad:* ${age} años\n🆔 *ID:* ${sn}\n\n📻 *¡Bienvenido al Hazbin Hotel!*`

  await m.react('🎙️')

  let thumbBuffer = null
  try {
    const res = await fetch(alastorImg)
    thumbBuffer = Buffer.from(await res.arrayBuffer())
  } catch (e) { console.log('Sin imagen esta vez.') }

  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: '📻 Transmisión Oficial de Alastor 📻',
        body: '¡Sonríe, el espectáculo comenzó! 🔥',
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
