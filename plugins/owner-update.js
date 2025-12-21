import { exec } from 'child_process';

let handler = async (m, { conn }) => {
  const emoji = '😈';
  const emoji2 = '😈';
  const emoji4 = '😈';
  const msm = '😈';

  m.reply(`${emoji2} Actualizando el bot...`);

  exec('git pull', (err, stdout, stderr) => {
    if (err) {
      conn.reply(m.chat, `${msm} Error al actualizar normalmente. Forzando actualización...`, m);
      exec('git reset --hard origin/main && git pull', (err2, stdout2, stderr2) => {
        if (err2) {
          conn.reply(m.chat, `${msm} No se pudo forzar la actualización.\nRazón: ${err2.message}`, m);
          return;
        }

        if (stderr2) console.warn(stderr2);

        conn.reply(m.chat, `${emoji} Actualización forzada realizada con éxito.\n\n${stdout2}`, m);
      });
      return;
    }

    if (stderr) console.warn(stderr);

    if (stdout.includes('Already up to date.')) {
      conn.reply(m.chat, `${emoji4} El bot ya está actualizado.`, m);
    } else {
      conn.reply(m.chat, `${emoji} Actualización realizada con éxito.\n\n${stdout}`, m);
    }
  });
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update'];
handler.rowner = true;

export default handler;