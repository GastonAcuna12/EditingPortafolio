// Short context drawn from the existing project descriptions. No client names,
// dates or performance claims are inferred from file names or video content.
export const projectNotes = {
  "julian-motion-performance": {
    en: { category: "Motion / Short-form", role: "Editing & motion graphics", intro: "I built the rhythm around type, figures and a phone that sets the scene.", context: "A vertical motion piece that moves between a phone, human figures and short bursts of text.", approach: "The opening starts with a familiar object. I then change scale and alternate visual beats so each line has its own moment." },
    es: { category: "Motion / Short-form", role: "Edición y motion graphics", intro: "Construí el ritmo con tipografía, figuras y un teléfono que abre la escena.", context: "Una pieza vertical que combina un teléfono, figuras humanas y frases breves.", approach: "La apertura parte de un objeto reconocible. Después alterno escalas y beats visuales para darle su momento a cada frase." },
  },
  "authoritative-motion-ad": {
    en: { category: "Motion / Advertising", role: "Editing & motion graphics", intro: "I paired oversized type with product and map callouts.", context: "A vertical ad using a car, location graphics and a strong typographic voice.", approach: "Large words set the hierarchy. Product and map shots make the message concrete while the graphic transitions keep it moving." },
    es: { category: "Motion / Publicidad", role: "Edición y motion graphics", intro: "Combiné tipografía grande con planos de producto y callouts de ubicación.", context: "Un ad vertical con un auto, gráficos de ubicación y una voz tipográfica marcada.", approach: "Las palabras grandes ordenan la información. Los planos de producto y mapa aterrizan el mensaje, y las transiciones gráficas sostienen el ritmo." },
  },
  "top-iphone": {
    en: { category: "Editing / Social", role: "Video editing", intro: "I cut a phone ranking around the presenter, model reveals and product shots.", context: "A short-form iPhone ranking made for social feeds.", approach: "The numbered reveals give the edit a structure. I cut between the presenter and the phones, using callouts to make each model easy to identify." },
    es: { category: "Edición / Social", role: "Edición de video", intro: "Edité un ranking de teléfonos con presentador, reveals de modelos y planos de producto.", context: "Un ranking de iPhone en formato short-form para feeds sociales.", approach: "Los números le dan estructura al edit. Alterné al presentador con los teléfonos y usé callouts para identificar cada modelo." },
  },
  "gorilon-event": {
    en: { category: "Creator event / TikTok", role: "Video editing", intro: "I brought creator footage and gameplay into one quick event cutdown.", context: "A TikTok piece for a creator event, combining on-camera footage, gameplay and graphic segments.", approach: "The split frame keeps the creator and the game visible together. I used the graphic segments to connect those moments without losing the pace." },
    es: { category: "Evento creator / TikTok", role: "Edición de video", intro: "Uní material de creadores y gameplay en un cutdown ágil del evento.", context: "Una pieza de TikTok para un evento creator, con material a cámara, gameplay y segmentos gráficos.", approach: "El cuadro dividido mantiene al creador y al juego visibles a la vez. Los segmentos gráficos conectan esos momentos sin perder ritmo." },
  },
  "which-is-stronger-motion-ad": {
    en: { category: "Motion / Advertising", role: "Editing & motion graphics", intro: "I structured the ad as a side-by-side gameplay comparison.", context: "A vertical game ad built around one question: which is stronger?", approach: "The question stays visible while the two halves move from character cards into gameplay. That shared structure makes the comparison easy to follow." },
    es: { category: "Motion / Publicidad", role: "Edición y motion graphics", intro: "Organicé el ad como una comparación de gameplay lado a lado.", context: "Un ad vertical de juego construido alrededor de una pregunta: ¿qué es más fuerte?", approach: "La pregunta permanece visible mientras las dos mitades pasan de las tarjetas de personajes al gameplay. Esa estructura común permite seguir la comparación." },
  },
  "the-guest-rush-3d-ad": {
    en: { category: "3D camera / Motion ad", role: "Editing & motion graphics", intro: "I used 3D camera movement to connect the characters and gameplay.", context: "A vertical game ad that starts in the characters' world and moves into the game board.", approach: "Camera moves carry the handoff between the illustrated scene and the gameplay. The depth supports the transition while the board stays readable." },
    es: { category: "Cámara 3D / Motion ad", role: "Edición y motion graphics", intro: "Usé movimiento de cámara 3D para conectar los personajes con el gameplay.", context: "Un ad vertical que empieza en el mundo de los personajes y pasa al tablero del juego.", approach: "La cámara conecta la escena ilustrada con el gameplay. La profundidad acompaña la transición mientras el tablero se mantiene legible." },
  },
  "semana-santa-motion-ad": {
    en: { category: "Seasonal campaign / Motion", role: "Motion graphics", intro: "I animated a chat exchange, using message timing to tell the seasonal story.", context: "A seasonal piece presented as a conversation inside a phone interface.", approach: "The message bubbles provide the sequence. I paced their arrivals and framed the UI so the conversation can be read as it unfolds." },
    es: { category: "Campaña estacional / Motion", role: "Motion graphics", intro: "Animé una conversación de chat, usando el timing de los mensajes para contar la pieza.", context: "Una pieza de temporada presentada como una conversación dentro de la interfaz de un teléfono.", approach: "Las burbujas de mensajes marcan la secuencia. Trabajé su entrada y el encuadre de la UI para que la conversación se pueda leer a medida que avanza." },
  },
}

export function getProjectNotes(id, language) {
  return { ...projectNotes[id]?.en, ...projectNotes[id]?.[language] }
}
