const axios = require('axios');

client.on('message', async (msg) => {
    // 1. Forzamos que el texto sea un String y quitamos espacios al inicio/final
    const textoRecibido = (msg.body || "").trim();
    
    // 2. Extraemos el primer carácter (Prefijo)
    const prefijo = textoRecibido.charAt(0);

    // 3. Verificamos si es . o #
    if (prefijo === '.' || prefijo === '#') {
        
        // Extraemos el comando y lo limpiamos totalmente
        const comando = textoRecibido.slice(1).split(/ +/)[0].toLowerCase().trim();
        
        // ESTO APARECERÁ EN TU CONSOLA DE PC (Para saber qué recibe el bot)
        console.log(`Prefijo detectado: ${prefijo} | Comando: ${comando}`);

        // 4. Lógica del comando
        if (comando === 'dolar') {
            try {
                // API pública sin necesidad de Key para pruebas
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
                const rates = response.data.rates;

                const mensaje = `
💵 *VALOR DEL DÓLAR*
_Consultado con prefijo: ${prefijo}_

🇲🇽 MXN: ${rates.MXN.toFixed(2)}
🇦🇷 ARS: ${rates.ARS.toFixed(2)}
🇪🇺 EUR: ${rates.EUR.toFixed(2)}
🇨🇴 COP: ${rates.COP.toFixed(0)}
                `.trim();

                return await msg.reply(mensaje);

            } catch (error) {
                console.error("Error al obtener divisas:", error);
                return await msg.reply("❌ Error al obtener los precios.");
            }
        }
    }
});
