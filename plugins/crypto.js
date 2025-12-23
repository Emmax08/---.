import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    // Si el usuario no especifica una moneda, usamos Bitcoin por defecto
    let coin = text ? text.toLowerCase() : 'bitcoin'
    
    try {
        // Llamada a la API de CoinGecko
        let res = await fetch(`https://api.coingecko.com/api/v2/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`)
        let json = await res.json()

        // Si la moneda no existe en la API
        if (!json[coin]) {
            return await conn.reply(m.chat, `🎙️ 📻 *¡Interferencia!* Esa moneda no existe en mis registros, querido. Intenta con: *bitcoin, ethereum, solana o dogecoin*.`, m)
        }

        let price = json[coin].usd
        let change = json[coin].usd_24h_change.toFixed(2)
        let emoji = change >= 0 ? '📈' : '📉'
        let color = change >= 0 ? '¡Una subida pecaminosa!' : '¡Cayendo al fondo del abismo!'

        const cryptoMessage = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *EL VALOR DEL MERCADO* ✨
━━━━━━━━━━━━━━━━━━━━

💰 𝑀𝑂𝑁𝐸𝐷𝐴: *${coin.toUpperCase()}*
💵 𝑃𝑅𝐸𝐶𝐼𝑂 (USD): *$${price.toLocaleString()}*
📊 𝐶𝐴𝑀𝐵𝐼𝑂 (24h): *${change}%* ${emoji}

🎭 *ESTADO:* ${color}

━━━━━━━━━━━━━━━━━━━━
🎙️ *RECUERDA:* El dinero es un excelente esclavo, pero un amo terrible. ¡JAJAJA! 📻✨`.trim()

        // Imagen temática de Alastor con dinero/negocios
        const cryptoImg = 'https://files.catbox.moe/khczrx.jpg' // Reutilizando tu imagen o puedes poner otra

        await conn.sendFile(m.chat, cryptoImg, 'crypto.jpg', cryptoMessage, m)

    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, `📻 *Error de sintonía:* No pude conectar con el mercado de valores del infierno. Inténtalo más tarde.`, m)
    }
}

handler.help = ['crypto', 'precio']
handler.tags = ['tools']
// Responde a .crypto o #crypto (y sus variantes)
handler.command = /^(crypto|precio|coin|btc)$/i

export default handler
