/*🎙️ TRANSMISIÓN DE ALASTOR 🎙️
Este código ha sido sintonizado para ofrecer el mejor espectáculo del infierno.
"Nunca estás totalmente vestido sin una sonrisa".
*/

const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import { Boom } from '@hapi/boom'
import * as ws from 'ws'
const { exec } = await import('child_process')
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

// --- INTERFAZ ESTILO ALASTOR ---
let rtx = `🎙️ *¡SALUDOS SINTONIZADOS!* 🎙️\n\n📻 *¿Listo para un contrato radiofónico?*\nEscanea este código QR con otro dispositivo para convertirte en una emisora secundaria de mi espectáculo.\n\n\`1\` » Ve a los tres puntos (Esquina superior derecha).\n\`2\` » Selecciona *Dispositivos vinculados*.\n\`3\` » Escanea esta señal antes de que se convierta en estática.\n\n🍎 *¡Apresúrate! Esta frecuencia expira en 45 segundos.*`

let rtx2 = `🎙️ *CÓDIGO DE TRANSMISIÓN* 🎙️\n\n📻 *¡Vaya, prefieres el método directo!*\nUsa este código para vincular tu alma... quiero decir, tu cuenta, a nuestra red.\n\n\`1\` » Ve a *Dispositivos vinculados*.\n\`2\` » Selecciona *Vincular con el número de teléfono*.\n\`3\` » Escribe el código que verás a continuación.\n\n⚠️ *Advertencia:* No es recomendable usar tu cuenta principal si no quieres que el programa sea... permanente. ¡JAJAJA!`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MariaJBOptions = {}
if (!(global.conns instanceof Array)) global.conns = []

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Verificación de cooldown para evitar spam en la señal
    let user = global.db.data.users[m.sender]
    let time = (user.Subs || 0) + 120000
    if (new Date() - (user.Subs || 0) < 120000) return conn.reply(m.chat, `🎙️ *¡Paciencia, querido!* La señal está saturada. Espera ${msToTime(time - new Date())} para volver a sintonizar.`, m)
    
    const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.OPEN)])]
    if (subBots.length >= 90) {
        return m.reply(`📻 *¡Vaya!* Mi estudio está lleno de invitados. No hay más espacio por ahora.`)
    }

    let id = `${m.sender.split`@`[0]}`
    let pathMariaJadiBot = path.join(`./MariaJadiBot/`, id) // Asegúrate que 'jadi' esté definido o usa una ruta fija
    if (!fs.existsSync(pathMariaJadiBot)){
        fs.mkdirSync(pathMariaJadiBot, { recursive: true })
    }

    MariaJBOptions.pathMariaJadiBot = pathMariaJadiBot
    MariaJBOptions.m = m
    MariaJBOptions.conn = conn
    MariaJBOptions.args = args
    MariaJBOptions.usedPrefix = usedPrefix
    MariaJBOptions.command = command
    
    MariaJadiBot(MariaJBOptions)
    user.Subs = new Date() * 1
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler

export async function MariaJadiBot(options) {
    let { pathMariaJadiBot, m, conn, args, command } = options
    const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : (command === 'code')
    let txtCode, codeBot, txtQR
    
    let { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(pathMariaJadiBot)

    const connectionOptions = {
        logger: pino({ level: "fatal" }),
        printQRInTerminal: false,
        auth: { 
            creds: state.creds, 
            keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) 
        },
        browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Radio Demon Host', 'Chrome','2.0.0'],
        version: version,
    };

    let sock = makeWASocket(connectionOptions)
    sock.isInit = false

    async function connectionUpdate(update) {
        const { connection, lastDisconnect, qr } = update
        
        // --- MANEJO DE QR ---
        if (qr && !mcode) {
            let buffer = await qrcode.toBuffer(qr, { scale: 8 })
            txtQR = await conn.sendMessage(m.chat, { image: buffer, caption: rtx.trim()}, { quoted: m})
            setTimeout(() => { 
                if (txtQR) conn.sendMessage(m.chat, { delete: txtQR.key }).catch(e => e) 
            }, 45000)
        }

        // --- MANEJO DE CÓDIGO DE EMPAREJAMIENTO ---
        if (qr && mcode && !sock.pairingCodeSent) {
            sock.pairingCodeSent = true 
            txtCode = await conn.sendMessage(m.chat, { text: rtx2.trim() }, { quoted: m })
            await new Promise(resolve => setTimeout(resolve, 3000))
            let code = await sock.requestPairingCode(m.sender.split('@')[0])
            codeBot = await m.reply(code.match(/.{1,4}/g)?.join('-') || code)
        }

        if (connection === 'open') {
            sock.isInit = true
            global.conns.push(sock)
            await conn.sendMessage(m.chat, { text: `🎙️ *¡ESTAMOS AL AIRE!* 🎙️\n\nLa transmisión se ha enlazado con éxito. Disfruta del espectáculo, querido amigo... ¡JAJAJA!` }, { quoted: m })
        }

        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            if (reason === DisconnectReason.loggedOut) {
                fs.rmSync(pathMariaJadiBot, { recursive: true, force: true })
            } else {
                MariaJadiBot(options) // Reconectar
            }
        }
    }

    sock.ev.on('connection.update', connectionUpdate)
    sock.ev.on('creds.update', saveCreds)
}

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60)
    return `${minutes}m ${seconds}s`
}
