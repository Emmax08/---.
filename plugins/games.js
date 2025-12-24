/**
 * Comando: .explorar o #explorar
 * Temática: Minecraft en el Infierno de Hazbin Hotel
 */

const handler = async (m, { conn, command, usedPrefix }) => {
    // Probabilidades
    const chanceRedencionEnd = 0.001; // 0.1% El "Juego Pasado"
    const chanceMineriaExitosa = 0.35; // 35% de éxito normal
    
    const random = Math.random();
    let mensaje = "";

    // 1. EL LOGRO DEFINITIVO (0.1%) - EL DRAGÓN DEL ENDER-REDENCIÓN
    if (random <= chanceRedencionEnd) {
        const rewards = { money: 10000, xp: 50000, items: 30000 };
        
        mensaje = `✨ **¡LOGRO LEGENDARIO: ADIÓS AL INFIERNO!** ✨\n\n`;
        mensaje += `Has construido un portal de Netherita pura y derrotaste al **Ender-Dragon de Alastor**.\n`;
        mensaje += `¡Has pasado el juego y alcanzado la Redención Total!\n\n`;
        mensaje += `*Botín del Cielo:*\n`;
        mensaje += `💰 Almas de Diamante: +${rewards.money}\n`;
        mensaje += `🧬 XP de Angel: +${rewards.xp}\n`;
        mensaje += `⭐ Fragmentos Estelares: +${rewards.items}\n\n`;
        mensaje += `_“The show must go on... in Heaven!”_`;
        
        // global.db.data.users[m.sender].money += rewards.money;
    } 
    
    // 2. MINERÍA Y COMBATE EXITOSO (35%)
    else if (random <= chanceMineriaExitosa) {
        const eventos = [
            { act: "picando en las minas de cristal de Husk", loot: "64 Diamantes de Sangre", money: 1200 },
            { act: "asaltando una Bastión custodiada por Sir Pentious", loot: "Lingotes de Netherita Real", money: 2500 },
            { act: "cultivando Verrugas del Nether con Charlie", loot: "Pociones de Redención", money: 800 },
            { act: "intercambiando con Piglins en el estudio de Valentino", loot: "Manzanas de Oro Dopadas", money: 1500 }
        ];
        
        const res = eventos[Math.floor(Math.random() * eventos.length)];
        
        mensaje = `⛏️ **MINECRAFT: HAZBIN EDITION** 😈\n\n`;
        mensaje += `Te encontraste *${res.act}*.\n`;
        mensaje += `💵 Ganancia: +${res.money} Almas\n`;
        mensaje += `📦 Item: ${res.loot}`;
    } 
    
    // 3. MUERTE EN EL MUNDO CUADRADO (FALLO)
    else {
        const muertes = [
            "Un Creeper con la sonrisa de Alastor explotó en tu cara. ¡BOOM!",
            "Caíste en un pozo de lava mientras Angel Dust te distraía.",
            "Vaggie te confundió con un Exterminador y te lanzó su lanza de Netherita.",
            "Intentaste dormir en el Nether del Hotel y la cama explotó.",
            "Un Enderman te robó el bloque de tierra donde estabas parado."
        ];
        mensaje = `💀 **YOU DIED:** ${muertes[Math.floor(Math.random() * muertes.length)]}`;
    }

    await conn.reply(m.chat, mensaje, m);
};

handler.help = ['explorar'];
handler.tags = ['rpg'];
handler.command = /^(explorar|mine|mc)$/i; // .explorar, .mine, .mc, #explorar, etc.

export default handler;
