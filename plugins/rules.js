let handler = async (m, { conn, usedPrefix, command }) => {
    // 1. Inicialización de la base de datos del usuario
    let user = global.db.data.users[m.sender]
    if (!user) {
        global.db.data.users[m.sender] = {}
        user = global.db.data.users[m.sender]
    }

    // Inicializamos contadores si no existen
    if (user.ruletaGiros === undefined) user.ruletaGiros = 0
    if (user.money === undefined) user.money = 0
    if (user.exp === undefined) user.exp = 0

    user.ruletaGiros += 1
    const numGiro = user.ruletaGiros
    
    let costo = 0
    let probExito = 2 // 2% de base
    let fase = ""
    let esModoDios = false

    // --- LÓGICA DE FASES Y COSTOS ---
    if (numGiro <= 10) {
        costo = 0
        fase = "🟢 GRATIS"
    } else if (numGiro <= 20) {
        costo = 1000000 
        fase = "🟡 ADICTO"
    } else if (numGiro <= 30) {
        costo = 1000000000000 
        fase = "🔴 RIESGO"
    } else {
        costo = 200000000000000000 
        probExito = 100
        fase = "🔱 DIVINO"
        esModoDios = true
    }

    // --- VERIFICACIÓN DE SALDO ---
    if (user.money < costo) {
        user.ruletaGiros -= 1 // No contamos el giro si no pudo pagar
        return conn.reply(m.chat, `🎙️ 📻 *¡ESTÁTICA!* No tienes suficiente capital para esta apuesta, querido. Necesitas: *${costo.toLocaleString()}* monedas.`, m)
    }

    // Cobramos el costo
    user.money -= costo

    // --- PROCESO DE SUERTE ---
    const azar = Math.random() * 100
    let premioFinal = { n: "Nada", m: 0, x: 0 }

    if (esModoDios) {
        const premiosDios = [
            { n: "🪐 UNA GALAXIA", m: 35000000000000000, x: 35000000000000000 },
            { n: "👑 DEIDAD SUPREMA", m: 99999999999999999, x: 99999999999999999 }
        ]
        premioFinal = premiosDios[Math.floor(Math.random() * premiosDios.length)]
    } else if (azar <= probExito) {
        premioFinal = { n: "💎 PREMIO MAYOR", m: 35000000000000, x: 35000000000000 }
    } else {
        const basura = ["Una piedra", "Aire", "Un clip oxidado", "Polvo estelar"]
        premioFinal = { n: basura[Math.floor(Math.random() * basura.length)], m: 0, x: 0 }
    }

    // Entregamos el premio
    user.money += premioFinal.m
    user.exp += premioFinal.x

    // --- MENSAJE FINAL (Estilo Alastor/Dólar) ---
    let texto = `🎰 *RULETA DEL DEMONIO DE LA RADIO* 🎰\n`
    texto += `🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️\n\n`
    texto += `👤 *APOSTADOR:* @${m.sender.split('@')[0]}\n`
    texto += `📊 *FASE:* ${fase} (Giro #${numGiro})\n`
    texto += `💰 *COSTO:* ${costo === 0 ? "¡GRATIS!" : costo.toLocaleString()}\n`
    texto += `━━━━━━━━━━━━━━━━━━━━\n\n`
    texto += `🎁 *RESULTADO:* ${premioFinal.n}\n`
    texto += `💵 *MONEDAS:* +${premioFinal.m.toLocaleString()}\n`
    texto += `✨ *EXPERIENCIA:* +${premioFinal.x.toLocaleString()}\n\n`
    texto += `━━━━━━━━━━━━━━━━━━━━\n`

    if (esModoDios) {
        texto += `🔥 ¡UN ESPECTÁCULO DIVINO, JAJAJA! 🔥`
    } else if (azar <= probExito) {
        texto += `🎉 ¡Dichoso 2%! El destino te sonríe hoy.`
    } else {
        texto += `💀 La casa siempre gana, querido...`
    }

    texto += `\n\n🎙️ *RECUERDA:* ¡Nunca dejes de sonreír! 📻✨`

    return conn.reply(m.chat, texto, m, { mentions: [m.sender] })
}

handler.help = ['ruleta', 'spin']
handler.tags = ['game']
handler.command = ['ruleta', 'r', 'spin', 'suerte'] 

export default handler
