/* 🎙️ JERARQUÍA DE ALMAS - SINTONÍA DE ALASTOR 🎙️
 * Personalizado para el espectáculo del Radio Demon.
 * "El mundo es un escenario, y el escenario es un patio de recreos".
 */

const roles = {
  '👤 *Mortal Insignificante I*': 0,
  '👤 *Mortal Insignificante II*': 2,
  '👤 *Mortal Insignificante III*': 4,
  '👤 *Mortal Insignificante IV*': 6,
  '👤 *Mortal Insignificante V*': 8,
  '👻 *Alma en Pena I*': 10,
  '👻 *Alma en Pena II*': 12,
  '👻 *Alma en Pena III*': 14,
  '👻 *Alma en Pena IV*': 16,
  '👻 *Alma en Pena V*': 18,
  '🥀 *Candidato al Exterminio I*': 20,
  '🥀 *Candidato al Exterminio II*': 22,
  '🥀 *Candidato al Exterminio III*': 24,
  '🥀 *Candidato al Exterminio IV*': 26,
  '🥀 *Candidato al Exterminio V*': 28,
  '🎭 *Actor del Escenario I*': 30,
  '🎭 *Actor del Escenario II*': 32,
  '🎭 *Actor del Escenario III*': 34,
  '🎭 *Actor del Escenario IV*': 36,
  '🎭 *Actor del Escenario V*': 38,
  '🔥 *Pecador de Clase Baja I*': 40,
  '🔥 *Pecador de Clase Baja II*': 42,
  '🔥 *Pecador de Clase Baja III*': 44,
  '🔥 *Pecador de Clase Baja IV*': 46,
  '🔥 *Pecador de Clase Baja V*': 48,
  '📻 *Oyente de la Radio I*': 50,
  '📻 *Oyente de la Radio II*': 52,
  '📻 *Oyente de la Radio III*': 54,
  '📻 *Oyente de la Radio IV*': 56,
  '📻 *Oyente de la Radio V*': 58,
  '♦️ *Esclavo bajo Contrato I*': 60,
  '♦️ *Esclavo bajo Contrato II*': 62,
  '♦️ *Esclavo bajo Contrato III*': 64,
  '♦️ *Esclavo bajo Contrato IV*': 66,
  '♦️ *Esclavo bajo Contrato V*': 68,
  '🐉 *Bestia de las Sombras I*': 70,
  '🐉 *Bestia de las Sombras II*': 72,
  '🐉 *Bestia de las Sombras III*': 74,
  '🐉 *Bestia de las Sombras IV*': 76,
  '🐉 *Bestia de las Sombras V*': 78,
  '😈 *Cortesía del Radio Demon I*': 80,
  '😈 *Cortesía del Radio Demon II*': 85,
  '😈 *Cortesía del Radio Demon III*': 90,
  '😈 *Cortesía del Radio Demon IV*': 95,
  '😈 *Cortesía del Radio Demon V*': 99,
  '💢 *Overlord en Ascenso I*': 100,
  '💢 *Overlord en Ascenso II*': 110,
  '💢 *Overlord en Ascenso III*': 120,
  '💢 *Overlord en Ascenso IV*': 130,
  '💢 *Overlord en Ascenso V*': 140,
  '🦅 *Exterminador del Cielo I*': 150,
  '🦅 *Exterminador del Cielo II*': 160,
  '🦅 *Exterminador del Cielo III*': 170,
  '🦅 *Exterminador del Cielo IV*': 180,
  '🦅 *Exterminador del Cielo V*': 199,
  '🦇 *Señor de las Almas I*': 200,
  '🦇 *Señor de las Almas II*': 225,
  '🦇 *Señor de las Almas III*': 250,
  '🦇 *Señor de las Almas IV*': 275,
  '🦇 *Señor de las Almas V*': 299,
  '🔪 *Verdugo de Serafines I*': 300,
  '🔪 *Verdugo de Serafines II*': 325,
  '🔪 *Verdugo de Serafines III*': 350,
  '🔪 *Verdugo de Serafines IV*': 375,
  '🔪 *Verdugo de Serafines V*': 399,
  '☠️ *Azote de los Pecados I*': 400,
  '☠️ *Azote de los Pecados II*': 425,
  '☠️ *Azote de los Pecados III*': 450,
  '☠️ *Azote de los Pecados IV*': 475,
  '☠️ *Azote de los Pecados V*': 499,
  '✡️ *Guardián del Infierno I*': 500,
  '✡️ *Guardián del Infierno II*': 525,
  '✡️ *Guardián del Infierno III*': 550,
  '✡️ *Guardián del Infierno IV*': 575,
  '✡️ *Guardián del Infierno V*': 599,
  '☁️ *Conquistador de las Nubes I*': 600,
  '☁️ *Conquistador de las Nubes II*': 625,
  '☁️ *Conquistador de las Nubes III*': 650,
  '☁️ *Conquistador de las Nubes IV*': 675,
  '☁️ *Conquistador de las Nubes V*': 699,
  '🪽 *Serafín Caído I*': 700,
  '🪽 *Serafín Caído II*': 725,
  '🪽 *Serafín Caído III*': 750,
  '🪽 *Serafín Caído IV*': 775,
  '🪽 *Serafín Caído V*': 799,
  '✴️ *Pecador Original I*': 800,
  '✴️ *Pecador Original II*': 825,
  '✴️ *Pecador Original III*': 850,
  '✴️ *Pecador Original IV*': 875,
  '✴️ *Pecador Original V*': 899,
  '🌟 *Príncipe del Pecado I*': 900,
  '🌟 *Príncipe del Pecado II*': 925,
  '🌟 *Príncipe del Pecado III*': 950,
  '🌟 *Príncipe del Pecado IV*': 975,
  '🌟 *Príncipe del Pecado V*': 999,
  '🎙️ *Overlord Supremo*': 1000,
  '🍎 *La Primera Mujer (Eva)*': 20000,
  '⚔️ *El Primer Hombre (Adán)*': 300000,
  '👑 *Rey del Infierno (Lucifer)*': 400000,
  '🌌 *La Creación Divina (Dios)*': 500000000,
  '📻 *RELOJ DE ARENA FINAL: ALASTOR* 👑': 100000000000000
}

let handler = m => m
handler.before = async function (m, { conn }) {
  let user = global.db.data.users[m.sender]
  if (!user) return
  let level = user.level
  
  // Lógica para encontrar el rol correspondiente basado en el nivel
  let role = (Object.entries(roles)
    .sort((a, b) => b[1] - a[1])
    .find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
    
  user.role = role
  return true
}

export default handler
