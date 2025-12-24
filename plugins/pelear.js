// Base de datos temporal para niveles (se reinicia al apagar el bot)
// Si quieres que sea permanente, debería guardarse en global.db.data.users[m.sender]
if (!global.hazbinStats) global.hazbinStats = {}

let handler = async (m, { conn, usedPrefix, command }) => {
    const uid = m.sender
    
    // Inicializar stats del usuario si no existen
    if (!global.hazbinStats[uid]) {
        global.hazbinStats[uid] = { nivel: 1, victorias: 0 }
    }

    const stats = global.hazbinStats[uid]

    // --- CONFIGURACIÓN DE ENEMIGOS ---
    const enemigos = [
        { n: "Niffty", hp: 50, d: "Nivel 1", m: 1000000, e: 1000000 },
        { n: "Angel Dust", hp: 150, d: "Nivel 2", m: 50000000, e: 50000000 },
        { n: "Vaggie", hp: 300, d: "Nivel 3", m: 500000000, e: 500000000 },
        { n: "Sir Pentious", hp: 600, d: "Nivel 4", m: 1000000000, e: 1000000000 },
        { n: "Adam (Primer Hombre)", hp: 1500, d: "Nivel 5", m: 500000000000, e: 500000000000 },
        { n: "Lucifer Morningstar", hp: 5000, d: "Nivel 6 (Semi-Dios)", m: 1000000000000, e: 1000000000000 },
        { n: "ALASTOR (El Demonio de la Radio)", hp: 20000, d: "NIVEL FINAL", m: 35000000000000000, e: 35000000000000000 }
    ]

    let index = stats.nivel - 1
    if (index >= enemigos.length) index = enemigos.length - 1

    const rival = enemigos[index]
    const esAlastor = rival.n.includes("ALASTOR")

    await m.reply(`🔥 *INICIANDO COMBATE EN EL INFIERNO...* 🔥\n\n⚔️ *Rival:* ${rival.n}\n📊 *Dificultad:* ${rival.d}`)

    // Lógica de probabilidad
    let probGanar = 60 - (stats.nivel * 5)
    if (esAlastor) probGanar = 5 

    const suerte = Math.random() * 100
    const gano = suerte <= probGanar

    let texto = `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️\n`
    texto += `👤 *LUCHADOR:* @${uid.split('@')[0]}\n`
    texto += `⚔️ *ENEMIGO:* ${rival.n}\n`
    texto += `━━━━━━━━━━━━━━━━━━━━\n\n`

    if (gano) {
        stats.victorias++
        stats.nivel++

        // Si tu bot tiene sistema de economía global, esto suma los valores
        if (global.db.data.users[uid]) {
            global.db.data.users[uid].money += rival.m
            global.db.data.users[uid].exp += rival.e
        }

        texto += `🏆 *¡HAS GANADO EL ENCUENTRO!*\n`
        texto += `🎁 *RECOMPENSAS:* \n`
        texto += `💰 Monedas: +${rival.m.toLocaleString()}\n`
        texto += `✨ Exp: +${rival.e.toLocaleString()}\n\n`

        if (esAlastor) {
            texto += `🔱 *¡HAS DERROTADO AL DEMONIO DE LA RADIO!*\n`
            texto += `👑 *Título:* Soberano del Infierno`
        } else {
            texto += `🔜 *Próximo rival desbloqueado:* ${enemigos[index + 1]?.n || "Alastor"}`
        }
    } else {
        texto += `💀 *HAS SIDO DERROTADO...*\n`
        texto += `💬 _"${rival.n} te mira con desprecio y se marcha."_\n`
        texto += `❌ No obtuviste recompensas.`
        
        if (esAlastor && stats.nivel > 1) stats.nivel--
    }

    texto += `\n\n━━━━━━━━━━━━━━━━━━━━\n🎙️ *RECUERDA:* ¡Nunca dejes de sonreír! 📻✨`

    return conn.reply(m.chat, texto, m, { mentions: [uid] })
}

handler.help = ['pelear', 'hazbin']
handler.tags = ['game']
handler.command = ['pelear', 'combate', 'hazbin'] 

export default handler
