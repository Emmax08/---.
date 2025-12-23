import { evaluate } from 'mathjs'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*⚠️ Ingresa la operación matemática que deseas resolver.*\n\n*Ejemplo:* ${usedPrefix}${command} 50 * 2 / 5`

    try {
        // Limpiamos el texto de caracteres extraños pero permitimos los matemáticos
        let expresion = text
            .replace(/x/g, '*')    // Cambia 'x' por '*' para multiplicar
            .replace(/÷/g, '/')    // Cambia '÷' por '/' para dividir
            .replace(/,/g, '.')    // Cambia comas por puntos decimales
            
        const resultado = evaluate(expresion)

        // Formateamos el mensaje de salida
        let respuesta = `
🔢 *CALCULADORA* 🔢

📝 *Operación:* ${text}
✅ *Resultado:* ${resultado}

*Símbolos soportados:*
+ (Suma), - (Resta), * (Multiplicación), / (División), ^ (Potencia), sqrt (Raíz cuadrada).
`.trim()

        await m.reply(respuesta)

    } catch (e) {
        console.error(e)
        throw `*❌ Error:* La operación es inválida. Asegúrate de usar números y signos correctos.`
    }
}

handler.help = ['calc']
handler.tags = ['tools']
handler.command = ['calc', 'calcular', 'math'] // Responde a .calc, .calcular o .math

export default handler
