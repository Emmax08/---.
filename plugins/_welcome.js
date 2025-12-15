// Este código maneja los eventos de Bienvenida y Despedida en grupos de WhatsApp.

import { WAMessageStubType } from '@whiskeysockets/baileys'

/**
 * Calcula los días que un participante ha estado en el grupo.
 * @param {object} participant - Objeto de participante con propiedad 'date' (timestamp en segundos).
 * @returns {number} Número de días en el grupo (mínimo 1).
 */
function calcularDiasEnGrupo(participant) {
    // La propiedad 'date' debe ser un número (timestamp en segundos)
    if (!participant || typeof participant.date !== 'number') return 1
    
    // El timestamp de Baileys suele ser en segundos, se convierte a milisegundos.
    const fechaIngreso = new Date(participant.date * 1000)
    const fechaActual = new Date()
    const diferencia = fechaActual.getTime() - fechaIngreso.getTime()
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    
    return Math.max(1, dias)
}

/**
 * Obtiene la fecha de creación del grupo en formato legible (CDMX).
 * @param {object} groupMetadata - Metadatos del grupo.
 * @returns {string} Fecha de creación formateada.
 */
function obtenerFechaCreacion(groupMetadata) {
    if (!groupMetadata.creation) return 'Fecha desconocida'
    
    const fechaCreacion = new Date(groupMetadata.creation * 1000)
    return fechaCreacion.toLocaleDateString("es-ES", {
        // ZONA HORARIA CDMX APLICADA
        timeZone: "America/Mexico_City", 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

/**
 * Genera la estructura de datos para el mensaje de Bienvenida.
 */
async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
    const username = `@${userId.split('@')[0]}`
    
    // --- ESPACIOS PARA CONFIGURACIÓN DE MEDIOS ---
    const avatar = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/b75b29441bbd967deda4365441497221.jpg')
    const background = 'https://files.catbox.moe/rip3mf.jpg' // URL de imagen de fondo para el canvas/card
    const audioBienvenida = 'https://files.catbox.moe/t2e1zx.mp3' // https://youtu.be/sdnZrk3i3ak?si=6mMb7mgqu_2S5hW8
    // ---------------------------------------------
    
    const descripcion = `${username}`
    const apiUrl = `https://api.siputzx.my.id/api/canvas/welcomev4?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(descripcion)}`
    
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

    return { 
        imageUrl: apiUrl, 
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
    const avatar = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/b75b29441bbd967deda4365441497221.jpg')
    const background = 'https://qu.ax/YrVNX.jpg' // URL de imagen de fondo para el canvas/card
    // ---------------------------------------------
    
    const descripcion = `${username}`
    const apiUrl = `https://api.siputzx.my.id/api/canvas/goodbyev4?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(descripcion)}`
    
    const fecha = new Date().toLocaleDateString("es-ES", { 
        // ZONA HORARIA CDMX APLICADA
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

    return { 
        imageUrl: apiUrl, 
        caption, 
        mentions: [userId] 
    }
}

// *** LÓGICA DE BIENVENIDA Y DESPEDIDA (EVENTOS STUB) ***
let handler = {} 

handler.before = async function (m, { conn, groupMetadata }) {
    // 1. Verificar si es un evento Stub y de Grupo
    if (!m.messageStubType || !m.isGroup) return !0
    
    // --- DIAGNÓSTICO: CONFIRMAR RECEPCIÓN DEL EVENTO ---
    console.log('--- EVENTO DE GRUPO STUB DETECTADO ---')
    console.log(`Tipo: ${WAMessageStubType[m.messageStubType]}`)
    console.log(`ID de usuario involucrado: ${m.messageStubParameters[0]}`)
    // ----------------------------------------------------

    // Inicializar global.db.data.chats si es necesario para evitar errores
    global.db = global.db || {}
    global.db.data = global.db.data || {}
    global.db.data.chats = global.db.data.chats || {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    
    // 2. Comprobación de Bot Primario (Opcional)
    const primaryBot = global.db.data.chats[m.chat]?.primaryBot
    if (primaryBot && conn.user.jid !== primaryBot) return !1
    
    const chat = global.db.data.chats[m.chat]
    const userId = m.messageStubParameters[0]

    // 3. Lógica de Bienvenida (ADD)
    // Orden: 1. Imagen/Texto (juntos), 2. Audio
    if (chat?.welcome && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        const { imageUrl, caption, mentions, audioUrl } = await generarBienvenida({ 
            conn, 
            userId, 
            groupMetadata, 
            chat 
        })
        
        // --- ENVÍO DE IMAGEN/TEXTO (PASO 1) ---
        try {
            await conn.sendMessage(m.chat, {
                image: { url: imageUrl },
                caption: caption,
                mentions: mentions
            }, { quoted: null })
            
        } catch (error) {
            // Se registra el error sin enviar un mensaje de fallback
            console.error('ERROR enviando bienvenida (Imagen/Texto). Revisar URL de Canvas/Avatar/Fondo:', error)
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
    // Orden: 1. Imagen/Texto (juntos)
    if (chat?.welcome && (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {
        const { imageUrl, caption, mentions } = await generarDespedida({ 
            conn, 
            userId, 
            groupMetadata, 
            chat 
        })
        
        const messageOptions = {
            image: { url: imageUrl },
            caption: caption,
            mentions: mentions
        }
        
        // --- ENVÍO DE IMAGEN/TEXTO (CON TRY/CATCH) ---
        try {
            await conn.sendMessage(m.chat, messageOptions, { quoted: null })
        } catch (error) {
             console.error('ERROR enviando despedida (Imagen/Texto). Revisar URL de Canvas/Avatar/Fondo:', error)
        }
    }
}


export { generarBienvenida, generarDespedida, calcularDiasEnGrupo, obtenerFechaCreacion }
export default handler
