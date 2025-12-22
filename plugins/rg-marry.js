/* Código optimizado por Destroy & Gemini 
 - Basado en: https://github.com/The-King-Destroy
*/

import fs from 'fs';
import path from 'path';

const marriagesFile = path.resolve('src/database/casados.json');

// Asegurar que el directorio existe
if (!fs.existsSync(path.dirname(marriagesFile))) {
    fs.mkdirSync(path.dirname(marriagesFile), { recursive: true });
}

let marriages = loadMarriages();
const confirmation = {};

function loadMarriages() {
    try {
        return fs.existsSync(marriagesFile) ? JSON.parse(fs.readFileSync(marriagesFile, 'utf8')) : {};
    } catch (e) {
        console.error("Error cargando matrimonios:", e);
        return {};
    }
}

function saveMarriages() {
    fs.writeFileSync(marriagesFile, JSON.stringify(marriages, null, 2));
}

const handler = async (m, { conn, command, usedPrefix }) => {
    const isPropose = /^marry$/i.test(command);
    const isDivorce = /^divorce$/i.test(command);
    const userIsMarried = (user) => marriages[user] !== undefined;

    try {
        if (isPropose) {
            const proposee = m.quoted?.sender || m.mentionedJid?.[0];
            const proposer = m.sender;

            if (!proposee) {
                if (userIsMarried(proposer)) {
                    const partnerName = conn.getName(marriages[proposer]);
                    return await conn.reply(m.chat, `《✧》 Ya estás casado con *${partnerName}*\n> Puedes divorciarte con: *${usedPrefix}divorce*`, m);
                } else {
                    throw new Error(`Debes mencionar a alguien.\n> Ejemplo » *${usedPrefix}marry @usuario*`);
                }
            }

            if (userIsMarried(proposer)) throw new Error(`Ya estás casado con ${conn.getName(marriages[proposer])}.`);
            if (userIsMarried(proposee)) throw new Error(`${conn.getName(proposee)} ya está casado(a).`);
            if (proposer === proposee) throw new Error('¡No puedes casarte contigo mismo!');

            const proposerName = conn.getName(proposer);
            const proposeeName = conn.getName(proposee);
            
            // Mensaje actualizado pidiendo "Aceptar"
            const confirmationMessage = `♡ ${proposerName} te ha propuesto matrimonio, ${proposeeName}. ¿Aceptas? •(=^●ω●^=)•\n\n*Responde con:*\n> ✐ "Aceptar" para confirmar\n> ✐ "No" para rechazar.`;
            
            await conn.reply(m.chat, confirmationMessage, m, { mentions: [proposee, proposer] });

            confirmation[proposee] = {
                proposer,
                timeout: setTimeout(() => {
                    if (confirmation[proposee]) {
                        conn.sendMessage(m.chat, { text: '*《✧》 Tiempo agotado. La propuesta ha sido cancelada.*' }, { quoted: m });
                        delete confirmation[proposee];
                    }
                }, 60000)
            };

        } else if (isDivorce) {
            if (!userIsMarried(m.sender)) throw new Error('No estás casado con nadie.');

            const partner = marriages[m.sender];
            delete marriages[m.sender];
            delete marriages[partner];
            saveMarriages();

            if (global.db?.data?.users) {
                if (global.db.data.users[m.sender]) global.db.data.users[m.sender].marry = '';
                if (global.db.data.users[partner]) global.db.data.users[partner].marry = '';
            }

            await conn.reply(m.chat, `✐ ${conn.getName(m.sender)} y ${conn.getName(partner)} se han divorciado.`, m);
        }
    } catch (error) {
        await conn.reply(m.chat, `《✧》 ${error.message}`, m);
    }
}

handler.before = async (m) => {
    if (m.isBaileys || !m.text) return;
    if (!(m.sender in confirmation)) return;

    const { proposer, timeout } = confirmation[m.sender];
    const text = m.text.toLowerCase().trim();

    if (text === 'no') {
        clearTimeout(timeout);
        delete confirmation[m.sender];
        return conn.reply(m.chat, '*《✧》 Han rechazado la propuesta de matrimonio.*', m);
    }

    // Cambio aquí: ahora detecta "aceptar"
    if (text === 'aceptar') {
        clearTimeout(timeout);
        
        marriages[proposer] = m.sender;
        marriages[m.sender] = proposer;
        saveMarriages();

        if (global.db?.data?.users) {
            if (global.db.data.users[proposer]) global.db.data.users[proposer].marry = m.sender;
            if (global.db.data.users[m.sender]) global.db.data.users[m.sender].marry = proposer;
        }

        const weddingText = `✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩\n¡Se han Casado! ฅ^•ﻌ•^ฅ*:･ﾟ✧\n\n*•.¸♡ ${conn.getName(proposer)} & ${conn.getName(m.sender)}\n\n\`Disfruten de su luna de miel\`\n✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩`;
        
        await conn.reply(m.chat, weddingText, m, { mentions: [proposer, m.sender] });
        delete confirmation[m.sender];
    }
};

handler.tags = ['fun'];
handler.help = ['marry *@usuario*', 'divorce'];
handler.command = ['marry', 'divorce'];
handler.group = true;

export default handler;
