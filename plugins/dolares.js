const axios = require('axios');

client.on('message', async (msg) => {
    // 1. Extraer el cuerpo del mensaje
    const body = msg.body || ""; 
    
    // 2. Verificar si empieza con . o #
    if (body.startsWith('.') || body.startsWith('#')) {
        
        // 3. Separar comando y argumentos correctamente
        const args = body.slice(1).trim().split(/ +/);
        const comando = args.shift().toLowerCase();

        // --- COMANDO DOLAR ---
        if (comando === 'dolar') {
            try {
                // Usamos una API que no requiere registro para que pruebes de inmediato
                const res = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
                const rates = res.data.rates;

                const texto = `
💵 *VALOR DEL DÓLAR*
Base: 1 USD

🇲🇽 MXN: ${rates.MXN.toFixed(2)}
🇦🇷 ARS: ${rates.ARS.toFixed(2)}
🇨🇴 COP: ${rates.COP.toFixed(0)}
🇪🇺 EUR: ${rates.EUR.toFixed(2)}
🇵🇪 PEN: ${rates.PEN.toFixed(2)}

_Respuesta enviada usando prefijo: ${body[0]}_
                `.trim();

                return await msg.reply(texto);

            } catch (error) {
                console.error("Error en API:", error);
                return await msg.reply("❌ No pude obtener los precios ahora mismo.");
            }
        }

        // Si llega aquí y no entró al "if (comando === 'dolar')", es que no reconoce la palabra
        console.log(`Comando detectado pero no programado: ${comando}`);
    }
});
