
let handler = async (m, { conn, usedPrefix, command }) => {
    // Imagen proporcionada (Asegúrate de que la URL sea válida)
    const rulesImage = 'https://files.catbox.moe/khczrx.jpg' 

    const rulesText = `
🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *REGLAS DEL PROGRAMA* ✨
━━━━━━━━━━━━━━━━━━━━

*¡Escuchen bien, pecadores!* Para mantener la sintonía en esta estación, deben seguir estas pequeñas pautas de cortesía:

1️⃣ 🎭 **CORTESÍA ANTE TODO:** No satures el chat con spam. A nadie le gusta la estática molesta en su radio.
2️⃣ 🍎 **CONTRATOS SAGRADOS:** Prohibido el contenido explícito (Gore/CP/NSFW) o enlaces maliciosos. ¡No queremos que los exterminadores bajen antes de tiempo!
3️⃣ 💰 **EL VALOR DEL RESPETO:** El acoso a otros locutores o miembros del staff resultará en un viaje sin retorno al vacío.
4️⃣ 📂 **SIN INTERFERENCIAS:** No promociones otros grupos o servicios sin permiso del Director de la Estación.
5️⃣ 🔖 **SONRÍE:** Nunca olvides que el bot es para divertirse. ¡Si no tienes una sonrisa, te pondremos una!

━━━━━━━━━━━━━━━━━━━━
⚠️ *EL INCUMPLIMIENTO DE ESTAS NORMAS RESULTARÁ EN UN BANEO DE MIS SERVICIOS.* 🎙️ *¿Entendido? ¡Excelente! Continuemos con la música...* 📻✨`.trim()

    try {
        // Usamos sendMessage con 'image' que es más estable en bots MD
        await conn.sendMessage(m.chat, { 
            image: { url: rulesImage }, 
            caption: rulesText,
            mentions: [m.sender]
        }, { quoted: m })
        
    } catch (e) {
        console.error(e)
        // Si la imagen falla, enviamos el texto solo con el estilo de Alastor
        await conn.reply(m.chat, `📻 *¡ESTÁTICA EN LA SEÑAL!* No pude mostrarte el póster, pero aquí tienes las leyes del hotel:\n\n${rulesText}`, m)
    }
}

handler.help = ['reglas', 'rules']
handler.tags = ['main']
// Añadimos más alias para asegurar que responda
handler.command = ['reglas', 'rules', 'normas'] 

export default handler
