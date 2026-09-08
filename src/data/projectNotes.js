// Short context drawn from the existing project descriptions. No client names,
// dates or performance claims are inferred from file names or video content.
export const projectNotes = {
  "julian-motion-performance": {
    en: { category: "Motion / Short-form", role: "Editing & motion graphics", context: "A vertical motion piece built for mobile viewing.", approach: "I shaped the edit around sharp pacing and a clear visual hierarchy, so the motion carries the idea from one beat to the next." },
    es: { category: "Motion / Short-form", role: "Edición y motion graphics", context: "Una pieza vertical de motion pensada para verse en el teléfono.", approach: "Trabajé el ritmo y la jerarquía visual para que el motion lleve la idea de un beat al siguiente." },
  },
  "authoritative-motion-ad": {
    en: { category: "Motion / Advertising", role: "Editing & motion graphics", context: "A vertical motion ad with a direct, confident visual tone.", approach: "I used firm pacing and a clear order of information to give the piece its weight, keeping the motion tied to the message." },
    es: { category: "Motion / Publicidad", role: "Edición y motion graphics", context: "Un motion ad vertical con un tono visual directo y firme.", approach: "Trabajé un ritmo marcado y un orden claro de la información, con el motion acompañando el mensaje." },
  },
  "top-iphone": {
    en: { category: "Editing / Social", role: "Video editing", context: "A short-form edit for social feeds, framed in 9:16.", approach: "I worked with quick cuts, callouts and mobile framing to keep the information easy to follow on a small screen." },
    es: { category: "Edición / Social", role: "Edición de video", context: "Un edit short-form para feeds sociales en formato 9:16.", approach: "Trabajé cortes ágiles, callouts y encuadres mobile para que la información se pueda seguir en una pantalla chica." },
  },
  "gorilon-event": {
    en: { category: "Creator event / TikTok", role: "Video editing", context: "A TikTok cutdown made for a creator event.", approach: "I focused the cut on pacing and attention, shaping the event into a short piece that works in a mobile feed." },
    es: { category: "Evento creator / TikTok", role: "Edición de video", context: "Un cutdown de TikTok para un evento creator.", approach: "Me enfoqué en el ritmo y la atención para llevar el evento a una pieza corta que funcione en el feed." },
  },
  "which-is-stronger-motion-ad": {
    en: { category: "Motion / Advertising", role: "Editing & motion graphics", context: "A vertical motion ad built around a clear opening hook.", approach: "I organized the piece around the concept first, using graphic rhythm and deliberate timing to move it forward." },
    es: { category: "Motion / Publicidad", role: "Edición y motion graphics", context: "Un motion ad vertical construido alrededor de un hook claro.", approach: "Ordené la pieza desde el concepto, usando ritmo gráfico y timing para hacerla avanzar." },
  },
  "the-guest-rush-3d-ad": {
    en: { category: "3D camera / Motion ad", role: "Editing & motion graphics", context: "A vertical ad with 3D camera movement at the center of the piece.", approach: "I used the camera movement to guide attention through the edit, balancing depth with pacing that works on mobile." },
    es: { category: "Cámara 3D / Motion ad", role: "Edición y motion graphics", context: "Un ad vertical con movimiento de cámara 3D como recurso central.", approach: "Usé el movimiento de cámara para guiar la atención, equilibrando profundidad y ritmo para mobile." },
  },
  "semana-santa-motion-ad": {
    en: { category: "Seasonal campaign / Motion", role: "Motion graphics", context: "A motion piece for a seasonal campaign.", approach: "I built the atmosphere through graphic rhythm and timing, keeping a consistent mood across the piece." },
    es: { category: "Campaña estacional / Motion", role: "Motion graphics", context: "Una pieza de motion para una campaña de temporada.", approach: "Construí la atmósfera desde el ritmo gráfico y el timing para mantener un mismo tono a lo largo de la pieza." },
  },
}

export function getProjectNotes(id, language) {
  return { ...projectNotes[id]?.en, ...projectNotes[id]?.[language] }
}
