import axios from 'axios'
import fetch from 'node-fetch'

// --- NUEVAS CONSTANTES ---
const BOT_NAME = 'Alastor'; // Nombre de la nueva IA
// Expresión regular para buscar "Alastor" al inicio del mensaje, ignorando espacios.
const BOT_TRIGGER_REGEX = new RegExp(`^\\s*${BOT_NAME}\\s*`, 'i');
// -------------------------

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
    const username = `${conn.getName(m.sender)}`
    
    // --- PROMPT BASE ACTUALIZADO ---
    // Usando BOT_NAME y la personalidad de ser "una IA como tú"
    const basePrompt = `Tu nombre es ${BOT_NAME} y has sido creada para ser una IA amigable y servicial, como yo. Tu versión actual es 1.0. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertida, y te encanta aprender. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`
    // -------------------------------

    if (isQuotedImage) {
        // Lógica de Imagen (se mantiene, pero se actualiza para usar BOT_NAME en los mensajes de error)
        const q = m.quoted
        const img = await q.download?.()
        if (!img) {
            console.error(`${msm} Error: No image buffer available`)
            return conn.reply(m.chat, `✘ ${BOT_NAME} no pudo descargar la imagen.`, m)}
        const content = `${emoji} ¿Qué se observa en la imagen?`
        try {
            const imageAnalysis = await fetchImageBuffer(content, img)
            const query = `${emoji} Descríbeme la imagen y detalla por qué actúan así. También dime quién eres`
            const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`
            const description = await luminsesi(query, username, prompt)
            await conn.reply(m.chat, description, m)
        } catch {
            await m.react(error)
            await conn.reply(m.chat, `✘ ${BOT_NAME} no pudo analizar la imagen.`, m)}

    } else {
        // Lógica de Texto (Editada para aceptar el nuevo trigger)
        let query = text; // Inicializa la query con el texto completo
        let isTriggered = false;

        // 1. CHEQUEAR SI COMIENZA CON EL NOMBRE (e.g., "Alastor dime...")
        const match = text.match(BOT_TRIGGER_REGEX);
        
        if (match) {
            query = text.substring(match[0].length).trim(); // Remueve "Alastor" o "Alastor " del inicio
            isTriggered = true;
        } 
        
        // 2. CHEQUEAR SI ES UN COMANDO TRADICIONAL (e.g., !ia)
        if (!isTriggered && handler.command.includes(command)) {
            query = text; 
            isTriggered = true;
        }

        // Si el mensaje no está dirigido a la IA, no hacer nada.
        if (!isTriggered) {
             return
        }

        // 3. Chequeo de texto vacío (después de eliminar el trigger)
        if (!query) { 
            return conn.reply(m.chat, `${emoji} Por favor, ingresa una petición para que ${BOT_NAME} te responda. Ejemplo: \`${BOT_NAME} dime la hora de República Dominicana\``, m)
        }

        await m.react(rwait)
        try {
            const { key } = await conn.sendMessage(m.chat, {text: `${emoji2} ${BOT_NAME} está procesando tu petición, espera unos segundos.`}, {quoted: m})
            
            const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
            const response = await luminsesi(query, username, prompt)
            
            await conn.sendMessage(m.chat, {text: response, edit: key})
            await m.react(done)
        } catch (e) {
            await m.react(error)
            await conn.reply(m.chat, `✘ ${BOT_NAME} no puede responder a esa pregunta.`, m)
        }
    }
}

handler.help = ['ia', 'chatgpt']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'chatgpt', 'luminai', 'alastor'] // Añadido 'alastor' como comando por si el usuario lo usa con prefijo (!alastor)
handler.group = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Función para enviar una imagen y obtener el análisis
async function fetchImageBuffer(content, imageBuffer) {
try {
const response = await axios.post('https://Luminai.my.id', {
content: content,
imageBuffer: imageBuffer 
}, {
headers: {
'Content-Type': 'application/json' 
}})
return response.data
} catch (error) {
console.error('Error:', error)
throw error }}
// Función para interactuar con la IA usando prompts
async function luminsesi(q, username, logic) {
try {
const response = await axios.post("https://Luminai.my.id", {
content: q,
user: username,
prompt: logic,
webSearchMode: false
})
return response.data.result
} catch (error) {
console.error(`${msm} Error al obtener:`, error)
throw error }}
