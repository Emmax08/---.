import fs from 'fs'
import path from 'path'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /^(.+)[.|]\s*([0-9]+)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  // Ruta directa al archivo de almas
  const dbPath = path.join(process.cwd(), 'src/database/db.json')
  
  // Leemos el archivo JSON manualmente (Sin lib)
  let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
  
  // Aseguramos que la estructura exista
  if (!db.users) db.users = {}
  if (!db.users[m.sender]) db.users[m.sender] = {}
  
  let user = db.users[m.sender]
  let name2 = (await conn.getName(m.sender)) || 'Pecador Desconocido'
  let channel = 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T'
  // La imagen que me proporcionaste:
  let alastorImg = 'https://raw.githubusercontent.com/danielalejandrobasado-glitch/Yotsuba-MD-Premium/main/uploads/e80e10ee231c3732.jpg' 

  if (user.registered === true) return m.reply(
    `🎙️ *¡Vaya, qué entusiasmo!* 🎙️\n\nTu alma ya está en mi colección de deudores. Si quieres romper el contrato, usa:\n*${usedPrefix}unreg*`
  )

  if (!Reg.test(text)) return m.reply(
    `📻 *Sintonizando el Registro del Hotel* 📻\n\n*Formato:* ${usedPrefix + command} nombre.edad\n*Ejemplo:* ${usedPrefix + command} ${name2}.25\n\n¡No me hagas perder el tiempo, el espectáculo debe continuar!`
  )

  let [_, name, age] = text.match(Reg)
  age = parseInt(age)

  if (!name || name.length >= 30) return m.reply('🍷 ¡Un nombre válido y corto, por favor! No tengo todo el día.')
  if (isNaN(age) || age > 100 || age < 10) return m.reply('🍷 Esa edad no es apta para mis registros. ¡Sé honesto!')

  // Guardamos los datos en el objeto local
  user.name = name.trim() + ' 🎙️'
  user.age = age
  user.regTime = +new Date
  user.registered = true
  user.coin = (user.coin || 0) + 66 
  user.exp = (user.exp || 0) + 666
  user.joincount = (user.joincount || 0) + 10

  // --- ESCRIBIR DIRECTO EN EL JSON ---
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
  let regbot = `🎙️ *¡CONTRATO SELLADO!* 🎙️\n\n👤 *Nombre:* ${name}\n🎂 *Edad:* ${age} años\n🆔 *Número de Serie:* ${sn}\n\n📻 *¡Bienvenido al Hazbin Hotel!* 📻\n\n*¡Y recuerda, nunca estás completamente vestido sin una sonrisa!*`

  await m.react('🎙️')

  let thumbBuffer = null
  try {
    const res = await fetch(alastorImg)
    thumbBuffer = Buffer.from(await res.arrayBuffer())
  } catch (e) { 
    console.log('Error al sintonizar la imagen.') 
  }

  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: {
      externalAdReply: {
        title: '📻 Transmisión Oficial de Alastor 📻',
        body: '¡Tu alma ahora es parte de mi sintonía! 🔥',
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
