import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
    // Enviamos un mensaje de "espera"
    await m.reply('⏳ Consultando el tipo de cambio en tiempo real...')

    try {
        // Usamos la API de exchangerate-api
        const res = await axios.get('https://api.exchangerate-api.com/v4/latest/USD')
        const rates = res.data.rates

        const texto = `
💵 *VALOR DEL DÓLAR (1 USD) EN LATAM* 💵

🇲🇽 *México (MXN):* ${rates.MXN.toFixed(2)}
🇦🇷 *Argentina (ARS):* ${rates.ARS.toFixed(2)}
🇧🇷 *Brasil (BRL):* ${rates.BRL.toFixed(2)}
🇨🇱 *Chile (CLP):* ${rates.CLP.toFixed(2)}
🇨🇴 *Colombia (COP):* ${rates.COP.toFixed(2)}
🇨🇷 *Costa Rica (CRC):* ${rates.CRC.toFixed(2)}
🇩🇴 *Rep. Dominicana (DOP):* ${rates.DOP.toFixed(2)}
🇬🇹 *Guatemala (GTQ):* ${rates.GTQ.toFixed(2)}
🇭🇳 *Honduras (HNL):* ${rates.HNL.toFixed(2)}
🇳🇮 *Nicaragua (NIO):* ${rates.NIO.toFixed(2)}
🇵🇦 *Panamá (PAB):* ${rates.PAB.toFixed(2)}
🇵🇪 *Perú (PEN):* ${rates.PEN.toFixed(2)}
🇵🇾 *Paraguay (PYG):* ${rates.PYG.toFixed(2)}
🇺🇾 *Uruguay (UYU):* ${rates.UYU.toFixed(2)}
🇧🇴 *Bolivia (BOB):* ${rates.BOB.toFixed(2)}

🇪🇺 *Extra - Euro (EUR):* ${rates.EUR.toFixed(2)}

✨ *Usa ${usedPrefix}${command} para actualizar.*
`.trim()

        await conn.reply(m.chat, texto, m)

    } catch (e) {
        console.error(e)
        throw `❌ Hubo un error al obtener los datos de las divisas.`
    }
}

handler.help = ['dolar']
handler.tags = ['tools']
handler.command = ['dolar', 'usd', 'divisas'] 

export default handler
