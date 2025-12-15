import axios from 'axios'
import fetch from 'node-fetch'

// --- CONSTANTES DE CONFIGURACIÓN ---
const BOT_NAME = 'Alastor'; // Nombre de la IA
// Expresión regular para buscar "Alastor" al inicio del mensaje, ignorando mayúsculas y espacios.
const BOT_TRIGGER_REGEX = new RegExp(`^\\s*${BOT_NAME}\\s*`, 'i');
// Nota: Las variables 'msm', 'emoji', 'emoji2', 'rwait', 'done', 'error' deben estar definidas globalmente en tu entorno.
// ----------------------------------

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
    const username = `${conn.getName(m.sender)}`
    
    // --- PROMPT BASE ---
    const basePrompt = `Tu nombre es ${BOT_NAME} y has sido creada para ser una IA amigable y servicial, como yo. Tu versión actual es 1.0. Tú usas el idioma Español. Llamarás a las personas por su nombre ${username}, te gusta ser divertida, y te encanta aprender. Lo más importante es que debes ser amigable con la persona con la que estás hablando. ${username}`
    // -------------------

    if (isQuotedImage) {
        // Lógica de Imagen (Se mantiene igual, solo usa BOT_NAME para los mensajes)
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
        // --- LÓGICA DE ACTIVACIÓN Y PROCESAMIENTO DE TEXTO (CORREGIDA) ---
        let query = text ? text.trim() : ''; // Aseguramos que query sea el texto sin espacios iniciales/finales
        let isTriggered = false;

        // 1. Verificar si el mensaje es una MENCION DIRECTA (Ej: "Alastor dime...")
        const match = query.match(BOT_TRIGGER_REGEX);
        if (match) {
            query = query.substring(match[0].length).trim(); // Remueve "Alastor" y guarda solo la pregunta
            isTriggered = true;
        }

        // 2. Verificar si el mensaje es un COMANDO TRADICIONAL (Ej: !ia, !chatgpt)
        // Se chequea si el comando usado está en la lista de comandos del handler
        if (!isTriggered && handler.command.includes(command)) {
            // En este caso, 'query' es el texto que viene después del comando
            isTriggered = true; 
        }

        // Si el mensaje no fue un comando y tampoco comenzó con "Alastor", la función termina.
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
            
            // Llama a la API con el prompt y la query
            const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
            const response = await luminsesi(query, username, prompt)
            
            // Edita el mensaje de espera con la respuesta final
            await conn.sendMessage(m.chat, {text: response, edit: key})
            await m.react(done)
        } catch (e) {
            console.error(`Error en Luminai/ChatGPT: ${e}`); 
            await m.react(error)
            await conn.reply(m.chat, `✘ ${BOT_NAME} no puede responder a esa pregunta.`, m)
        }
    }
}

handler.help = ['ia', 'chatgpt']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'chatgpt', 'luminai', 'alastor'] // 'alastor' se añade para usarlo como !alastor
handler.group = true

export default handler

// --- FUNCIONES AUXILIARES ---

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
throw error }}
