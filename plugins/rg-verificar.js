import fs from 'fs'
import path from 'path'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /^(.+)[.|]\s*([0-9]+)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  console.log('🎙️ [DEBUG] Iniciando comando de registro...')
  
  // Ruta manual al archivo JSON
  const dbPath = path.join(process.cwd(), 'src/database/db.json')
  console.log('🎙️ [DEBUG] Ruta del archivo:', dbPath)

  let db;
  try {
    const rawData = fs.readFileSync(dbPath, 'utf-8')
    db = JSON.parse(rawData)
    console.log('🎙️ [DEBUG] Base de datos cargada correctamente.')
  } catch (err) {
    console.log('❌ [ERROR] No se pudo leer el JSON:', err.message)
    return m.reply('¡Vaya! Parece que mi libro de almas está perdido. Revisa la consola.')
  }

  // Aseguramos estructura (Sin usar global.db para evitar conflictos)
  if (!db.users) db.users = {}
  if (!db.users[m.sender]) db.users[m.sender] = {}
  
  let user = db.users[m.sender]
  let name2 = (await conn.getName(m.sender)) || 'Pecador'
  let alastorImg = 'https://raw.githubusercontent.com/danielalejandrobasado-glitch/Yotsuba-MD-Premium/main/uploads/e80e10ee231c3732.jpg'

  console.log(`🎙️ [DEBUG] Usuario: ${m.sender} | Registrado: ${user.registered}`)

  if (user.registered === true) {
    console.log('🎙️ [DEBUG] El usuario ya estaba registrado.')
    return m.reply(`🎙️ *¡Ya eres parte del espectáculo!* Usa *${usedPrefix}unreg* para irte.`)
  }

  if (!Reg.test(text)) {
    console.log('🎙️ [DEBUG] Texto no cumple el formato:', text)
    return m.reply(`📻 *Formato incorrecto*\nUsa: ${usedPrefix + command} nombre.edad`)
  }

  let [_, name, age] = text.match(Reg)
  age = parseInt(age)

  console.log(`🎙️ [DEBUG] Datos extraídos -> Nombre: ${name}, Edad: ${age}`)

  // Validaciones
  if (!name || name.length >= 30) return m.reply('🍷 Nombre muy largo o vacío.')
  if (isNaN(age) || age > 100 || age < 10) return m.reply('🍷 Edad no válida.')

  // Guardando en el objeto local
  user.name = name.trim() + ' 🎙️'
  user.age = age
  user.regTime = +new Date
  user.registered = true
  user.coin = (user.coin || 0) + 66
  user.exp = (user.exp || 0) + 666
  user.joincount = (user.joincount || 0) + 20

  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
    console.log('🎙️ [DEBUG] Archivo db.json actualizado con éxito.')
  } catch (writeErr) {
    console.log('❌ [ERROR] Falló la escritura:', writeErr.message)
  }

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
  let regbot = `🎙️ *¡CONTRATO SELLADO!* 🎙️\n\n👤 *Nombre:* ${name}\n🎂 *Edad:* ${age} años\n🆔 *ID:* ${sn}\n\n📻 *¡Bienvenido al Hazbin Hotel!*`

  await m.react('🎙️')

  try {
    const res = await fetch(alastorImg)
    const thumbBuffer = Buffer.from(await res.arrayBuffer())
    console.log('🎙️ [DEBUG] Imagen descargada, enviando mensaje final...')

    await conn.sendMessage(m.chat, {
      text: regbot,
      contextInfo: {
        externalAdReply: {
          title: '📻 Registro Oficial de Alastor 📻',
          body: '¡Tu alma ahora nos pertenece! 🔥',
          thumbnail: thumbBuffer,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
  } catch (e) {
    console.log('❌ [ERROR] Falló el envío del mensaje con imagen:', e.message)
    m.reply(regbot) // Enviar solo texto si la imagen falla
  }
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler
