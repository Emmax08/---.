/**
 * @name HazbinCombat
 * @plugin HazbinHotel
 * @description Pelea contra los personajes de Hazbin Hotel y llega hasta Alastor.
 * @author Gemini
 */

// Base de datos temporal para niveles de combate
if (!global.hazbinStats) global.hazbinStats = {};

module.exports = {
    name: "pelear",
    alias: ["combate", "hazbin"],
    prefix: [".", "#"],

    async run(client, message, args) {
        try {
            const uid = message.author.id;
            
            // Inicializar stats del usuario si no existen
            if (!global.hazbinStats[uid]) {
                global.hazbinStats[uid] = { nivel: 1, victorias: 0 };
            }

            const stats = global.hazbinStats[uid];
            
            // --- CONFIGURACIÓN DE ENEMIGOS (Progresión) ---
            const enemigos = [
                { n: "Niffty", hp: 50, d: "Nivel 1", m: 1000000, e: 1000000 },
                { n: "Angel Dust", hp: 150, d: "Nivel 2", m: 50000000, e: 50000000 },
                { n: "Vaggie", hp: 300, d: "Nivel 3", m: 500000000, e: 500000000 },
                { n: "Sir Pentious", hp: 600, d: "Nivel 4", m: 1000000000, e: 1000000000 },
                { n: "Adam (Primer Hombre)", hp: 1500, d: "Nivel 5", m: 500000000000, e: 500000000000 },
                { n: "Lucifer Morningstar", hp: 5000, d: "Nivel 6 (Semi-Dios)", m: 1000000000000, e: 1000000000000 },
                { n: "ALASTOR (El Demonio de la Radio)", hp: 20000, d: "NIVEL FINAL: DIVINO SUPREMO", m: 35000000000000000, e: 35000000000000000 }
            ];

            // Seleccionar enemigo según el nivel del usuario
            let index = stats.nivel - 1;
            if (index >= enemigos.length) index = enemigos.length - 1; // Si ya ganó a todos, pelea contra Alastor siempre
            
            const rival = enemigos[index];
            const esAlastor = rival.n === "ALASTOR (El Demonio de la Radio)";

            // --- LÓGICA DE COMBATE ---
            // Probabilidad base de ganar: 60% inicial, pero baja según el nivel
            let probGanar = 60 - (stats.nivel * 5); 
            if (esAlastor) probGanar = 5; // Solo 5% de probabilidad contra Alastor

            const suerte = Math.random() * 100;
            const gano = suerte <= probGanar;

            let msg = `🔥 **COMBATE EN EL INFIERNO** 🔥\n`;
            msg += `━━━━━━━━━━━━━━━━━━━━\n`;
            msg += `👤 **Luchador:** <@${uid}>\n`;
            msg += `⚔️ **Enemigo:** ${rival.n}\n`;
            msg += `📊 **Dificultad:** ${rival.d}\n`;
            msg += `━━━━━━━━━━━━━━━━━━━━\n`;

            if (gano) {
                stats.victorias++;
                stats.nivel++; // Sube de nivel para el próximo enemigo
                
                msg += `🏆 **¡HAS GANADO EL ENCUENTRO!**\n`;
                msg += `🎁 **Recompensas Obtenidas:**\n`;
                msg += `💰 Monedas: +${rival.m.toLocaleString()}\n`;
                msg += `✨ Experiencia: +${rival.e.toLocaleString()}\n`;
                
                if (esAlastor) {
                    msg += `\n🔱 **¡HAS DERROTADO AL DEMONIO DE LA RADIO!**\n`;
                    msg += `👑 Has obtenido el título de: **Soberano del Infierno**\n`;
                } else {
                    msg += `\n🔜 Próximo rival desbloqueado: **${enemigos[index + 1]?.n || "Nadie"}**`;
                }
            } else {
                msg += `💀 **HAS SIDO DERROTADO...**\n`;
                msg += `💬 *"${rival.n} te mira con desprecio y se marcha."*\n`;
                msg += `❌ No obtuviste recompensas. Inténtalo de nuevo.`;
                
                // Si pierdes contra Alastor, bajas un nivel por el trauma
                if (esAlastor && stats.nivel > 1) stats.nivel--; 
            }

            msg += `\n━━━━━━━━━━━━━━━━━━━━`;
            return message.channel.send(msg);

        } catch (err) {
            console.error("Error en Plugin HazbinCombat: " + err);
        }
    }
};
