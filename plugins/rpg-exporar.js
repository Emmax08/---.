let cooldowns = {};

let handler = async (m, { conn, text, command }) => {
  let users = global.db.data.users;
  let senderId = m.sender;
  
  // Variables de personalización
  let moneda = global.moneda || 'Coins 🪙';
  let emoji = global.emoji || '🌲';
  let tiempoEspera = 5 * 60; // 5 minutos

  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[senderId] + tiempoEspera * 1000 - Date.now()) / 1000));
    m.reply(`${emoji} Ya exploraste el bosque recientemente. Espera ⏳ *${tiempoRestante}* antes de aventurarte de nuevo.`);
    return;
  }

  if (!users[senderId]) {
    users[senderId] = { health: 100, coin: 0, exp: 0 };
  }

  const eventos = [
    { nombre: '💰 Tesoro Escondido', coin: 100, exp: 50, health: 0, mensaje: `¡Encontraste un cofre lleno de ${moneda}!` },
    { nombre: '🐻 Oso Salvaje', coin: -50, exp: 20, health: -15, mensaje: `Un oso te atacó y perdiste algunas ${moneda} mientras escapabas.` },
    { nombre: '🕸️ Trampa Antigua', coin: 0, exp: 10, health: -5, mensaje: 'Caíste en una trampa antigua, pero lograste escapar.' },
    { nombre: '💎 Piedra Mágica', coin: 200, exp: 100, health: 0, mensaje: `¡Descubriste una piedra mágica que te otorgó ${moneda} adicionales!` },
    { nombre: '🧙 Viejo Sabio', coin: 50, exp: 30, health: 0, mensaje: 'Un sabio te recompensó por escuchar sus historias.' },
    { nombre: '⚔️ Enemigo Oculto', coin: -30, exp: 15, health: -10, mensaje: `Te enfrentaste a un enemigo oculto y perdiste algunas ${moneda}.` },
    { nombre: '🍄 Setas Extrañas', coin: 0, exp: 5, health: 0, mensaje: 'Comiste unas setas del bosque, pero no pasó nada interesante.' }
  ];

  let evento = eventos[Math.floor(Math.random() * eventos.length)];

  // Aplicar cambios a la base de datos
  users[senderId].coin = Math.max(0, users[senderId].coin + evento.coin);
  users[senderId].exp += evento.exp;
  users[senderId].health = Math.max(0, users[senderId].health + evento.health);
  
  cooldowns[senderId] = Date.now();

  // URL de la imagen
  let img = 'https://qu.ax/ljzxA.jpg';
  
  let info = `╭━〔 Exploración en el Bosque 〕
┃ Misión: *${evento.nombre}*
┃ Evento: ${evento.mensaje}
┃ Recompensa: ${evento.coin >= 0 ? '+' : '-'}${Math.abs(evento.coin)} *${moneda}* y +${evento.exp} *XP*
┃ Salud: ${users[senderId].health}% ${evento.health < 0 ? '🔻' : '✅'}
╰━━━━━━━━━━━━⬣`;

  // Envío de imagen con texto (caption)
  // El tercer parámetro 'explorar.jpg' asegura que el bot lo trate como imagen
  await conn.sendFile(m.chat, img, 'explorar.jpg', info, m);

  global.db.write();
};

handler.tags = ['rpg'];
handler.help = ['explorar', 'bosque'];
handler.command = /^(explorar|bosque)$/i;
handler.register = true;
handler.group = true;

export default handler;

function segundosAHMS(segundos) {
  let minutos = Math.floor(segundos / 60);
  let segundosRestantes = segundos % 60;
  return `${minutos} minutos y ${segundosRestantes} segundos`;
}
