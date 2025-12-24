/**
 * @name RuletaViciosa
 * @plugin Ruleta
 * @description Ruleta con progresión de costo y premios masivos.
 * @author Gemini
 */

// Objeto para guardar giros (se mantiene mientras el bot esté encendido)
if (!global.perfilGiros) global.perfilGiros = {};

module.exports = {
    name: "ruleta",
    alias: ["r", "spin"],
    prefix: [".", "#"], // Prefijos configurados
    
    async run(client, message, args) {
        try {
            const userId = message.author.id;
            
            // Contador de giros
            if (!global.perfilGiros[userId]) global.perfilGiros[userId] = 0;
            global.perfilGiros[userId]++;
            
            const numGiro = global.perfilGiros[userId];
            let costo = 0;
            let probExito = 2; // 2% por defecto
            let fase = "";
            let esModoDios = false;

            // --- LÓGICA DE FASES ---
            if (numGiro <= 10) {
                costo = 0;
                fase = "🟢 GRATIS";
            } else if (numGiro <= 20) {
                costo = 1000000; // 1 Millón
                fase = "🟡 ADICTO (1M)";
            } else if (numGiro <= 30) {
                costo = 1000000000000; // 1 Billón
                fase = "🔴 RIESGO (1B)";
            } else {
                costo = 200000000000000000; // 200,000 Billones
                probExito = 100;
                fase = "🔱 DIVINO (200k B)";
                esModoDios = true;
            }

            // --- PROCESO DE SUERTE ---
            const azar = Math.random() * 100;
            let premioFinal = { n: "Nada", m: 0, x: 0 };

            if (esModoDios) {
                // Premios 100% seguros y rotos
                const premiosDios = [
                    { n: "🪐 GALAXIA ENTERA", m: 35000000000000000, x: 35000000000000000 },
                    { n: "👑 DEIDAD SUPREMA", m: 99999999999999999, x: 99999999999999999 }
                ];
                premioFinal = premiosDios[Math.floor(Math.random() * premiosDios.length)];
            } else if (azar <= probExito) {
                // El milagro del 2%
                premioFinal = { n: "💎 PREMIO MAYOR", m: 35000000000000, x: 35000000000000 };
            } else {
                // El 98% de perder
                const basura = ["Una piedra", "Aire", "Un clip", "Nada"];
                premioFinal = { n: basura[Math.floor(Math.random() * basura.length)], m: 0, x: 0 };
            }

            // --- MENSAJE FINAL ---
            const renderCosto = costo === 0 ? "GRATIS" : costo.toLocaleString();
            
            let msg = `🎰 **RULETA DE PLUGINS** 🎰\n`;
            msg += `━━━━━━━━━━━━━━\n`;
            msg += `👤 **Usuario:** <@${userId}>\n`;
            msg += `📊 **Fase:** ${fase} (Giro #${numGiro})\n`;
            msg += `💰 **Costo:** ${renderCosto}\n`;
            msg += `━━━━━━━━━━━━━━\n`;
            msg += `🎁 **Resultado:** ${premioFinal.n}\n`;
            msg += `💵 **Monedas:** +${premioFinal.m.toLocaleString()}\n`;
            msg += `✨ **XP:** +${premioFinal.x.toLocaleString()}\n`;
            msg += `━━━━━━━━━━━━━━\n`;

            if (esModoDios) msg += `🔥 **¡PODER ABSOLUTO!**`;
            else if (azar <= probExito) msg += `🎉 **¡Dichoso 2%! Increíble.**`;
            else msg += `💀 **Suerte nefasta.**`;

            return message.channel.send(msg);

        } catch (err) {
            console.log("Error en el Plugin Ruleta: " + err);
        }
    }
};
