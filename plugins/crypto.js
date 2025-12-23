import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Definimos una lista de IDs válidos para evitar errores de búsqueda
    const validCoins = {
        'btc': 'bitcoin',
        'bitcoin': 'bitcoin',
        'eth': 'ethereum',
        'ethereum': 'ethereum',
        'sol': 'solana',
        'solana': 'solana',
        'doge': 'dogecoin',
        'dogecoin': 'dogecoin'
    }

    // Si el usuario usa el comando directo (como .btc) o escribe el nombre después de .crypto
    let searchTerm = text ? text.trim().toLowerCase() : command.toLowerCase()
    let coinId = validCoins[searchTerm] || searchTerm

    try {
        // Consultamos la API con un tiempo de espera y cabeceras de navegador
        let response = await fetch(`https://api.coingecko.com/api/v2/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        
        if (!response.ok) throw new Error('API_OFFLINE')
        let data = await response.json()

        // Si la moneda no devuelve datos (Error que veías en tus capturas)
        if (!data[coinId] || data[coinId].usd === undefined) {
            return await conn.reply(m.chat, `🎙️ 📻 *¡Interferencia!* No encuentro a *${searchTerm}* en mis registros electrónicos.\n\nPrueba con: *bitcoin, ethereum, solana o dogecoin*.`, m)
        }

        let price = data[coinId].usd
        let change = data[coinId].usd_24h_change ? data[coinId].usd_24h_change.toFixed(2) : '0.00'
        let emoji = change >= 0 ? '📈' : '📉'
        let status = change >= 0 ? '¡Una subida pecaminosa!' : '¡Cayendo al fondo del abismo!'

        const cryptoMessage = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *EL VALOR DEL MERCADO* ✨
━━━━━━━━━━━━━━━━━━━━

💰 𝑀𝑂𝑁𝐸𝐷𝐴: *${coinId.toUpperCase()}*
💵 𝑃𝑅𝐸𝐶𝐼𝑂: *USD $${price.toLocaleString()}*
📊 𝐶𝐴𝑀𝐵𝐼𝑂 (24h): *${change}%* ${emoji}

🎭 *ESTADO:* ${status}

━━━━━━━━━━━━━━━━━━━━
🎙️ *RECUERDA:* ¡Una sonrisa es una herramienta poderosa, incluso en la bancarrota! ¡JAJAJA! 📻✨`.trim()

        const cryptoImg = 'https://files.catbox.moe/khczrx.jpg'
        await conn.sendFile(m.chat, cryptoImg, 'crypto.jpg', cryptoMessage, m)

    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, `📻 *Señal débil:* El mercado negro del infierno está saturado ahora mismo. Inténtalo de nuevo en un minuto, querido.`, m)
    }
}

handler.help = ['crypto', 'btc', 'eth', 'sol']
handler.tags = ['tools']
// Se asegura de responder a .crypto y a las abreviaciones comunes
handler.command = /^(crypto|coin|bitcoin|btc|eth|sol|doge)$/i 

export default handler
