client.on('message', async (msg) => {
    // 1. Capturamos el contenido del mensaje
    const texto = msg.body;

    // 2. Verificamos que no esté vacío y que empiece con tus prefijos (. o #)
    if (!texto || !['.', '#'].includes(texto[0])) return;

    // 3. Separamos el prefijo, el comando y los argumentos
    const prefijo = texto[0];
    const args = texto.slice(1).trim().split(/ +/);
    const comando = args.shift().toLowerCase();

    // 4. EL COMANDO DOLAR
    if (comando === 'dolar') {
        try {
            const API_KEY = 'TU_API_KEY_AQUÍ'; 
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
            const rates = response.data.conversion_rates;

            const mensaje = `💵 *Precio del Dólar*\n\n🇲🇽 MXN: ${rates.MXN}\n🇪🇺 EUR: ${rates.EUR}\n🇦🇷 ARS: ${rates.ARS}`;
            
            // IMPORTANTE: Verifica si tu librería usa 'msg.reply' o 'client.sendMessage'
            await msg.reply(mensaje); 

        } catch (e) {
            console.log("Error en comando dolar:", e);
            await msg.reply("❌ Error al obtener datos.");
        }
    }
});
