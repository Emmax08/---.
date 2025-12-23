import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Si el usuario escribe solo .btc o .eth, el bot sabrá qué buscar
    let coin = text ? text.trim().toLowerCase() : (command === 'btc' ? 'bitcoin' : (command === 'eth' ? 'ethereum' : 'bitcoin'))
    
    try {
        // Consultamos a CoinGecko con una cabecera para evitar bloqueos
        let response = await fetch(`https://api.coingecko.com/api/v2/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        })
        
        let data = await response.json()

        // Si la moneda no es válida o la API no responde datos correctos
        if (!data[coin]) {
            return await conn.reply(m.chat, `🎙️ 📻 *¡Interferencia!* No encuentro a *${coin}* en mis registros.\n\nPrueba con: *bitcoin, ethereum, solana o dogecoin*.`, m)
        }

        let price = data[coin].usd
        let change = data[coin].usd_24h_change ? data[coin].usd_24h_change.toFixed(2) : '0.00'
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
🎙️ *RECUERDA:* ¡Una sonrisa es una herramienta poderosa, incluso en la bancarrota! ¡JAJAJA! 📻✨`.trim()

        const cryptoImg = 'https://files.catbox.moe/khczrx.jpg'
        await conn.sendFile(m.chat, cryptoImg, 'crypto.jpg', cryptoMessage, m)

    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, `📻 *Señal débil:* El mercado negro del infierno está saturado. Reintenta en un momento, querido.`, m)
    }
}

handler.help = ['crypto', 'btc', 'eth']
handler.tags = ['tools']
// Esta línea es clave: asegura que el bot reconozca todos estos términos como comandos
handler.command = /^(crypto|coin|bitcoin|btc|eth|sol|doge)$/i 

export default handler
