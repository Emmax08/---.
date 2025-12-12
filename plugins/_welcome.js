// Credits: ঔৣ⃟▒𝐄𝐌𝐌𝐀𝐗ღೋ

import fs from 'fs'
import { WAMessageStubType } from '@whiskeysockets/baileys'

function calcularDiasEnGrupo(participant, groupMetadata) {
    // La propiedad 'date' debe ser un número (timestamp)
    if (!participant || typeof participant.date !== 'number') return 0
    
    const fechaIngreso = new Date(participant.date * 1000)
    const fechaActual = new Date()
    const diferencia = fechaActual.getTime() - fechaIngreso.getTime()
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
    
    return Math.max(1, dias)
}

function obtenerFechaCreacion(groupMetadata) {
    if (!groupMetadata.creation) return 'Fecha desconocida'
    
    const fechaCreacion = new Date(groupMetadata.creation * 1000)
    return fechaCreacion.toLocaleDateString("es-ES", {
        // ZONA HORARIA CDMX APLICADA (Mantenida por ser un dato histórico)
        timeZone: "America/Mexico_City", 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
    const username = `@${userId.split('@')[0]}`
    const nombreUsuario = userId.split('@')[0] 
    
    const avatar = await conn.profilePictureUrl(userId, 'image').catch(() => 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/b75b29441bbd967deda4365441497221.jpg')
    
    const background = 'https://qu.ax/YrVNX.jpg'
    const descripcion = `${username}`
    
    const apiUrl = `https://api.siputzx.my.id/api/canvas/welcomev4?avatar=${encodeURIComponent(avatar)}&background=${encodeURIComponent(background)}&description=${encodeURIComponent(descripcion)}`
    
    // NOTA: ZONA HORARIA AJUSTADA (Usará la del servidor si no se especifica)
    const fecha = new Date().toLocaleDateString("es-ES", { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    })
    
    const groupSize = groupMetadata.participants.length
    const fechaCreacion = obtenerFechaCreacion(groupMetadata)
    const desc = groupMetadata.desc?.toString() || 'Sin descripción'
    
    const audioBienvenida = 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/welcome-audio.mp3'
    const newImage = 'https://files.catbox.moe/qc75v7.jpg' // Nueva imagen añadida
    
    // Se elimina la sección de reglas
    const infoGrupo = `
📋 INFORMACIÓN DEL GRUPO:
├─ 🗓️ Creado: ${fechaCreacion}
├─ 👥 Miembros: ${groupSize
