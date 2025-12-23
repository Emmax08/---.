import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Definimos las monedas más comunes para búsqueda rápida
    let mones = {
        'btc': 'BTCUSDT',
        'bitcoin': 'BTCUSDT',
        'eth': 'ETHUSDT',
        'ethereum': 'ETHUSDT',
        'sol': 'SOLUSDT',
        'solana': 'SOLUSDT',
        'doge': 'DOGEUSDT',
        'dogecoin': 'DOGEUSDT'
    }

    let query = text ? text.trim().toLowerCase() : 'btc'
    let pair = mones[query] || (query.toUpperCase() + 'USDT')

    try {
        // Usamos la API de Binance que es mucho más rápida y no se satura tanto como CoinGecko
        let res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`)
        if (!res.ok) throw new Error()
        let json = await res.json()

        let price = parseFloat(json.lastPrice).toLocaleString()
        let change = parseFloat(json.priceChangePercent).toFixed(2)
        let emoji = change >= 0 ? '📈' : '📉'
        let status = change >= 0 ? '¡Una subida pecaminosa!' : '¡Cayendo al fondo del abismo!'

        const cryptoMessage = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *VALOR DEL MERCADO NEGRO* ✨
━━━━━━━━━━━━━━━━━━━━

💰 𝑀𝑂𝑁𝐸𝐷𝐴: *${query.toUpperCase()}*
💵 𝑃𝑅𝐸𝐶𝐼𝑂: *USD $${price}*
📊 𝐶𝐴𝑀𝐵𝐼𝑂 (24h): *${change}%* ${emoji}

🎭 *ESTADO:* ${status}

━━━━━━━━━━━━━━━━━━━━
🎙️ *RECUERDA:* ¡Una sonrisa es una herramienta poderosa, incluso en la bancarrota! ¡JAJAJA! 📻✨`.trim()

        const cryptoImg = 'https://files.catbox.moe/khczrx.jpg'
        await conn.sendFile(m.chat, cryptoImg, 'crypto.jpg', cryptoMessage, m)

    } catch (e) {
        await conn.reply(m.chat, `🎙️ 📻 *¡Interferencia fatal!* No encuentro a *${query}* o el mercado está cerrado para pecadores. Prueba con: *btc, eth, sol o doge*.`, m)
    }
}

handler.help = ['preciocrypto']
handler.tags = ['tools']
// CAMBIAMOS EL COMANDO para evitar el choque que sale en tus capturas
handler.command = /^(preciocrypto|p-crypto|bitc|precio)$/i 

export default handler
