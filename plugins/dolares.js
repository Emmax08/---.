const axios = require('axios');

// Puedes obtener una key gratuita en https://www.exchangerate-api.com/
const API_KEY = 'TU_API_KEY_AQUÍ'; 
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

async function comandoDolar(client, message) {
    try {
        // Obtenemos los cambios basados en el Dólar (USD)
        const response = await axios.get(BASE_URL);
        const rates = response.data.conversion_rates;

        // Seleccionamos las monedas más relevantes (puedes añadir las de tu país)
        const blue = rates['ARS'] ? `\n🇦🇷 *Peso Arg:* ${(rates['ARS']).toFixed(2)}` : '';
        const mxn = rates['MXN'] ? `\n🇲🇽 *Peso Mex:* ${(rates['MXN']).toFixed(2)}` : '';
        const cop = rates['COP'] ? `\n🇨🇴 *Peso Col:* ${(rates['COP']).toFixed(2)}` : '';
        const eur = rates['EUR'] ? `\n🇪🇺 *Euro:* ${(rates['EUR']).toFixed(2)}` : '';
        const brl = rates['BRL'] ? `\n🇧🇷 *Real:* ${(rates['BRL']).toFixed(2)}` : '';

        const textoDolar = `
💵 *VALOR DEL DÓLAR (1 USD)* 💵

${eur}${mxn}${cop}${ars}${brl}

✨ *Actualizado:* ${new Date().toLocaleDateString()}
        `.trim();

        await client.sendMessage(message.from, { text: textoDolar });

    } catch (error) {
        console.error(error);
        message.reply('⚠️ No se pudo obtener el tipo de cambio en este momento.');
    }
}
