/**
 * PLUGIN: Ruleta Progresiva Brooklyn's
 * Prefijos: . o #
 */

let handler = async (m, { conn, usedPrefix, command }) => {
    // Inicializar base de datos de giros si no existe
    if (!global.db.data.users[m.sender].ruletaGiros) {
        global.db.data.users[m.sender].ruletaGiros = 0;
    }

    let user = global.db.data.users[m.sender];
    user.ruletaGiros += 1;
    let giros = user.ruletaGiros;

    let costo = 0;
    let probExito = 2; // 2% por defecto
    let fase = "";
    let modoDios = false;

    // --- LÓGICA DE COSTOS Y FASES ---
    if (giros <= 10) {
        costo = 0;
        fase = "🟢 NIVATO (Costo: Gratis)";
    } else if (giros <= 20) {
        costo = 1000000; // 1 Millón
        fase = "🟡 ADICTO (Costo: 1 Millón)";
    } else if (giros <= 30) {
        costo = 1000000000000; // 1 Billón
        fase = "🔴 SUICIDA (Costo: 1 Billón)";
    } else {
        costo = 200000000000000000; // 200,000 Billones
        probExito = 100;
        fase = "🔱 DIOS (Costo: 200k Billones)";
        modoDios = true;
    }

    // Verificar si el usuario tiene el dinero
    if (user.money < costo) {
        return m.reply(`❌ No tienes suficientes monedas para este nivel.\n💰 **Costo actual:** ${costo.toLocaleString()}\n📊 **Tu balance:** ${user.money.toLocaleString()}`);
    }

    // Cobrar el giro
    user.money -= costo;

    // --- TABLAS DE RECOMPENSAS ---
    const malas = [
        { n: "Un zapato viejo", m: 0, e: 0 },
        { n: "Bolsa de basura", m: 100, e: 10 },
        { n: "Aire de montaña", m: 1, e: 1 }
    ];

    const buenas = [
        { n: "💎 DIAMANTE DE 35B", m: 35000000000000, e: 35000000000000 },
        { n: "🔥 NÚCLEO GALÁCTICO", m: 32000000000000, e: 32000000000000 }
    ];

    const divinas = [
        { n: "🌌 OMNIPOTENCIA TOTAL", m: 500000000000000000, e: 500000000000000000 },
        { n: "👑 SOBERANO DEL COSMOS", m: 999999999999999999, e: 999999999999999999 }
    ];

    // --- SORTEO ---
    let suerte = Math.random() * 100;
    let premio;

    if (modoDios) {
        premio = divinas[Math.floor(Math.random() * divinas.length)];
    } else if (suerte <= probExito) {
        premio = buenas[Math.floor(Math.random() * buenas.length)];
    } else {
        premio = malas[Math.floor(Math.random() * malas.length)];
    }

    // Entregar premio
    user.money += premio.m;
    user.exp += premio.e;

    // --- RESPUESTA ---
    let cap = `🎰 **RULETA BROOKLYN'S** 🎰\n`;
    cap += `━━━━━━━━━━━━━━━━━━━━\n`;
    cap += `📊 **Fase:** ${fase}\n`;
    cap += `🔢 **Giro Nº:** ${giros}\n`;
    cap += `💸 **Costo:** -${costo.toLocaleString()}\n`;
    cap += `━━━━━━━━━━━━━━━━━━━━\n`;
    cap += `🎁 **Premio:** ${premio.n}\n`;
    cap += `💰 **Monedas:** +${premio.m.toLocaleString()}\n`;
    cap += `✨ **Exp:** +${premio.e.toLocaleString()}\n`;
    cap += `━━━━━━━━━━━━━━━━━━━━\n`;

    if (modoDios) {
        cap += `👑 **¡EL PODER ABSOLUTO ES TU
