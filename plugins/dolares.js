import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
    await m.reply('⏳ Consultando el mercado de divisas global...')

    try {
        // Usamos una API con amplia cobertura internacional
        const res = await axios.get('https://open.er-api.com/v6/latest/USD')
        const rates = res.data.rates

        const texto = `
💵 *VALOR DEL DÓLAR (1 USD)* 💵

🇲🇽 *MÉXICO (MXN):* ${rates.MXN.toFixed(2)}

🌎 *LATINOAMÉRICA:*
🇻🇪 *Venezuela (VES):* ${rates.VES ? rates.VES.toFixed(2) : 'No disponible'}
🇦🇷 *Argentina (ARS):* ${rates.ARS.toFixed(2)}
🇨🇴 *Colombia (COP):* ${rates.COP.toFixed(2)}
🇵🇪 *Perú (PEN):* ${rates.PEN.toFixed(2)}
🇨🇱 *Chile (CLP):* ${rates.CLP.toFixed(2)}
🇧🇷 *Brasil (BRL):* ${rates.BRL.toFixed(2)}
🇺🇾 *Uruguay (UYU):* ${rates.UYU.toFixed(2)}
🇵🇾 *Paraguay (PYG):* ${rates.PYG.toFixed(0)}
🇧🇴 *Bolivia (BOB):* ${rates.BOB.toFixed(2)}
🇨🇷 *Costa Rica (CRC):* ${rates.CRC.toFixed(2)}
🇩🇴 *Rep. Dominicana (DOP):* ${rates.DOP.toFixed(2)}
🇬🇹 *Guatemala (GTQ):* ${rates.GTQ.toFixed(2)}
🇭🇳 *Honduras (HNL):* ${rates.HNL.toFixed(2)}
🇳🇮 *Nicaragua (NIO):* ${rates.NIO.toFixed(2)}
🇵🇦 *Panamá (PAB):* ${rates.PAB.toFixed(2)}
🇨🇺 *Cuba (CUP):* ${rates.CUP.toFixed(2)}
🇪🇨 *Ecuador (USD):* 1.00
🇸🇻 *El Salvador (USD):* 1.00

🇪🇺 *EUROPA:*
🇪🇺 *Euro (EUR):* ${rates.EUR.toFixed(2)}
🇬🇧 *Libra Esterlina (GBP):* ${rates.GBP.toFixed(2)}
🇨🇭 *Franco Suizo (CHF):* ${rates.CHF.toFixed(2)}

🌏 *ASIA:*
🇨🇳 *China (CNY):* ${rates.CNY.toFixed(2)}
🇯🇵 *Japón (JPY):* ${rates.JPY.toFixed(2)}
🇰🇷 *Corea del Sur (KRW):* ${rates.KRW.toFixed(2)}
🇮🇳 *India (INR):* ${rates.INR.toFixed(2)}

✨ *Usa ${usedPrefix}${command} para actualizar.*
`.trim()

        await conn.reply(m.chat, texto, m)

    } catch (e) {
        console.error(e)
        throw `❌ Error al obtener los datos. Inténtalo más tarde.`
    }
}

handler.help = ['dolar']
handler.tags = ['tools']
handler.command = ['dolar', 'usd', 'divisas'] 

export default handler
