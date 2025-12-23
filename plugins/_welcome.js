/* 🎙️ BIENVENIDA Y DESPEDIDA - ALASTOR RADIO SHOW 🎙️
 * "El mundo es un escenario, y el escenario es un patio de recreos".
 */

import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch' 

const API_URL = 'http://neviapi.ddns.net:5000/welcome'; 
const API_KEY = 'maria'; 
const DEFAULT_AVATAR_URL = 'https://raw.githubusercontent.com/speed3xz/Storage/refs/heads/main/Arlette-Bot/b75b29441bbd967deda4365441497221.jpg';
const BACKGROUND_WELCOME = 'https://files.catbox.moe/rip3mf.jpg'; 
const BACKGROUND_BYE = 'https://files.catbox.moe/rip3mf.jpg'; 

// --- FUNCIONES DE UTILIDAD ---

function calcularDiasEnGrupo(participant) {
    if (!participant || typeof participant.date !== 'number') return 1
    const dias = Math.floor((new Date().getTime() - new Date(participant.date * 1000).getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(1, dias)
}

function obtenerFechaCreacion(groupMetadata) {
    if (!groupMetadata.creation) return 'Fecha desconocida'
    return new Date(groupMetadata.creation * 1000).toLocaleDateString("es-ES", {
        timeZone: "America/Mexico_City", day: 'numeric', month: 'long', year: 'numeric'
    })
}

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
            headers: { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY },
            body: JSON.stringify(payload)
        });
        return response.ok ? await response.buffer() : null;
    } catch (e) {
        console.error('🎙️ Error en la antena de Nevi:', e);
        return null;
    }
}

// --- GENERACIÓN DE TRANSMISIÓN ---

async function generarBienvenida({ conn, userId, groupMetadata, chat }) {
    const username = `@${userId.split('@')[0]}`
    const avatar = await conn.profilePictureUrl(userId, 'image').catch(() => DEFAULT_AVATAR_URL)
    const audioBienvenida = 'https://files.catbox.moe/t2e1zx.mp3'
    const groupSize = groupMetadata.participants.length
    const fechaCreacion = obtenerFechaCreacion(groupMetadata)
    const desc = groupMetadata.desc?.toString() || 'Sin reglas... aún.'

    const infoGrupo = `
📻 *DETALLES DE LA EMISORA:*
├─ 🗓️ *Sintonizada desde:* ${fechaCreacion}
├─ 👥 *Audiencia actual:* ${groupSize} almas bajo contrato.
├─ 📜 *Guión del show:* ${desc}`

    const mensaje = (chat.sWelcome || infoGrupo)
        .replace(/{usuario}/g, username).replace(/{grupo}/g, `*${groupMetadata.subject}*`)
        .replace(/{desc}/g, desc).replace(/{fechaCreacion}/g, fechaCreacion).replace(/{miembros}/g, groupSize)

    const caption = `
🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *¡UN NUEVO INVITADO AL SHOW!* ✨
━━━━━━━━━━━━━━━━━━━━━

¡Saludos, ${username}! 🍎
Te damos la bienvenida a nuestra señal:
*${groupMetadata.subject}*

${mensaje}

━━━━━━━━━━━━━━━━━━━━━
🎙️ *¡Disfruta del espectáculo y no pierdas la sonrisa!* ¡JAJAJA! 📻✨`.trim()

    const imageBuffer = await generateImageFromAPI('welcome', username, groupMetadata.subject, groupSize, avatar, BACKGROUND_WELCOME)

    return { imageBuffer, caption, mentions: [userId], audioUrl: audioBienvenida }
}

async function generarDespedida({ conn, userId, groupMetadata, chat }) {
    const username = `@${userId.split('@')[0]}`
    const participantInfo = groupMetadata.participants.find(p => p.id === userId)
    const diasEnGrupo = calcularDiasEnGrupo(participantInfo)
    const avatar = await conn.profilePictureUrl(userId, 'image').catch(() => DEFAULT_AVATAR_URL)
    const audioDespedida = 'https://files.catbox.moe/62lqs8.mp3'
    const groupSize = groupMetadata.participants.length - 1
    const fecha = new Date().toLocaleDateString("es-ES", { timeZone: "America/Mexico_City", day: 'numeric', month: 'long', year: 'numeric' })

    const infoDespedida = `
📊 *REPORTE DE AUDIENCIA:*
├─ 👥 *Quedan:* ${groupSize} almas.
├─ 📅 *Tiempo de contrato:* ${diasEnGrupo} día${diasEnGrupo !== 1 ? 's' : ''}.
├─ 🗓️ *Fin de transmisión:* ${fecha}`

    const mensaje = (chat.sBye || infoDespedida)
        .replace(/{usuario}/g, username).replace(/{grupo}/g, groupMetadata.subject)
        .replace(/{dias}/g, diasEnGrupo).replace(/{miembros}/g, groupSize).replace(/{fechaSalida}/g, fecha)

    const caption = `
🎙️ 📻 ━━━━━━━ • 🦌 • ━━━━━━━ 📻 🎙️
   ✨ *¡ALGUIEN DEJÓ EL ESCENARIO!* ✨
━━━━━━━━━━━━━━━━━━━━━

– ${username} 🥀
Ha cancelado su suscripción en: 
*${groupMetadata.subject}*

${mensaje}

━━━━━━━━━━━━━━━━━━━━━
🎙️ *¡Qué decepción! Pero el show debe continuar...* ☠️📻`.trim()

    const imageBuffer = await generateImageFromAPI('bye', username, groupMetadata.subject, groupSize, avatar, BACKGROUND_BYE)

    return { imageBuffer, caption, mentions: [userId], audioUrl: audioDespedida }
}

// *** LÓGICA DE EVENTOS ***

export async function before(m, { conn, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return !0

    const userId = m.messageStubParameters?.[0]
    if (!userId) return !0 

    global.db = global.db || { data: { chats: {} } }
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]

    // 1. Bienvenida
    if (chat?.welcome && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        const data = await generarBienvenida({ conn, userId, groupMetadata, chat })
        await sendAlastorMessage(conn, m.chat, data)
    }

    // 2. Despedida
    if (chat?.welcome && (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {
        const data = await generarDespedida({ conn, userId, groupMetadata, chat })
        await sendAlastorMessage(conn, m.chat, data)
    }
}

async function sendAlastorMessage(conn, chatJid, { imageBuffer, caption, mentions, audioUrl }) {
    try {
        if (imageBuffer) {
            await conn.sendMessage(chatJid, { image: imageBuffer, caption, mentions }, { quoted: null })
        } else {
            await conn.sendMessage(chatJid, { text: caption, mentions }, { quoted: null })
        }
        if (audioUrl) {
            await conn.sendMessage(chatJid, { audio: { url: audioUrl }, mimetype: 'audio/mpeg' }, { quoted: null })
        }
    } catch (e) {
        console.error('🎙️ Error en la transmisión:', e)
    }
}
