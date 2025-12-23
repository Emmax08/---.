import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
    // Enviamos un mensaje de "espera"
    await m.reply('⏳ Consultando el tipo de cambio...')

    try {
        // Usamos una API pública que no requiere Key para evitar errores de configuración
        const res = await axios.get('https://api.exchangerate-api.com/v4/latest/USD')
        const rates = res.data.rates

        const texto = `
💵 *VALOR DEL DÓLAR (1 USD)* 💵

🇲🇽 *Peso Mexicano:* ${rates.MXN.toFixed(2)}
🇦🇷 *Peso Argentino:* ${rates.ARS.toFixed(2)}
🇨🇴 *Peso Colombiano:* ${rates.COP.toFixed(0)}
🇵🇪 *Sol Peruano:* ${rates.PEN.toFixed(2)}
🇪🇺 *Euro:* ${rates.EUR.toFixed(2)}

✨ *Usa ${usedPrefix}${command} para actualizar.*
`.trim()

        await conn.reply(m.chat, texto, m)

    } catch (e) {
        console.error(e)
        throw `❌ Hubo un error al obtener los datos.`
    }
}

// Estos son los activadores del comando
handler.help = ['dolar']
handler.tags = ['tools']
handler.command = ['dolar', 'usd', 'divisas'] // Responde a .dolar, .usd y .divisas

export default handler
