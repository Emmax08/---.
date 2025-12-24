/**
 * Comando: .explorar o #explorar
 * Temática: Minecraft x Hazbin Hotel (CON BOTÍN MÍTICO)
 */

const handler = async (m, { conn, usedPrefix }) => {
    const random = Math.random() * 100; // Trabajamos sobre 100 para manejar mejor los decimales
    
    // Configuración de Probabilidades (Escala 0 - 100)
    const chanceMitico = 0.0001;    // 0.0001% (Casi imposible)
    const chanceLegendario = 0.1;   // 0.1% 
    const chanceEpico = 5.0;        // 5%
    const chanceNormal = 30.0;      // 30%
    
    let mensaje = "";

    // 1. 🌌 BOTÍN MÍTICO (0.0001%) - DIOS DEL INFIERNO Y EL END
    if (random <= chanceMitico) {
        mensaje = `🌌 **¡ALERTA DE EVENTO MÍTICO: EL DESPERTAR DEL REY!** 🌌\n\n`;
        mensaje += `¡Has encontrado la **Corona de Lucifer** oculta en un bloque de **Bedrock Indestructible**!\n`;
        mensaje += `El cielo y el infierno se arrodillan ante tu inmenso poder.\n\n`;
        mensaje += `🎁 **RECOMPENSAS DIVINAS:**\n`;
        mensaje += `💰 Almas Infinitas: +1,000,000\n`;
        mensaje += `🧬 Purificación Total (XP): +5,000,000\n`;
        mensaje += `⭐ Prestigio Ancestral: +2,000,000\n`;
        mensaje += `💎 Diamantes Eternos: +50,000\n`;
        mensaje += `🗡️ Arma: [Espada de Alastor - One Hit Kill]\n`;
        mensaje += `🏰 Propiedad: [Dueño del Hotel y del Overworld]\n\n`;
        mensaje += `_“¡IT'S SHOWTIME! Has reescrito la historia.”_`;
        
        // Efecto visual de estrellas/fuego si tu bot lo soporta
    } 

    // 2. ✨ BOTÍN LEGENDARIO (0.1%)
    else if (random <= chanceLegendario) {
        mensaje = `✨ **¡LOGRO LEGENDARIO!** ✨\n\n`;
        mensaje += `¡Derrotaste al Dragón del End de Alastor!\n\n`;
        mensaje += `🎁 **RECOMPENSAS:**\n`;
        mensaje += `💰 Almas: +10,000\n`;
        mensaje += `🧬 Experiencia: +50,000\n`;
        mensaje += `⭐ Prestigio: +30,000\n`;
        mensaje += `📦 Item: [Huevo de Dragón de la Radio]`;
    }

    // 3. 🔥 BOTÍN ÉPICO (5%)
    else if (random <= chanceEpico) {
        mensaje = `🔥 **¡BOTÍN DE OVERLORD!** 🔥\n\n`;
        mensaje += `Asaltaste la caja fuerte de Valentino.\n\n`;
        mensaje += `🎁 **RECOMPENSAS:**\n`;
        mensaje += `💰 Almas: +5,000\n`;
        mensaje += `🧬 XP: +15,000\n`;
        mensaje += `💎 Diamantes: +100\n`;
        mensaje += `🛡️ Armadura: [Set de Netherita Angelical]`;
    }

    // 4. ⛏️ ÉXITO NORMAL (30%)
    else if (random <= chanceNormal) {
        const opciones = [
            { lugar: "las minas de Husk", m: 800, x: 2000, i: "64 Esmeraldas" },
            { lugar: "el jardín de Charlie", m: 500, x: 1500, i: "32 Manzanas de Oro" }
        ];
        const res = opciones[Math.floor(Math.random() * opciones.length)];
        
        mensaje = `⛏️ **EXPLORACIÓN EXITOSA**\n\n`;
        mensaje += `Lugar: *${res.lugar}*\n`;
        mensaje += `💰 Almas: +${res.m}\n`;
        mensaje += `📦 Item: ${res.i}`;
    }

    // 5. 💀 MUERTE
    else {
        const fallos = [
            "Un Creeper con la sonrisa de Alastor te mandó al lobby.",
            "Caíste en lava mientras intentabas ligar con Angel Dust.",
            "Sir Pentious te disparó con su rayo láser por accidente."
        ];
        mensaje = `💀 **YOU DIED**\n\n${fallos[Math.floor(Math.random() * fallos.length)]}`;
    }

    await conn.reply(m.chat, mensaje, m);
};

handler.help = ['explorar'];
handler.tags = ['rpg'];
handler.command = /^(explorar|mine|mc)$/i; 

export default handler;
