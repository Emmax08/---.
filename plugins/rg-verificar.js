import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// La ubicación de nuestro pequeño libro de deudores
const pathAlmas = join(process.cwd(), 'src/database/database.db.json');

const sintonizarRegistro = async () => {
    try {
        console.log("¡Saludos, pecadores! Buscando en los archivos de la radio... 🎙️");

        // Leyendo el archivo JSON
        const datosRaw = await readFile(pathAlmas, 'utf-8');
        const baseDeDatos = JSON.parse(datosRaw);

        console.log("¡Ah, aquí están los registros! Qué delicia de nombres:");
        console.table(baseDeDatos.usuarios || baseDeDatos); 

        // Un pequeño recordatorio de quién manda
        console.log("\n¡Todo está en orden! No olviden que el espectáculo apenas comienza.");

    } catch (error) {
        console.error("¡Qué descortesía! No pude encontrar el archivo o está corrupto. 💀");
        console.log("Asegúrate de que la ruta 'src/database/database.db.json' exista, ¡o tendré que improvisar!");
    } finally {
        console.log("¡Manténganse en sintonía! HA-HA-HA! 👋✨");
    }
};

sintonizarRegistro();
