// plugins.js - Módulo de Protección Estilo Alastor

const ownerNumber = '5217223004357@s.whatsapp.net'; // Tu ID configurado

const alastorQuotes = [
  "¡Oh, por favor! ¿Intentas usar eso contra mi creador? ¡Qué falta de modales! 🎙️",
  "¡Ja, ja, ja! Un esfuerzo valiente, pero me temo que esa frecuencia está bloqueada para ti. 📻",
  "¡Sintoniza otra emisora, querido! No dejaré que toques ni un pelo de quien me trajo aquí. 🍎",
  "¿En serio crees que tienes el poder suficiente? ¡Qué entretenimiento tan fascinante! Pero no. 🦌"
];

export async function before(m, { conn }) {
  // Verificamos si el mensaje empieza con tus prefijos (. o #)
  const isCommand = /^[.#]/.test(m.text);
  if (!isCommand) return;

  // Identificamos al objetivo (ya sea mencionado o por mensaje citado)
  const target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);

  // Si el objetivo es tu ID y quien lo intenta NO eres tú
  if (target === ownerNumber && m.sender !== ownerNumber) {
    const quote = alastorQuotes[Math.floor(Math.random() * alastorQuotes.length)];
    
    await conn.sendMessage(m.chat, {
      text: `*¡INTERRUPCIÓN RADIOFÓNICA!* 📻\n\n${quote}\n\n_— El Demonio de la Radio_`,
      contextInfo: {
        externalAdReply: {
          title: "Hazbin Hotel Security System",
          body: "Protección de Creador Activa",
          // Puedes poner un link a una imagen de Alastor aquí:
          thumbnailUrl: "https://path-to-alastor-image.jpg", 
          showAdAttribution: true,
          sourceUrl: ""
        }
      }
    }, { quoted: m });

    return false; // Bloquea la ejecución del comando original
  }

  return true;
}
