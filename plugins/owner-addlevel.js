import { xpRange } from '../lib/levelling.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // 1. Determinar quién es el objetivo (Mención > Citado > Yo mismo)
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    
    // 2. Obtener la cantidad de niveles a sumar
    let amount = parseInt(args[0])
    if (m.mentionedJid && m.mentionedJid[0]) amount = parseInt(args[1]) // Si mencionó a alguien, el número es el segundo argumento

    if (!amount || isNaN(amount)) return m.reply(`*⚠️ Uso incorrecto:*\n${usedPrefix + command} [cantidad] @user`)

    let user = global.db.data.users[who]
    if (!user) return m.reply('❌ El usuario no está en mi base de datos.')

    // 3. Lógica para añadir nivel y actualizar la XP necesaria
    let before = user.level * 1
    user.level += amount

    // Ajustamos la XP del usuario para que coincida con su nuevo nivel mínimo
    // Esto evita que al subir de nivel la barra de progreso quede en negativo o rota
    let { min } = xpRange(user.level, global.multiplier)
    user.exp = min

    let txt = `*✨ NIVELES AÑADIDOS ✨*\n\n`
    txt += `*Persona:* @${who.split`@`[0]}\n`
    txt += `*Nivel anterior:* ${before}\n`
    txt += `*Nivel actual:* ${user.level}\n`
    txt += `*XP Ajustada:* ${user.exp}`

    await conn.sendMessage(m.chat, { text: txt, mentions: [who] }, { quoted: m })
}

handler.help = ['addlevel <cantidad>']
handler.tags = ['owner']
handler.command = ['addlevel', 'subirnivel', 'darlevel']

// 4. Restricción para que solo el Dueño del bot lo use
handler.owner = true 

export default handler
