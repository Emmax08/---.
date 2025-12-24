let handler = async (m, { conn, usedPrefix, command }) => {
    // Verificamos que la base de datos de usuarios exista
    if (!global.db.data.users) global.db.data.users = {}
    
    // Obtenemos al usuario y nos aseguramos de que existan sus datos
    let user = global.db.data.users[m.sender]
    if (!user) {
        global.db.data.users[m.sender] = {}
        user = global.db.data.users[m.sender]
    }

    // Inicializamos las variables del juego si no existen
    if (user.hazbinNivel === undefined) user.hazbinNivel = 1
    if (user.hazbinVictorias === undefined) user.hazbinVictorias = 0
    if (user.money === undefined) user.money = 0
    if (user.exp === undefined) user.exp = 0

    // --- CONFIGURACIÓN DE ENEMIGOS ---
    const enemigos = [
        { n: "Niffty", m: 1000000, e: 1000000 },
        { n: "Angel Dust", m: 50000000, e: 50000000 },
        { n: "Vaggie", m: 500000000, e: 500000000 },
        { n: "Sir Pentious", m: 1000000000, e: 1000000000 },
        { n: "Adam", m: 500000000000, e: 500000000000 },
        { n: "Lucifer", m: 1000000000000, e: 1000000000000 },
        { n: "ALASTOR", m: 35000000000000000, e: 35000000000000000 }
    ]

    let index = user.hazbinNivel - 1
    if (index >= enemigos.length) index = enemigos.length - 1

    const rival = enemigos[index]
    const esAlastor = rival.n === "ALASTOR"

    // Mensaje de inicio
    await conn.sendMessage(m.chat, { text: `🔥 *FASE ${user.hazbinNivel}:* Te enfrentas a *${rival.n}*...` }, { quoted: m })

    // Lógica de probabilidad
    let probGanar = 60 - (user.hazbinNivel * 7)
    if (esAlastor) probGanar = 5 

    const suerte = Math.random() * 100
    const gano = suerte <= probGanar

    let texto = `🎙️ 📻 ━━━━━ • 🦌 • ━━━━━ 📻 🎙️\n`
    texto += `👤 *PELEADOR:* @${m.sender.split('@')[0]}\n`
    texto += `⚔️ *RIVAL:* ${rival.n}\n`
    texto += `━━━━━━━━━━━━━━━━━━━━\n\n`

    if (gano) {
        user.hazbinVictorias += 1
        user.hazbinNivel += 1
        user.money += rival.m
        user.exp += rival.e

        texto += `🏆 *¡VICTORIA EN EL INFIERNO!*\n`
        texto += `🎁 *BOTÍN:* \n`
        texto += `💰 +${rival.m.toLocaleString()} Monedas\n`
        texto += `✨ +${rival.e.toLocaleString()} Exp\n\n`

        if (esAlastor) {
            texto += `🔱 *¡EL DEMONIO DE LA RADIO HA CAÍDO!* 🔱\n`
            texto += `👑 *HAS CONQUISTADO EL INFIERNO.*`
        } else {
            texto += `🔜 Siguiente fase desbloqueada.`
        }
    } else {
        texto += `💀 *DERROTADO POR ${rival.n.toUpperCase()}...*\n`
        texto += `💬 _"Sigue intentándolo, pecador."_\n`
        texto += `❌ No obtuviste recompensas.`
        
        if (esAlastor && user.hazbinNivel > 1) user.hazbinNivel--
    }

    texto += `\n\n━━━━━━━━━━━━━━━━━━━━\n🎙️ *INFO:* Tienes ${user.hazbinVictorias} victorias. 📻✨`

    return conn.sendMessage(m.chat, { text: texto, mentions: [m.sender] }, { quoted: m })
}

handler.help = ['pelear']
handler.tags = ['game']
handler.command = ['pelear', 'hazbin', 'combate'] 

export default handler
