const axios = require('axios');

// Escuchador de mensajes
client.on('message', async (msg) => {
    // Extraer el prefijo (. o #)
    const prefijo = msg.body.charAt(0);
    
    // Validar si el mensaje inicia con tus prefijos guardados
    if (prefijo === '.' || prefijo === '#') {
        
        // Obtener el comando (ej: "dolar")
        const args = msg.body.slice(1).trim().split(/ +/);
        const comando = args.shift().toLowerCase();

        // --- LÓGICA DEL COMANDO DOLAR ---
        if (comando === 'dolar') {
            try {
                // API Key de https://www.exchangerate-api.com/
                const API_KEY = 'TU_API_KEY_AQUÍ'; 
                const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
                
                const response = await axios.get(url);
                const rates = response.data.conversion_rates;

                // Armamos la lista de monedas
                const listaPrecios = `
💵 *TIPO DE CAMBIO (1 USD)* 💵

🇪🇺 *Euro:* ${rates.EUR.toFixed(2)}
🇲🇽 *Peso MX:* ${rates.MXN.toFixed(2)}
🇨🇴 *Peso CO:* ${rates.COP.toFixed(0)}
🇦🇷 *Peso AR:* ${rates.ARS.toFixed(2)}
🇧🇷 *Real BR:* ${rates.BRL.toFixed(2)}

✨ *Usa ${prefijo}${comando} para actualizar.*
                `.trim();

                await client.sendMessage(msg.from, { text: listaPrecios });

            } catch (error) {
                console.error(error);
                await msg.reply('⚠️ Error al conectar con la API de divisas.');
            }
        }
    }
});
