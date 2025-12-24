// plugins/proteccion-alastor.js
const ownerNumber = '5217223004357@s.whatsapp.net';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Esta parte se ejecuta si alguien intenta usar el comando de protección manualmente
    conn.reply(m.chat, `*¡Hola, querido!* Soy Alastor, y estoy vigilando las frecuencias de este chat. 🎙️`, m);
};

handler.before = async function (m, { conn }) {
    // 1. Verificamos prefijos . y # (según tu configuración recordada)
    if (!m.text || !/^[.#]/.test(m.text)) return false;

    // 2. Extraemos el comando y el objetivo
    const target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);

    // 3. RESTRICCIÓN DIRECTA
    if (target === ownerNumber && m.sender !== ownerNumber) {
        
        // Alastor interviene con su estilo característico
        await conn.sendMessage(m.chat, {
            text: `*¡ALTO AHÍ, PECADOR!* 📻\n\n¿Intentas usar un comando contra mi creador? ¡Qué falta de modales! Tu frecuencia está llena de estática... ¡JA, JA, JA! 🎙️✨\n\n_— El Show ha terminado para ti._`,
            mentions: [m.sender]
        }, { quoted: m });

        // IMPORTANTE: Bloqueo de mensaje a nivel de núcleo
        m.text = ''; // Vaciamos el texto para que el bot no encuentre ningún comando que ejecutar
        m.command = ''; // Anulamos el comando detectado
        return true; // Detenemos la cadena de mando
    }

    return false;
};

handler.help = ['proteccion']
handler.tags = ['owner']
// Usamos un regex que atrape "casi todo" si el objetivo eres tú, 
// pero aquí lo dejamos estándar para que no interfiera con el uso normal
handler.command = /^(alastor|proteccion)$/i 
handler.group = true

export default handler;
