import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Mapa de monedas para asegurar que el bot entienda las abreviaturas
    let coins = {
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
    let pair = coins[query] || (query.toUpperCase() + 'USDT')

    try {
        // Usamos Binance para evitar el error de "Saturación" (Rate Limit)
        let res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`)
        if (!res.ok) throw new Error()
        let json = await res.json()

        let price = parseFloat(json.lastPrice).toLocaleString()
        let change = parseFloat(json.priceChangePercent).toFixed(2)
        let emoji = change >= 0 ? '📈' : '📉'
        
        const cryptoMessage = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *VALOR DEL MERCADO* ✨
━━━━━━━━━━━━━━━━━━━━

💰 𝑀𝑂𝑁𝐸𝐷𝐴: *${query.toUpperCase()}*
💵 𝑃𝑅𝐸𝐶𝐼𝑂: *USD $${price}*
📊 𝐶𝐴𝑀𝐵𝐼𝑂: *${change}%* ${emoji}

━━━━━━━━━━━━━━━━━━━━
🎙️ *RECUERDA:* ¡Nunca dejes de sonreír! 📻✨`.trim()

        const cryptoImg = 'https://files.catbox.moe/khczrx.jpg'
        await conn.sendFile(m.chat, cryptoImg, 'crypto.jpg', cryptoMessage, m)

    } catch (e) {
        await conn.reply(m.chat, `🎙️ 📻 *¡Interferencia!* No encuentro datos para *${query}*. Prueba con: *btc, eth o sol*.`, m)
    }
}

handler.help = ['crypto']
handler.tags = ['tools']
// Definimos el comando principal y sus alias para evitar el error de "no existe"
handler.command = /^(crypto|bitcoin|btc|eth|sol|precio)$/i 

export default handler
