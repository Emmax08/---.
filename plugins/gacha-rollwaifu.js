import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters.json'
const haremFilePath = './src/database/harem.json'

const cooldowns = {}

// --- Funciones de Utilidad ---
async function loadJSON(path, defaultVal = []) {
    try {
        const data = await fs.readFile(path, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return defaultVal
    }
}

async function saveJSON(path, data) {
    try {
        await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('🎙️ Hubo un error al procesar el contrato en los archivos.')
    }
}

let handler = async (m, { conn, usedPrefix, command }) => {
    const userId = m.sender
    const now = Date.now()
    const cooldownTime = 15 * 60 * 1000 // 15 minutos

    // --- Verificación de Cooldown ---
    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        return await conn.reply(m.chat, `🎙️ *¡JAJAJA! ¡Qué impaciencia, querido!*\nLa radio necesita tiempo para enfriarse. Vuelve en *${minutes}m ${seconds}s* para sintonizar a otra alma. 📻✨`, m)
    }

    try {
        const characters = await loadJSON(charactersFilePath)
        
        if (!characters.length) {
            return await conn.reply(m.chat, '📻 *Interferencia:* No hay almas disponibles en el archivo de la radio.', m)
        }

        // Selección aleatoria
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
        const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]
        
        // Determinar estado y menciones
        const isClaimed = !!randomCharacter.user
        const statusMessage = isClaimed 
            ? `Bajo contrato de @${randomCharacter.user.split('@')[0]} 🍎` 
            : `¡Libre para ser reclamada! Usa \`${usedPrefix}claim\` ✡️`

        const message = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
✨ *¡UN NUEVO INVITADO AL AIRE!* ✨
━━━━━━━━━━━━━━━━━━━━

📻 𝑁𝑂𝑀𝐵𝑅𝐸: *${randomCharacter.name}*
🎭 𝐺𝐸𝑁𝐸𝑅𝑂: *${randomCharacter.gender}*
💰 𝑉𝐴𝐿𝑂𝑅: *${randomCharacter.value}*
📂 𝐹𝑈𝐸𝑁𝑇𝐸: *${randomCharacter.source}*
🔖 𝙄𝘿: *${randomCharacter.id}*

⚖️ *ESTADO:* ${statusMessage}

━━━━━━━━━━━━━━━━━━━━
🎙️ *RECUERDA:* Nunca estás totalmente vestido sin una sonrisa. ¡JAJAJA! 📻✨`.trim()

        const mentions = isClaimed ? [randomCharacter.user] : []
        
        // Enviar imagen con el mensaje
        await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message, m, { mentions })

        // Activar cooldown solo si el comando fue exitoso
        cooldowns[userId] = now + cooldownTime

    } catch (error) {
        console.error(error)
        await conn.reply(m.chat, `📻 *Interferencia detectada:* ${error.message}`, m)
    }
}

handler.help = ['ver', 'rw', 'rollwaifu']
handler.tags = ['gacha']
// Aplicando tus prefijos configurados . y #
handler.command = /^(ver|rw|rollwaifu)$/i
handler.group = true

export default handler
