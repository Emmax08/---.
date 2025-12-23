let handler = async (m, { conn, usedPrefix }) => {
    // Texto de las reglas personalizado con temática de radio/demonios
    const rulesText = `
🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *REGLAS DEL PROGRAMA* ✨
━━━━━━━━━━━━━━━━━━━━

*¡Escuchen bien, pecadores!* Para mantener la sintonía en esta estación, deben seguir estas pequeñas pautas de cortesía:

1️⃣ 🎭 **CORTESÍA ANTE TODO:** No satures el chat con spam. A nadie le gusta la estática molesta en su radio.
2️⃣ 🍎 **CONTRATOS SAGRADOS:** Prohibido el contenido explícito (Gore/CP) o enlaces maliciosos. ¡No queremos que los exterminadores bajen antes de tiempo!
3️⃣ 💰 **EL VALOR DEL RESPETO:** El acoso a otros locutores o miembros del staff resultará en un viaje sin retorno al vacío.
4️⃣ 📂 **SIN INTERFERENCIAS:** No promociones otros grupos o servicios sin permiso del Director de la Estación.
5️⃣ 🔖 **SONRÍE:** Nunca olvides que el bot es para divertirse. ¡Si no tienes una sonrisa, te pondremos una!

━━━━━━━━━━━━━━━━━━━━
⚠️ *EL INCUMPLIMIENTO DE ESTAS NORMAS RESULTARÁ EN UN BANEO DE MIS SERVICIOS.* 🎙️ *¿Entendido? ¡Excelente! Continuemos con la música...* 📻✨`.trim()

    // Imagen de referencia (puedes cambiar la URL por una de Alastor o tu logo)
    const rulesImage = 'https://tinyurl.com/alastor-rules-img' 

    try {
        await conn.sendFile(m.chat, rulesImage, 'rules.jpg', rulesText, m)
    } catch (e) {
        // Si falla la imagen, envía solo el texto
        await conn.reply(m.chat, rulesText, m)
    }
}

// Configuración de activación
handler.help = ['rules', 'reglas']
handler.tags = ['main']

// Se activa con .rules, .reglas, #rules o #reglas según tus prefijos guardados
handler.command = /^(rules|reglas)$/i

export default handler
