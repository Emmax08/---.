import fetch from 'node-fetch' // Usamos fetch para la API de Dorratz
// Nota: axios ya no es necesario

// --- CONSTANTES DE CONFIGURACIÓN ---
const BOT_NAME = 'Alastor'; // Nombre de la IA
// Expresión regular para buscar "Alastor" al inicio del mensaje
const BOT_TRIGGER_REGEX = new RegExp(`^\\s*${BOT_NAME}\\s*`, 'i');
// Nota: Las variables 'msm', 'emoji', 'emoji2', 'rwait', 'done', 'error' deben estar definidas globalmente en tu entorno.
// ----------------------------------

// 🎯 FUNCIÓN PINS DORRATZ (API de Dorratz)
// Adaptada del segundo comando para usarse aquí
const pinsDorratz = async (query) => {
    try {
        const res = await fetch(`https://api.dorratz.com/v2/pinterest?q=${encodeURIComponent(query)}`);
        
        if (!res.ok) {
            console.error(`💥 Error en la API de Dorratz: ${res.status} ${res.statusText}`);
            return [];
        }

        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
            // Devuelve la URL de la primera imagen encontrada (la más grande)
            const firstResult = data[0];
            return firstResult.image_large_url || firstResult.image_medium_url || firstResult.image_small_url;
        }
        return null; // No se encontraron resultados
    } catch (err) {
        console.error('💥 Error al obtener resultados de Pinterest (Dorratz API):', err.message);
        return null;
    }
};

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const username = `${conn.getName(m.sender)}`

    // Si hay una imagen citada, la lógica original de análisis de Luminai fallará
    // Ya que no tenemos la función `fetchImageBuffer` de Luminai.
    // Aquí simplemente ignoraremos la imagen citada o se podría añadir lógica
    // para buscar algo relacionado al pie de foto si existiera.
    const isQuotedImage = m.quoted?.mimetype?.startsWith('image/') || m.quoted?.msg?.mimetype?.startsWith('image/')
    if (isQuotedImage) {
        return conn.reply(m.chat, `¡Hola, ${username}! ${BOT_NAME} ya no puede analizar imágenes, solo puede buscar imágenes de Pinterest basadas en texto.`, m)
    }

    // --- LÓGICA DE ACTIVACIÓN Y PROCESAMIENTO DE TEXTO ---
    let query = text ? text.trim() : ''; 
    let isTriggered = false;

    // 1. Verificar si el mensaje es una MENCION DIRECTA (Ej: "Alastor dime...")
    const match = query.match(BOT_TRIGGER_REGEX);
    if (match) {
        query = query.substring(match[0].length).trim(); 
        isTriggered = true;
    }

    // 2. Verificar si el mensaje es un COMANDO TRADICIONAL (Ej: !ia, !alastor)
    if (!isTriggered && handler.command.includes(command)) {
        isTriggered = true; 
    }

    // Si no fue activado, termina.
    if (!isTriggered) {
         return
    }

    // 3. Chequeo de texto vacío (después de eliminar el trigger)
    if (!query) { 
        return conn.reply(m.chat, `${emoji} Por favor, ingresa una petición para que ${BOT_NAME} te busque una imagen. Ejemplo: \`${BOT_NAME} anime girl\``, m)
    }

    await m.react(rwait)
    
    // --- LÓGICA DE BÚSQUEDA DE IMAGEN CON DORRATZ API ---
    try {
        // En lugar de una respuesta de texto de IA, buscamos una imagen.
        const imageUrl = await pinsDorratz(query);
        
        if (imageUrl) {
            // Si encuentra una URL, envía la imagen
            await conn.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: `Aquí tienes el resultado de la búsqueda de ${BOT_NAME} para: *${query}*.\n\n¡Espero que te guste, ${username}! (Vía Dorratz API)`
            }, { quoted: m });
            await m.react(done);
        } else {
            // Si no encuentra resultados
            await m.react(error);
            await conn.reply(m.chat, `❌ Lo siento, ${username}. No se encontró ninguna imagen en Pinterest para: *${query}*. Intenta ser más específico.`, m);
        }
    } catch (e) {
        console.error(`Error en la búsqueda con Dorratz API: ${e}`); 
        await m.react(error)
        await conn.reply(m.chat, `✘ ${BOT_NAME} no pudo completar la búsqueda. Ocurrió un error.`, m)
    }
}

handler.help = ['ia', 'chatgpt']
handler.tags = ['ai'] // Mantendremos el tag aunque la función cambió
handler.register = true
handler.command = ['ia', 'chatgpt', 'luminai', 'alastor']
handler.group = true

export default handler
