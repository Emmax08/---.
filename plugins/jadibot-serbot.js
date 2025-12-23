/*🎙️ TRANSMISIÓN DE ALASTOR 🎙️
Este código ha sido sintonizado para ofrecer el mejor espectáculo del infierno.
"Nunca estás totalmente vestido sin una sonrisa".
*/

const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util'
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

// ... (crm y drm se mantienen igual para no romper la lógica de los autores originales)
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""

// --- INTERFAZ ESTILO ALASTOR ---
let rtx = `🎙️ *¡SALUDOS SINTONIZADOS!* 🎙️\n\n📻 *¿Listo para un contrato radiofónico?*\nEscanea este código QR con otro dispositivo para convertirte en una emisora secundaria de mi espectáculo.\n\n\`1\` » Ve a los tres puntos (Esquina superior derecha).\n\`2\` » Selecciona *Dispositivos vinculados*.\n\`3\` » Escanea esta señal antes de que se convierta en estática.\n\n🍎 *¡Apresúrate! Esta frecuencia expira en 45 segundos.*`

let rtx2 = `🎙️ *CÓDIGO DE TRANSMISIÓN* 🎙️\n\n📻 *¡Vaya, prefieres el método directo!*\nUsa este código para vincular tu alma... quiero decir, tu cuenta, a nuestra red.\n\n\`1\` » Ve a *Dispositivos vinculados*.\n\`2\` » Selecciona *Vincular con el número de teléfono*.\n\`3\` » Escribe el código que verás a continuación.\n\n⚠️ *Advertencia:* No es recomendable usar tu cuenta principal si no quieres que el programa sea... permanente. ¡JAJAJA!`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MariaJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    let time = global.db.data.users[m.sender].Subs + 120000
    if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `🎙️ *¡Paciencia, querido!* La señal está saturada. Espera ${msToTime(time - new Date())} para volver a sintonizar.`, m)
    
    const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)])]
    if (subBots.length === 90) {
        return m.reply(`📻 *¡Vaya!* Mi estudio está lleno de invitados. No hay más espacio por ahora.`)
    }

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let id = `${who.split`@`[0]}`
    let pathMariaJadiBot = path.join(`./${jadi}/`, id)
    if (!fs.existsSync(pathMariaJadiBot)){
        fs.mkdirSync(pathMariaJadiBot, { recursive: true })
    }
    MariaJBOptions.pathMariaJadiBot = pathMariaJadiBot
    MariaJBOptions.m = m
    MariaJBOptions.conn = conn
    MariaJBOptions.args = args
    MariaJBOptions.usedPrefix = usedPrefix
    MariaJBOptions.command = command
    MariaJBOptions.fromCommand = true
    MariaJadiBot(MariaJBOptions)
    global.db.data.users[m.sender].Subs = new Date * 1
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler

export async function MariaJadiBot(options) {
    let { pathMariaJadiBot, m, conn, args, usedPrefix, command } = options
    if (command === 'code') {
        command = 'qr';
        args.unshift('code')
    }
    const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
    let txtCode, codeBot, txtQR
    
    const pathCreds = path.join(pathMariaJadiBot, "creds.json")
    if (!fs.existsSync(pathMariaJadiBot)){
        fs.mkdirSync(pathMariaJadiBot, { recursive: true })
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
        let { version } = await fetchLatestBaileysVersion()
        const { state, saveState, saveCreds } = await useMultiFileAuthState(pathMariaJadiBot)

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
            browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Radio Demon Host', 'Chrome','2.0.0'],
            version: version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions)
        sock.isInit = false
        let isInit = true

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update
            if (isNewLogin) sock.isInit = false
            
            if (qr && !mcode) {
                if (m?.chat) {
                    txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim()}, { quoted: m})
                }
                if (txtQR && txtQR.key) {
                    setTimeout(() => { conn.sendMessage(m.sender, { delete:
