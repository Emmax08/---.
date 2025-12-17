// Este código maneja los eventos de Bienvenida y Despedida en grupos de WhatsApp.

import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch' 

// --- CONFIGURACIÓN DE LA NUEVA API NEVI ---
const API_URL = 'http://neviapi.ddns.net:5000/welcome'; // Endpoint de la API NEVI
const API_KEY = 'maria'; // Clave de la API solicitada
// URLs de fallback y fondo, usando las del código original
const DEFAULT_AVATAR_URL = 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/b75b29441bbd967deda4365441497221.jpg';
const BACKGROUND_IMAGE_URL_WELCOME = 'https://files.catbox.moe/rip3mf.jpg'; // Fondo original de Bienvenida
const BACKGROUND_IMAGE_URL_BYE = 'https://files.catbox.moe/rip3mf.jpg'; // Fondo original de Despedida
// ------------------------------------------

// --- FUNCIONES DE UTILIDAD ---

/**
 * Calcula los días que un participante ha estado en el grupo.
 */
function calcularDiasEnGrupo(participant) {
    if (!participant || typeof participant.date !== 'number') return 1
    const fechaIngreso = new Date(participant.date * 1000)
    const fechaActual = new Date()
    const diferencia = fechaActual.getTime() - fechaIngreso.getTime()
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    return Math.max(1, dias)
}

/**
 * Obtiene la fecha de creación del grupo en formato legible (CDMX).
 */
function obtenerFechaCreacion(groupMetadata) {
    if (!groupMetadata.creation) return 'Fecha desconocida'
    const fechaCreacion = new Date(groupMetadata.creation * 1000)
    return fechaCreacion.toLocaleDateString("es-ES", {
        timeZone: "America/Mexico_City",
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

/**
 * Genera la imagen de bienvenida/despedida haciendo una petición POST a la API de Nevi.
 * Devuelve el Buffer de la imagen (Reemplaza a fetchImageBuffer y apiUrl).
 */
async function generateImageFromAPI(type, userName, groupName, memberCount, avatarUrl, backgroundUrl) {
    const action = type === 'welcome' ? 'welcome' : 'bye';

    const payload = {
        username: userName.replace('@', ''), 
        action: action,
        group_name: groupName,
        member_count: memberCount,
        background_url: backgroundUrl, 
        profile_url: avatarUrl
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`ERROR en la respuesta de la API Nevi (Status: ${response.status}). Body: ${await response.text()}`);
            return null;
        }

        return await response.buffer(); 

    } catch (e) {
        console.error('Error al llamar a la API de Nevi:', e);
        return null;
    }
}


// --- GENERACIÓN DE DATOS ---

/**
 * Genera la estructura de datos para el mensaje de Bienvenida.
 */
async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
    const username = `@${userId.split('@')[0]}`

    // --- ESPACIOS PARA CONFIGURACIÓN DE MEDIOS ---
    const avatar = await conn.profilePictureUrl(userId, 'image').catch(() => DEFAULT_AVATAR_URL)
    const background = BACKGROUND_IMAGE_URL_WELCOME // Usamos la URL para la API de Nevi
    const audioBienvenida = 'https://files.catbox.moe/t2e1zx.mp3'
    // ---------------------------------------------

    // ⬅️ Ya no se necesita apiUrl, se pasa la data a la función POST
    // const descripcion = `${username}`
    // const apiUrl = `...` 

    const groupSize = groupMetadata.participants.length
    const fechaCreacion = obtenerFechaCreacion(groupMetadata)
    const desc = groupMetadata.desc?.toString() || 'Sin descripción'

    const infoGrupo = `
📋 INFORMACIÓN DEL GRUPO:
├─ 🗓️ Creado: ${fechaCreacion}
├─ 👥 Miembros: *${groupSize} participantes*
├─ 📝 Descripción:
${desc}`

    // Se usa el mensaje personalizado o el predefinido con la info del grupo
    const mensaje = (chat.sWelcome || infoGrupo)
        .replace(/{usuario}/g, `${username}`)
        .replace(/{grupo}/g, `*${groupMetadata.subject}*`)
        .replace(/{desc}/g, `${desc}`)
        .replace(/{fechaCreacion}/g, `${fechaCreacion}`)
        .replace(/{miembros}/g, `${groupSize}`)

    const caption = `
╭───·˚ 👿 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 😈 ·˚───╮

  𐔌՞. .՞𐦯 ¡Hola, ${username}  
  Te damos la bienvenida a: *${groupMetadata.subject}*

${mensaje}

╰──·˚ ✡️ ¡Disfruta tu estadía! ˚·──╯`

    // ⬅️ Obtener Buffer mediante llamada POST a la API de Nevi
    const imageBuffer = await generateImageFromAPI(
        'welcome', 
        username, 
        groupMetadata.subject, 
        groupSize, 
        avatar, 
        background
    )

    return {
        imageBuffer, 
        caption,
        mentions: [userId],
        audioUrl: audioBienvenida
    }
}

/**
 * Genera la estructura de datos para el mensaje de Despedida.
 */
async function generarDespedida({ conn, userId, groupMetadata, chat }) {
    const username = `@${userId.split('@')[0]}`

    const participantInfo = groupMetadata.participants.find(p => p.id === userId)
    const diasEnGrupo = calcularDiasEnGrupo(participantInfo)

    // --- ESPACIOS PARA CONFIGURACIÓN DE MEDIOS ---
    const avatar = await conn.profilePictureUrl(userId, 'image').catch(() => DEFAULT_AVATAR_URL)
    const background = BACKGROUND_IMAGE_URL_BYE // Usamos la URL para la API de Nevi
    const audioDespedida = 'https://files.catbox.moe/62lqs8.mp3' // ⬅️ NUEVO AUDIO DE DESPEDIDA
    // ---------------------------------------------

    // ⬅️ Ya no se necesita apiUrl, se pasa la data a la función POST
    // const descripcion = `${username}`
    // const apiUrl = `...`

    const fecha = new Date().toLocaleDateString("es-ES", {
        timeZone: "America/Mexico_City",
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    const groupSize = groupMetadata.participants.length - 1 // Miembros restantes
    const desc = groupMetadata.desc?.toString() || 'Sin descripción'

    const infoDespedida = `
📊 ESTADÍSTICAS:
├─ 👥 Miembros restantes: *${groupSize}*
├─ 📅 Tiempo en el grupo: *${diasEnGrupo} día${diasEnGrupo !== 1 ? 's' : ''}*
├─ 🗓️ Fecha de salida: ${fecha}`

    // Se usa el mensaje personalizado o el predefinido con la info de la salida
    const mensaje = (chat.sBye || infoDespedida)
        .replace(/{usuario}/g, `${username}`)
        .replace(/{grupo}/g, `${groupMetadata.subject}`)
        .replace(/{desc}/g, `*${desc}*`)
        .replace(/{dias}/g, `${diasEnGrupo}`)
        .replace(/{miembros}/g, `${groupSize}`)
        .replace(/{fechaSalida}/g, `${fecha}`)

    const caption = `
╭───·˚ 😈 𝐆𝐎𝐎𝐃 𝐁𝐘𝐄 👿 ·˚───╮

  𐔌՞. .՞𐦯 – ${username}  
  Se fue de: *${groupMetadata.subject}*

${mensaje}

╰───·˚  ☠️ ¡Hasta pronto!  ˚·───╯`

    // ⬅️ Obtener Buffer mediante llamada POST a la API de Nevi
    const imageBuffer = await generateImageFromAPI(
        'goodbye', 
        username, 
        groupMetadata.subject, 
        groupSize, 
        avatar, 
        background
    )

    return {
        imageBuffer,
        caption,
        mentions: [userId],
        audioUrl: audioDespedida // ⬅️ SE DEVUELVE LA URL DEL AUDIO
    }
}

// *** LÓGICA DE BIENVENIDA Y DESPEDIDA (EVENTOS STUB) ***

export async function before(m, { conn, groupMetadata }) {
    // 1. Verificar si es un evento Stub y de Grupo
    if (!m.messageStubType || !m.isGroup) return !0

    console.log('--- EVENTO DE GRUPO STUB DETECTADO ---')
    console.log(`Tipo: ${WAMessageStubType[m.messageStubType]}`)
    const userId = m.messageStubParameters?.[0]
    if (!userId) return !0 

    // Inicializar global.db.data.chats si es necesario para evitar errores
    global.db = global.db || {}
    global.db.data = global.db.data || {}
    global.db.data.chats = global.db.data.chats || {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    // 2. Comprobación de Bot Primario (Opcional)
    const primaryBot = global.db.data.chats[m.chat]?.primaryBot
    if (primaryBot && conn.user.jid !== primaryBot) return !1

    const chat = global.db.data.chats[m.chat]

    // 3. Lógica de Bienvenida (ADD)
    if (chat?.welcome && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        const { imageBuffer, caption, mentions, audioUrl } = await generarBienvenida({
            conn,
            userId,
            groupMetadata,
            chat
        })

        // --- ENVÍO DE IMAGEN/TEXTO (PASO 1) CON FALLBACK ---
        if (imageBuffer) {
            try {
                await conn.sendMessage(m.chat, {
                    image: imageBuffer, 
                    caption: caption,
                    mentions: mentions
                }, { quoted: null })

            } catch (error) {
                console.error('ERROR enviando bienvenida (Imagen/Texto). Falló sendMessage con Buffer:', error)
                // Fallback a texto si el envío con Buffer falla
                await conn.sendMessage(m.chat, { text: caption, mentions: mentions }, { quoted: null })
            }
        } else {
            // FALLBACK a mensaje de texto si la generación/descarga de la imagen falla
            console.warn('[WARNING] Fallo la generación/descarga de la imagen de bienvenida (API Nevi). Enviando solo texto.')
            await conn.sendMessage(m.chat, { text: caption, mentions: mentions }, { quoted: null })
        }

        // --- ENVÍO DE AUDIO (PASO 2) ---
        if (audioUrl) {
            try {
                await conn.sendMessage(m.chat, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg'
                }, { quoted: null })
            } catch (audioError) {
                console.error('ERROR enviando audio de bienvenida. Revisar URL del MP3:', audioError)
            }
        }
    }

    // 4. Lógica de Despedida (REMOVE/LEAVE)
    // ⬅️ ESTA CONDICIÓN YA CUBRE CUANDO ALGUIEN ES REMOVIDO (GROUP_PARTICIPANT_REMOVE)
    if (chat?.welcome && (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {
        const { imageBuffer, caption, mentions, audioUrl } = await generarDespedida({ // ⬅️ MODIFICADO: Se añade audioUrl
            conn,
            userId,
            groupMetadata,
            chat
        })

        // --- ENVÍO DE IMAGEN/TEXTO (PASO 1) CON FALLBACK ---
        if (imageBuffer) {
            try {
                await conn.sendMessage(m.chat, {
                    image: imageBuffer, 
                    caption: caption,
                    mentions: mentions
                }, { quoted: null })
            } catch (error) {
                console.error('ERROR enviando despedida (Imagen/Texto). Falló sendMessage con Buffer:', error)
                // Fallback a texto si el envío con Buffer falla
                await conn.sendMessage(m.chat, { text: caption, mentions: mentions }, { quoted: null })
            }
        } else {
            // FALLBACK a mensaje de texto si la generación/descarga de la imagen falla
            console.warn('[WARNING] Fallo la generación/descarga de la imagen de despedida (API Nevi). Enviando solo texto.')
            await conn.sendMessage(m.chat, { text: caption, mentions: mentions }, { quoted: null })
        }

        // --- ENVÍO DE AUDIO (PASO 2) --- ⬅️ NUEVA LÓGICA PARA EL AUDIO DE DESPEDIDA
        if (audioUrl) {
            try {
                await conn.sendMessage(m.chat, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg'
                }, { quoted: null })
            } catch (audioError) {
                console.error('ERROR enviando audio de despedida. Revisar URL del MP3:', audioError)
            }
        }
    }
}