/**
 * Comando: .explorar o #explorar
 * Temática: Minecraft x Hazbin Hotel (CON TIEMPO DE ESPERA)
 */

const handler = async (m, { conn, usedPrefix }) => {
    // ---- SISTEMA DE COOLDOWN (15 MINUTOS) ----
    let time = global.db.data.users[m.sender].lastmiming + 900000 // 15 minutos en milisegundos
    if (new Date() - global.db.data.users[m.sender].lastmiming < 900000) {
        let tiempoFaltante = msToTime(time - new Date())
        return await conn.reply(m.chat, `⏱️ **¡Tranquilo, pecador!**\n\nDebes descansar un poco antes de otra expedición. Alastor dice que vuelvas en:\n⏳ \`${tiempoFaltante}\``, m)
    }
    // -------------------------------------------

    const random = Math.random() * 100 
    let mensaje = ""

    // 1. 🌌 BOTÍN MÍTICO (0.0001%)
    if (random <= 0.0001) {
        mensaje = `🌌 **¡EVENTO MÍTICO: CORONA DE LUCIFER!** 🌌\n\n¡Has picado un bloque de Bedrock y encontraste el tesoro del Rey!\n\n🎁 **RECOMPENSAS DIVINAS:**\n💰 Dinero: +1,000,000 Almas\n🧬 XP: +5,000,000\n💎 Diamantes: +50,000\n🗡️ Arma: [Espada de Alastor]\n\n_“¡IT'S SHOWTIME!”_`
        // Actualizar datos aquí...
    } 

    // 2. ✨ BOTÍN LEGENDARIO (0.1%)
    else if (random <= 0.1) {
        mensaje = `✨ **¡LOGRO LEGENDARIO!** ✨\n\n¡Derrotaste al Dragón del End de Alastor!\n\n🎁 **RECOMPENSAS:**\n💰 Almas: +10,000\n🧬 XP: +50,000\n⭐ Prestigio: +30,000`
    }

    // 3. 🔥 BOTÍN ÉPICO (5%)
    else if (random <= 5.0) {
        mensaje = `🔥 **¡BOTÍN DE OVERLORD!** 🔥\n\nAsaltaste la caja fuerte de Valentino.\n\n🎁 **RECOMPENSAS:**\n💰 Almas: +5,000\n🧬 XP: +15,000\n💎 Diamantes: +100`
    }

    // 4. ⛏️ ÉXITO NORMAL (30%)
    else if (random <= 35.0) { // 30% + el 5% anterior
        const opciones = [
            { lugar: "las minas de Husk", m: 800, i: "64 Esmeraldas" },
            { lugar: "el jardín de Charlie", m: 500, i: "32 Manzanas de Oro" }
        ]
        const res = opciones[Math.floor(Math.random() * opciones.length)]
        mensaje = `⛏️ **EXPLORACIÓN EXITOSA**\n\nLugar: *${res.lugar}*\n💰 Almas: +${res.m}\n📦 Item: ${res.i}`
    }

    // 5. 💀 MUERTE
    else {
        const fallos = [
            "Un Creeper con la sonrisa de Alastor te mandó al lobby.",
            "Caíste en lava mientras intentabas ligar con Angel Dust.",
            "Vaggie te dio un lanzazo por andar de chismoso."
        ]
        mensaje = `💀 **YOU DIED**\n\n${fallos[Math.floor(Math.random() * fallos.length)]}`
    }

    // Guardar el tiempo de la última vez que se usó
    global.db.data.users[m.sender].lastmiming = new Date() * 1
    await conn.reply(m.chat, mensaje, m)
}

handler.help = ['explorar']
handler.tags = ['rpg']
handler.command = /^(explorar|mine|mc)$/i 

export default handler

// Función para convertir milisegundos a tiempo legible
function msToTime(duration) {
    var seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60)
    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds
    return minutes + "m " + seconds + "s"
}
