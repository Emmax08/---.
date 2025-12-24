let handler = async (m, { conn, usedPrefix }) => {
    // URL proporcionada
    const rulesImage = 'https://files.catbox.moe/khczrx.jpg' 

    const rulesText = `
🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *REGLAS DEL PROGRAMA* ✨
━━━━━━━━━━━━━━━━━━━━

*¡Escuchen bien, pecadores!* Para mantener la sintonía en esta estación, deben seguir estas pequeñas pautas de cortesía:

1️⃣ 🎭 **CORTESÍA ANTE TODO:** No satures el chat con spam. A nadie le gusta la estática molesta en su radio.
2️⃣ 🍎 **CONTRATOS SAGRADOS:** Prohibido el contenido explícito (Gore/CP/NFST) o enlaces maliciosos. ¡No queremos que los exterminadores bajen antes de tiempo!
3️⃣ 💰 **EL VALOR DEL RESPETO:** El acoso a otros locutores o miembros del staff resultará en un viaje sin retorno al vacío.
4️⃣ 📂 **SIN INTERFERENCIAS:** No promociones otros grupos o servicios sin permiso del Director de la Estación.
5️⃣ 🔖 **SONRÍE:** Nunca olvides que el bot es para divertirse. ¡Si no tienes una sonrisa, te pondremos una!

━━━━━━━━━━━━━━━━━━━━
⚠️ *EL INCUMPLIMIENTO DE ESTAS NORMAS RESULTARÁ EN UN BANEO DE MIS SERVICIOS.* 🎙️ *¿Entendido? ¡Excelente! Continuemos con la música...* 📻✨`.trim()

    try {
        // Enviamos la imagen con el texto como "caption" (leyenda)
        await conn.sendFile(m.chat, rulesImage, 'rules.jpg', rulesText, m)
    } catch (e) {
        // En caso de que falle la carga de la imagen, enviamos el texto solo para no dejar al usuario esperando
        await conn.reply(m.chat, `📻 *Interferencia en la señal:* No pude cargar la imagen, pero aquí están las reglas:\n\n${rulesText}`, m)
    }
}

handler.help = ['rules', 'reglas']
handler.tags = ['main']
// El comando responde a .reglas, .rules, #reglas o #rules
handler.command = /^(rules|reglas)$/i

export default handler