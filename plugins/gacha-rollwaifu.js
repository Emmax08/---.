import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters.json'
const haremFilePath = './src/database/harem.json'

const cooldowns = {}

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('🎙️ La señal se perdió. No pude leer los archivos del programa.')
    }
}

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('🎙️ Hubo un error al guardar este contrato.')
    }
}

async function loadHarem() {
    try {
        const data = await fs.readFile(haremFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender
    const now = Date.now()

    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        return await conn.reply(m.chat, `🎙️ *¡JAJAJA! ¡Qué impaciencia, querido!*\nLa radio necesita tiempo para enfriarse. Vuelve en *${minutes}m ${seconds}s* para sintonizar a otra alma. 📻✨`, m)
    }

    try {
        const characters = await loadCharacters()
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
        const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]

        const harem = await loadHarem()
        const userEntry = harem.find(entry => entry.characterId === randomCharacter.id)
        
        const statusMessage = randomCharacter.user 
            ? `Bajo contrato de @${randomCharacter.user.split('@')[0]} 🍎` 
            : '¡Libre para ser reclamada! 💎'

        const message = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *¡UN NUEVO INVITADO AL AIRE!* ✨
━━━━━━━━━━━━━━━━━━━━

📻 𝑁𝑂𝑀𝐵𝑅𝐸: *${randomCharacter.name}
🎭 𝐺𝐸𝑁𝐸𝑅𝑂: *${randomCharacter.gender
💰 𝑉𝐴𝐿𝑂𝑅: *${randomCharacter.value
📂 𝐹𝑈𝐸𝑁𝑇𝐸: *${randomCharacter.source
🔖 𝙄𝘿: *${randomCharacter.id}*

⚖️ *ESTADO:* ${statusMessage}

━━━━━━━━━━━━━━━━━━━━
🎙️ *RECUERDA:* Nunca estás totalmente vestido sin una sonrisa. ¡JAJAJA! 📻✨`.trim()

        const mentions = randomCharacter.user ? [randomCharacter.user] : []
        await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message, m, { mentions })

        if (!randomCharacter.user) {
            await saveCharacters(characters)
        }

        // Cooldown de 15 minutos (personalizado por tu código original)
        cooldowns[userId] = now + 15 * 60 * 1000

    } catch (error) {
        await conn.reply(m.chat, `📻 *Interferencia detectada:* ${error.message}`, m)
    }
}

handler.help = ['ver', 'rw', 'rollwaifu']
handler.tags = ['gacha']
handler.command = ['ver', 'rw', 'rollwaifu']
handler.group = true

export default handler
