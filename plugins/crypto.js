import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Limpiamos el texto de espacios innecesarios
    let coin = text ? text.trim().toLowerCase() : 'bitcoin'
    
    try {
        // Usamos una URL de respaldo y un User-Agent para evitar bloqueos de la API
        let res = await fetch(`https://api.coingecko.com/api/v2/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        
        if (!res.ok) throw new Error('API_ERROR')
        let json = await res.json()

        // Verificación estricta de la moneda
        if (!json || !json[coin] || json[coin].usd === undefined) {
            return await conn.reply(m.chat, `🎙️ 📻 *¡Interferencia, querido!* No encuentro a *${coin}* en el mercado negro.\n\nPrueba con nombres exactos como: \n*bitcoin, ethereum, solana, dogecoin o litecoin*.`, m)
        }

        let price = json[coin].usd
        let change = json[coin].usd_24h_change ? json[coin].usd_24h_change.toFixed(2) : '0.00'
        let emoji = change >= 0 ? '📈' : '📉'
        let status = change >= 0 ? '¡Una subida pecaminosa!' : '¡Cayendo al fondo del abismo!'

        const cryptoMessage = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *EL VALOR DEL MERCADO* ✨
━━━━━━━━━━━━━━━━━━━━

💰 𝑀𝑂𝑁𝐸𝐷𝐴: *${coin.toUpperCase()}*
💵 𝑃𝑅𝐸𝐶𝐼𝑂: *USD $${price.toLocaleString()}*
📊 𝐶𝐴𝑀𝐵𝐼𝑂 (24h): *${change}%* ${emoji}

🎭 *ESTADO:* ${status}

━━━━━━━━━━━━━━━━━━━━
🎙️ *RECUERDA:* Nunca estás totalmente vestido sin una sonrisa... ¡especialmente cuando pierdes dinero! 📻✨`.trim()

        const cryptoImg = 'https://files.catbox.moe/khczrx.jpg'
        await conn.sendFile(m.chat, cryptoImg, 'crypto.jpg', cryptoMessage, m)

    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, `📻 *Señal débil:* La conexión con el mercado de valores falló. Intenta de nuevo en unos segundos.`, m)
    }
}

handler.help = ['crypto', 'bitcoin']
handler.tags = ['tools']
handler.command = /^(crypto|coin|bitcoin|btc|eth|sol)$/i // Añadí btc y eth como comandos directos

export default handler
