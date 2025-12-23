import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Lista de IDs de personajes (puedes expandirla)
    const voices = {
        'messi': '79679654-2c21-4f16-86d1-f5139433a0c5',
        'bob': '9e987c2b-e104-43c2-8025-502a356247c4',
        'closs': '626f6345-455b-4395-8e3d-0d85a1a9e334',
        'vader': '19f3a530-9b41-4777-a8b2-b7e19207e05a'
    }

    if (!text) throw `*⚠️ Uso incorrecto del comando*\n\nUsa: _${usedPrefix + command} [personaje] [texto]_\n\n*Ejemplo:* ${usedPrefix + command} messi hola ¿cómo estás?\n\n*Voces disponibles:* messi, bob, closs, vader`

    const args = text.split(' ')
    const character = args[0].toLowerCase()
    const msg = args.slice(1).join(' ')

    if (!voices[character]) throw `❌ El personaje *${character}* no existe. Usa: messi, bob, closs o vader.`
    if (!msg) throw `❌ Debes escribir un mensaje para que el personaje lo diga.`

    m.reply('_Generando nota de voz, espera un momento..._')

    try {
        // Usamos una API de conversión de texto a voz (TTS)
        const res = await fetch(`https://api.lolhuman.xyz/api/fakeyou?apikey=GataDios&text=${encodeURIComponent(msg)}&character=${voices[character]}`)
        const json = await res.json()

        if (json.status !== 200) throw 'Error al conectar con la API.'

        // Enviamos el resultado como nota de voz (PTT)
        await conn.sendMessage(m.chat, { 
            audio: { url: json.result }, 
            mimetype: 'audio/mp4', 
            ptt: true 
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('❌ Lo siento, hubo un error al procesar el audio.')
    }
}

handler.help = ['iavoice']
handler.tags = ['fun']
handler.command = /^(iavoice|tovoz|voz)$/i

export default handler
