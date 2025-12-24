import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
    // Enviamos mensaje de espera
    await m.reply('⏳ Consultando el mercado de criptomonedas...')

    try {
        // Obtenemos los datos de las principales criptos desde Binance
        // Definimos los pares que queremos mostrar
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'DOGEUSDT', 'XRPUSDT', 'DOTUSDT']
        
        let res = await fetch(`https://api.binance.com/api/v3/ticker/24hr`)
        if (!res.ok) throw new Error()
        let json = await res.json()

        // Filtramos solo las que nos interesan
        let data = json.filter(item => symbols.includes(item.symbol))

        let cryptoList = data.map(coin => {
            let name = coin.symbol.replace('USDT', '')
            let price = parseFloat(coin.lastPrice).toLocaleString()
            let change = parseFloat(coin.priceChangePercent).toFixed(2)
            let emoji = change >= 0 ? '📈' : '📉'
            return `💰 *${name}:* $${price} (${change}% ${emoji})`
        }).join('\n')

        const cryptoMessage = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *VALOR DEL MERCADO CRIPTO* ✨
━━━━━━━━━━━━━━━━━━━━

${cryptoList}

━━━━━━━━━━━━━━━━━━━━
🎙️ *RECUERDA:* ¡Nunca dejes de sonreír! 📻✨`.trim()

        const cryptoImg = 'https://files.catbox.moe/khczrx.jpg'
        
        // Enviamos la imagen con la lista completa
        await conn.sendFile(m.chat, cryptoImg, 'crypto.jpg', cryptoMessage, m)

    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, `🎙️ 📻 *¡Interferencia!* Hubo un error al conectar con el mercado.`, m)
    }
}

handler.help = ['crypto', 'cryptos']
handler.tags = ['tools']
// Formato de comando solicitado
handler.command = ['crypto', 'cryptos', 'bitcoin', 'btc', 'preciocripto'] 

export default handler
