import { xpRange } from '../../lib/levelling.js'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    
    try {
        if (!global.db.data.users) global.db.data.users = {}
        if (!global.db.data.characters) global.db.data.characters = {}
        if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
        
        const user = global.db.data.users[userId]
        const currency = global.moneda || 'Coins'
        
        // Función para limpiar números gigantes
        const fNum = (num) => {
            if (num === Infinity || num >= 9007199254740991) return 'Máximo'
            return (num || 0).toLocaleString()
        }

        let name = await conn.getName(userId).catch(_ => userId.split('@')[0])
        const cumpleanos = user.birth || `Sin especificar (${usedPrefix}setbirth)`
        const genero = user.genre || 'Sin especificar'
        const description = user.description || 'Sin descripción'
        
        const parejaId = user.marry || null
        let textoMatrimonio = ''
        if (parejaId) {
            let parejaName = await conn.getName(parejaId).catch(_ => parejaId.split('@')[0])
            let prefijo = genero.toLowerCase() === 'mujer' ? 'Casada con' : (genero.toLowerCase() === 'hombre' ? 'Casado con' : 'Casado/a con')
            textoMatrimonio = `• ✧ ${prefijo}: *${parejaName}* (@${parejaId.split('@')[0]})\n`
        }

        const exp = user.exp || 0
        const nivel = user.level || 0
        const sorted = Object.entries(global.db.data.users).map(([k, v]) => ({ ...v, jid: k })).sort((a, b) => (b.level || 0) - (a.level || 0))
        const rank = sorted.findIndex(u => u.jid === userId) + 1
        
        const progreso = (() => {
            try {
                let datos = xpRange(nivel, global.multiplier || 1)
                let actual = exp - datos.min
                let porcentaje = Math.min(Math.floor((actual / datos.xp) * 100), 100)
                return `${fNum(actual)} / ${fNum(datos.xp)} _(${porcentaje}%)_`
            } catch { return 'No disponible' }
        })()

        const total = (user.coin || 0) + (user.bank || 0)
        const ownedIDs = Object.entries(global.db.data.characters || {}).filter(([, c]) => c.user === userId).map(([id]) => id)
        const haremCount = ownedIDs.length
        const haremValue = ownedIDs.reduce((acc, id) => {
            const char = global.db.data.characters[id] || {}
            return acc + (typeof char.value === 'number' ? char.value : 0)
        }, 0)

        const favId = user.favorite
        const favLine = favId && global.db.data.characters?.[favId] ? `• ❀ Favorito: *${global.db.data.characters[favId].name || '???'}*\n` : ''

        // Imagen de perfil
        const pp = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')

        const text = `
\`P E R F I L  〤  U S U A R I O\`

${description ? `> _${description}_\n` : ''}
✰ *INFORMACIÓN PERSONAL*
• ꕤ Nombre: *${name}*
• ❀ Cumpleaños: *${cumpleanos}*
• ❒ Género: *${genero}*
${textoMatrimonio}
❒ *PROGRESO Y NIVEL*
• ✰ Experiencia: *${fNum(exp)}*
• ꕤ Nivel: *${fNum(nivel)}*
• ❀ Rango: *#${rank}*
• ✧ Progreso: *${progreso}*

✧ *ECONOMÍA Y HAREM*
• ❀ Harem: *${haremCount} personajes*
• ✰ Valor Total: *${fNum(haremValue)}*
${favLine}• ❒ Total Monedas: *${fNum(total)} ${currency}*
• ꕤ Comandos: *${fNum(user.commands || 0)}*
• ❁ Premium: *${user.premium ? '✅' : '❌'}*

ꕤ Usa *${usedPrefix}profile* para ver tu perfil.`.trim()

        await conn.sendMessage(m.chat, { 
            image: { url: pp }, 
            caption: text,
            mentions: [userId, ...(parejaId ? [parejaId] : [])]
        }, { quoted: m })

    } catch (error) {
        console.error(error)
        m.reply(`⚠️ Ocurrió un problema: ${error.message}`)
    }
}

handler.help = ['profile']
handler.tags = ['rg']
// Usar un array es lo más seguro para que el bot reconozca los comandos
handler.command = ['profile', 'perfil', 'perfíl']
handler.group = true

export default handler
