import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

const easeOut = [0.22, 1, 0.36, 1]

const quickHover = {
  type: "spring",
  stiffness: 560,
  damping: 30,
  mass: 0.75,
}

const carouselSpring = {
  type: "spring",
  stiffness: 205,
  damping: 32,
  mass: 0.95,
}

const contact = {
  email: "gastonarielac@gmail.com",
  whatsapp: "595992642222",
  linkedin: "https://www.linkedin.com/in/gast%C3%B3n-acu%C3%B1a-9b065735b/",
}

const showreel = {
  youtubeId: "TU_ID_DE_YOUTUBE_SHOWREEL",
  title: "Gastón Acuña Showreel",
}

const services = ["Editing", "Motion Graphics", "VFX", "Visual Storytelling"]

const projects = [
  {
    id: "brand-film",
    title: "Brand Film Cutdown",
    type: "Editing / Brand Film",
    description:
      "A campaign edit shaped around message order, clear pacing and shorter cutdowns for paid social.",
    youtubeId: "TU_ID_DE_YOUTUBE_1",
    tags: ["Editing", "Cutdowns", "Brand"],
    metadata: [
      ["Challenge", "Long footage needed a sharper message"],
      ["Approach", "Rebuilt rhythm around the strongest beats"],
      ["Output", "16:9 film + paid social cutdowns"],
      ["Role", "Editor"],
    ],
  },
  {
    id: "motion-campaign",
    title: "Paid Social Motion Ads",
    type: "Motion Graphics / Paid Social",
    description:
      "Short-form motion pieces built around fast hooks, animated type and product moments that read quickly.",
    youtubeId: "TU_ID_DE_YOUTUBE_2",
    tags: ["Motion Graphics", "Short-Form", "Ads"],
    metadata: [
      ["Challenge", "Make the offer read in seconds"],
      ["Approach", "Type, UI beats and clean motion hierarchy"],
      ["Output", "1:1 / 4:5 / 9:16 ad assets"],
      ["Role", "Motion + edit"],
    ],
  },
  {
    id: "vfx-polish",
    title: "VFX Cleanup & Post",
    type: "VFX Cleanup / Post-Production",
    description:
      "Post-production support for cleaner final assets: cleanup, compositing help and delivery-ready exports.",
    youtubeId: "TU_ID_DE_YOUTUBE_3",
    tags: ["VFX Cleanup", "Post", "Compositing"],
    metadata: [
      ["Challenge", "Final assets needed a cleaner finish"],
      ["Approach", "Cleanup, compositing support and final polish"],
      ["Output", "Campaign exports ready for handoff"],
      ["Role", "Post-production"],
    ],
  },
]

const verticalProjects = [
  {
    id: "julian-motion-performance",
    title: "Performance Motion Cut",
    eyebrow: "9:16 / MOTION",
    category: "High-Performance Motion",
    description:
      "High-performance vertical motion piece built around sharp pacing, clean visual hierarchy and strong mobile-first delivery.",
    videoSrc:
      "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779289607/JulianPort_y8itgt.mp4",
    tags: ["Motion", "Performance", "9:16"],
  },
  {
    id: "authoritative-motion-ad",
    title: "Authority Motion Ad",
    eyebrow: "9:16 / MOTION AD",
    category: "High-End Motion Ad",
    description:
      "Authoritative high-end motion ad with strong pacing, confident visual hierarchy and premium post-production feel.",
    videoSrc:
      "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779074774/MOTION_41_xsii0z.mp4",
    tags: ["Motion Ad", "Authority", "Premium"],
  },
  {
    id: "top-iphone",
    title: "Top iPhone",
    eyebrow: "9:16 / SHORT-FORM",
    category: "Social / Mobile Cutdown",
    description:
      "Short-form 9:16 edit for social feeds, with pacing, callouts and mobile-first framing.",
    videoSrc:
      "https://res.cloudinary.com/deqkn7ti2/video/upload/Top_Iphone_atljw6.mp4",
    tags: ["9:16", "Short-Form", "Social"],
  },
  {
    id: "gorilon-event",
    title: "Gorilón Event Cutdown",
    eyebrow: "9:16 / TIKTOK",
    category: "TikTok / Creator Event",
    description:
      "High-performing TikTok cutdown built for a creator event, focused on pacing, retention and mobile-first delivery.",
    videoSrc:
      "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779075003/Gorilon_portafolio_nu0nxj.mp4",
    tags: ["TikTok", "Creator Event", "Cutdown"],
  },
  {
    id: "which-is-stronger-motion-ad",
    title: "Which Is Stronger",
    eyebrow: "9:16 / MOTION AD",
    category: "High-End Motion Ad",
    description:
      "High-end vertical motion ad with a sharp concept, premium visual rhythm and a clear hook-driven structure.",
    videoSrc:
      "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779074832/SP_WhichIsStronger_A1_20250910_AIR_EN_Vid_1080x1920_16s_l003kd.mp4",
    tags: ["Motion Ad", "High-End", "9:16"],
  },
  {
    id: "the-guest-rush-3d-ad",
    title: "The Guest Rush",
    eyebrow: "9:16 / HIGH-END AD",
    category: "3D Camera Motion Ad",
    description:
      "High-end vertical ad built with 3D camera movement, sharp pacing and a premium motion finish for mobile-first delivery.",
    videoSrc:
      "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779379990/DM_TheGuestRush_V1_30s_21_05_Demeter_EN_Vid_1080x1920_nohir4.mp4",
    tags: ["High-End Ad", "3D Camera", "Motion"],
  },
  {
    id: "semana-santa-motion-ad",
    title: "Seasonal Motion Campaign",
    eyebrow: "9:16 / SEASONAL AD",
    category: "Conceptual Campaign Motion",
    description:
      "Seasonal vertical motion ad shaped around mood, graphic rhythm and polished campaign delivery.",
    videoSrc:
      "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779074796/Motion_SemanaSanta_zu22d8.mp4",
    tags: ["Seasonal", "Motion", "Campaign"],
  },
]

const workflowSteps = [
  {
    number: "01",
    title: "Brief & Scope",
    description:
      "Brief, references, platform, format, audience, timing and key message are defined before the edit starts.",
  },
  {
    number: "02",
    title: "First Edit",
    description:
      "Hook, pacing, cutdowns and message order are shaped into the first reviewable cut.",
  },
  {
    number: "03",
    title: "Motion Pass",
    description:
      "Motion graphics, type, UI beats, VFX cleanup and sound rhythm are tightened.",
  },
  {
    number: "04",
    title: "Revisions",
    description:
      "Feedback is applied, alternate versions are prepared and final details are checked.",
  },
  {
    number: "05",
    title: "Delivery",
    description:
      "Platform-ready exports are delivered with the required formats, specs and placements.",
  },
]

const workflowStepOutlines = [
  {
    gradient:
      "linear-gradient(135deg, rgba(214,199,161,0.9), rgba(214,199,161,0.34) 48%, rgba(92,102,122,0.24))",
    hairline:
      "linear-gradient(90deg, rgba(214,199,161,0.72), rgba(214,199,161,0.24), transparent)",
    sideBorder: "rgba(214,199,161,0.18)",
    glow: "rgba(214,199,161,0.14)",
    panelBorder: "rgba(214,199,161,0.18)",
    ambient:
      "radial-gradient(circle at 68% 42%, rgba(214,199,161,0.13), transparent 44%), radial-gradient(circle at 20% 84%, rgba(214,199,161,0.055), transparent 36%)",
    progress:
      "linear-gradient(90deg, rgba(214,199,161,0.95), rgba(214,199,161,0.56))",
    marker: "#D6C7A1",
  },
  {
    gradient:
      "linear-gradient(135deg, rgba(214,199,161,0.86), rgba(109,106,144,0.42) 54%, rgba(92,102,122,0.24))",
    hairline:
      "linear-gradient(90deg, rgba(214,199,161,0.62), rgba(109,106,144,0.36), transparent)",
    sideBorder: "rgba(109,106,144,0.18)",
    glow: "rgba(109,106,144,0.14)",
    panelBorder: "rgba(109,106,144,0.18)",
    ambient:
      "radial-gradient(circle at 68% 42%, rgba(109,106,144,0.14), transparent 44%), radial-gradient(circle at 22% 84%, rgba(214,199,161,0.05), transparent 36%)",
    progress:
      "linear-gradient(90deg, rgba(214,199,161,0.9), rgba(109,106,144,0.66))",
    marker: "#6D6A90",
  },
  {
    gradient:
      "linear-gradient(135deg, rgba(214,199,161,0.8), rgba(109,106,144,0.38) 38%, rgba(68,49,95,0.42) 74%, rgba(92,102,122,0.22))",
    hairline:
      "linear-gradient(90deg, rgba(214,199,161,0.58), rgba(68,49,95,0.36), transparent)",
    sideBorder: "rgba(68,49,95,0.16)",
    glow: "rgba(68,49,95,0.12)",
    panelBorder: "rgba(68,49,95,0.16)",
    ambient:
      "radial-gradient(circle at 68% 42%, rgba(68,49,95,0.12), transparent 44%), radial-gradient(circle at 22% 84%, rgba(109,106,144,0.06), transparent 36%)",
    progress:
      "linear-gradient(90deg, rgba(214,199,161,0.86), rgba(68,49,95,0.68))",
    marker: "#6D5A86",
  },
  {
    gradient:
      "linear-gradient(135deg, rgba(214,199,161,0.72), rgba(68,49,95,0.46) 52%, rgba(184,138,59,0.28) 88%)",
    hairline:
      "linear-gradient(90deg, rgba(214,199,161,0.54), rgba(68,49,95,0.42), rgba(184,138,59,0.18), transparent)",
    sideBorder: "rgba(68,49,95,0.18)",
    glow: "rgba(68,49,95,0.13)",
    panelBorder: "rgba(68,49,95,0.18)",
    ambient:
      "radial-gradient(circle at 68% 42%, rgba(68,49,95,0.13), transparent 44%), radial-gradient(circle at 22% 84%, rgba(184,138,59,0.045), transparent 36%)",
    progress:
      "linear-gradient(90deg, rgba(214,199,161,0.78), rgba(68,49,95,0.7), rgba(184,138,59,0.36))",
    marker: "#6D5A86",
  },
  {
    gradient:
      "linear-gradient(135deg, rgba(214,199,161,0.66), rgba(68,49,95,0.44) 42%, rgba(184,138,59,0.44) 82%)",
    hairline:
      "linear-gradient(90deg, rgba(214,199,161,0.48), rgba(68,49,95,0.4), rgba(184,138,59,0.32), transparent)",
    sideBorder: "rgba(184,138,59,0.18)",
    glow: "rgba(184,138,59,0.1)",
    panelBorder: "rgba(184,138,59,0.18)",
    ambient:
      "radial-gradient(circle at 68% 42%, rgba(184,138,59,0.105), transparent 44%), radial-gradient(circle at 22% 84%, rgba(68,49,95,0.06), transparent 36%)",
    progress:
      "linear-gradient(90deg, rgba(214,199,161,0.72), rgba(68,49,95,0.62), rgba(184,138,59,0.58))",
    marker: "#B88A3B",
  },
]

const serviceAccentClasses = {
  Editing: {
    dot: "bg-[#D6C7A1] shadow-[0_0_14px_rgba(214,199,161,0.45)]",
    border: "hover:border-[#D6C7A1]/60",
  },
  "Motion Graphics": {
    dot: "bg-[#6D6A90] shadow-[0_0_14px_rgba(109,106,144,0.55)]",
    border: "hover:border-[#6D6A90]/70",
  },
  VFX: {
    dot: "bg-[#6D5A86] shadow-[0_0_14px_rgba(68,49,95,0.55)]",
    border: "hover:border-[#6D5A86]/60",
  },
  "Visual Storytelling": {
    dot: "bg-[#B88A3B] shadow-[0_0_14px_rgba(184,138,59,0.45)]",
    border: "hover:border-[#B88A3B]/55",
  },
}

const verticalAccentClasses = [
  {
    hairline: "from-[#D6C7A1]/46 via-white/10 to-transparent",
    label: "text-[#D6C7A1]/76",
    activeGlow: "rgba(214,199,161,0.085)",
  },
  {
    hairline: "from-[#6D6A90]/55 via-white/10 to-transparent",
    label: "text-[#A7AAB2]/70",
    activeGlow: "rgba(109,106,144,0.12)",
  },
  {
    hairline: "from-[#6D5A86]/50 via-white/10 to-transparent",
    label: "text-[#A996BC]/66",
    activeGlow: "rgba(68,49,95,0.10)",
  },
  {
    hairline: "from-[#B88A3B]/45 via-white/10 to-transparent",
    label: "text-[#D6C7A1]/66",
    activeGlow: "rgba(184,138,59,0.10)",
  },
]

const cardTiltPattern = [0, 0, 0, 0, 0]
const cardYOffsetPattern = [0, 0, 0, 0, 0]
const cardXOffsetPattern = [0, 0, 0, 0, 0]

function getCardOffset(index) {
  return {
    rotate: cardTiltPattern[index % cardTiltPattern.length],
    x: cardXOffsetPattern[index % cardXOffsetPattern.length],
    y: cardYOffsetPattern[index % cardYOffsetPattern.length],
  }
}

const serviceAccentList = Object.values(serviceAccentClasses)

const siteCopy = {
  en: {
    nav: {
      menu: "Menu",
      items: [
        { href: "#work", label: "Work" },
        { href: "#about", label: "About" },
        { href: "#process", label: "Process" },
        { href: "#contact", label: "Contact" },
      ],
    },
    hero: {
      role: "Video Editor & Motion Graphics Artist",
      headline: {
        services: ["Editing", "Motion Graphics"],
        final: "Visual Storytelling",
      },
      intro: {
        before: "Editing, motion graphics, VFX cleanup and",
        highlight: "visual storytelling",
        after:
          "for brands, agencies and creators who need paid social assets, short-form ads and polished post-production.",
        origin: "Hook first. Message clear. Export ready for the platform.",
        meaning:
          "Cuts, motion and cleanup stay tied to the brief so the piece is ready to ship.",
      },
      primaryCta: "View Selected Work",
      secondaryCta: "Contact",
      services,
    },
    media: {
      preview: "Preview coming soon",
    },
    annotations: {
      note: "Concept note",
      inspector: "inspector",
      root: "Root / source",
      context: "Context",
    },
    work: {
      eyebrow: "01 / Selected Work",
      title: "Selected edits with a clear problem, approach and output.",
      description:
        "Campaign edits, motion pieces and post-production work presented around what needed to be solved.",
      note:
        "Short context, no long case studies: what the piece needed, how I shaped it and what was delivered.",
      projects,
    },
    about: {
      eyebrow: "02 / About",
      title: "Editing has been part of how I see things since I was 13.",
      titleLines: ["Editing has been part", "of how I see things", "since I was 13."],
      note: "Started editing at 13",
      description:
        "I'm Gastón Acuña. What started as curiosity became the way I understand rhythm, attention and visual storytelling.",
      body: {
        before:
          "What I enjoy most is watching a piece",
        highlight: "take shape",
        after: ": rough footage, scattered ideas and loose references slowly turning into something clear, intentional and alive.",
        origin: "The part of the process that still feels addictive.",
        meaning:
          "Raw material becoming a piece with rhythm, intention and identity.",
      },
      paragraphs: [
        "I care a lot about retention, but not in a mechanical way. For me, keeping someone watching comes from rhythm, contrast, timing and a creative direction that gives the piece its own identity.",
        "That is the part I am most obsessed with: shaping edits that feel sharp, memorable and hard to scroll past.",
      ],
      details: [
        {
          id: "rhythm",
          title: "Rhythm",
          description: "Cuts, pauses and beats that make the piece move.",
        },
        {
          id: "retention",
          title: "Retention",
          description: "Keeping attention without making the edit feel forced.",
        },
        {
          id: "direction",
          title: "Direction",
          description: "A clear visual idea behind every transition, frame and motion pass.",
        },
      ],
    },
    vertical: {
      eyebrow: "01 / Selected Work",
      title: "Selected work built for pacing, motion and retention.",
      description:
        "Vertical edits, motion ads and short-form pieces shaped for mobile-first campaigns.",
      tagsLabel: "tags",
      specsLabel: "specs",
      goToLabel: "Go to",
      projects: verticalProjects,
    },
    process: {
      eyebrow: "03 / Process",
      title: "A simple project flow",
      description:
        "Every project changes by scope, but this is the usual path from brief to platform-ready exports.",
      hint: "The goal is to reduce friction: clear scope, useful review points and exports that match the platform.",
      note: "Scope first. Timing second. Delivery clear.",
      steps: workflowSteps,
    },
    contact: {
      eyebrow: "04 / Contact",
      title: "Let's talk about the next piece.",
      description:
        "Send a brief, references or assets. We define scope, timing and the best delivery format before the edit starts.",
      details: "Scope-based timing · Remote from Paraguay · Response within 24h",
      actionTitle: "Project start",
      actionNote: "A rough brief, a few references or an asset list is enough to start.",
      flow: ["Send brief", "Define scope", "Start edit"],
      email: "Email",
      copied: "Copied to clipboard",
      whatsapp: "WhatsApp",
      linkedin: "LinkedIn",
    },
    footer: {
      left: "© 2026 · Gastón Acuña",
      center: "Adobe Suite",
      right: "Asunción — Paraguay",
    },
  },
  es: {
    nav: {
      menu: "Menú",
      items: [
        { href: "#work", label: "Trabajos" },
        { href: "#about", label: "Sobre mí" },
        { href: "#process", label: "Proceso" },
        { href: "#contact", label: "Contacto" },
      ],
    },
    hero: {
      role: "Editor de Video & Motion Graphics Artist",
      headline: {
        services: ["Edición", "Motion Graphics"],
        final: "Narrativa Visual",
      },
      intro: {
        before: "Edición, motion graphics, VFX cleanup y",
        highlight: "narrativa visual",
        after:
          "para marcas, agencias y creadores que necesitan piezas paid social, short-form ads y postproducción lista para entregar.",
        origin: "Hook primero, mensaje claro y export listo para plataforma.",
        meaning:
          "Cortes, motion y cleanup siguen el brief para que la pieza salga lista para publicar.",
      },
      primaryCta: "Ver trabajos",
      secondaryCta: "Contacto",
      services: ["Edición", "Motion Graphics", "VFX", "Narrativa Visual"],
    },
    media: {
      preview: "Preview disponible pronto",
    },
    annotations: {
      note: "Nota de concepto",
      inspector: "inspector",
      root: "Raíz / origen",
      context: "Contexto",
    },
    work: {
      eyebrow: "01 / Trabajos Seleccionados",
      title: "Trabajos con problema, enfoque y entrega claros.",
      description:
        "Edits de campaña, motion pieces y postproducción explicados desde lo que había que resolver.",
      note:
        "Contexto corto, sin case studies largos: qué necesitaba la pieza, cómo la trabajé y qué se entregó.",
      projects: [
        {
          id: "brand-film",
          title: "Brand Film Cutdown",
          type: "Edición / Brand Film",
          description:
            "Edit de campaña trabajado para ordenar mensaje, ritmo y cutdowns más claros para paid social.",
          youtubeId: "TU_ID_DE_YOUTUBE_1",
          tags: ["Edición", "Cutdowns", "Brand"],
          metadata: [
            ["Problema", "Mucho material necesitaba un mensaje más claro"],
            ["Enfoque", "Rearmar ritmo alrededor de los beats fuertes"],
            ["Entrega", "Film 16:9 + cutdowns paid social"],
            ["Rol", "Editor"],
          ],
        },
        {
          id: "motion-campaign",
          title: "Paid Social Motion Ads",
          type: "Motion Graphics / Paid Social",
          description:
            "Piezas short-form de motion con hooks rápidos, tipografía animada y momentos de producto fáciles de leer.",
          youtubeId: "TU_ID_DE_YOUTUBE_2",
          tags: ["Motion Graphics", "Short-Form", "Ads"],
          metadata: [
            ["Problema", "Hacer que la oferta se entienda en segundos"],
            ["Enfoque", "Type, UI beats y jerarquía de motion limpia"],
            ["Entrega", "Assets 1:1 / 4:5 / 9:16"],
            ["Rol", "Motion + edición"],
          ],
        },
        {
          id: "vfx-polish",
          title: "VFX Cleanup & Post",
          type: "VFX Cleanup / Postproducción",
          description:
            "Soporte de postproducción para assets más limpios: cleanup, composición y exports listos para entrega.",
          youtubeId: "TU_ID_DE_YOUTUBE_3",
          tags: ["VFX Cleanup", "Post", "Compositing"],
          metadata: [
            ["Problema", "Los assets finales necesitaban más acabado"],
            ["Enfoque", "Cleanup, composición y polish final"],
            ["Entrega", "Exports de campaña listos para handoff"],
            ["Rol", "Postproducción"],
          ],
        },
      ],
    },
    about: {
      eyebrow: "02 / Sobre mí",
      title: "La edición forma parte de cómo veo las cosas desde los 13.",
      titleLines: ["La edición forma parte", "de cómo veo las cosas", "desde los 13."],
      note: "Editando desde los 13",
      description:
        "Soy Gastón Acuña. Lo que empezó como curiosidad terminó convirtiéndose en mi forma de entender ritmo, atención y narrativa visual.",
      body: {
        before:
          "Lo que más disfruto es ver cómo una pieza empieza a",
        highlight: "tomar forma",
        after: ": material crudo, ideas sueltas y referencias que de a poco se convierten en algo claro, intencional y vivo.",
        origin: "La parte del proceso que todavía se siente adictiva.",
        meaning:
          "Material crudo convirtiéndose en una pieza con ritmo, intención e identidad.",
      },
      paragraphs: [
        "Me obsesiona la retención, pero no como algo mecánico. Para mí, mantener a alguien mirando depende del ritmo, el contraste, el timing y una dirección creativa que haga que la pieza tenga identidad propia.",
        "Eso es lo que más me llena del proceso: construir edits que se sientan precisos, memorables y difíciles de scrollear.",
      ],
      details: [
        {
          id: "rhythm",
          title: "Ritmo",
          description: "Cortes, pausas y beats que hacen que la pieza avance.",
        },
        {
          id: "retention",
          title: "Retención",
          description: "Mantener la atención sin que el edit se sienta forzado.",
        },
        {
          id: "direction",
          title: "Dirección",
          description: "Una idea visual clara detrás de cada transición, frame y motion pass.",
        },
      ],
    },
    vertical: {
      eyebrow: "01 / Trabajos",
      title: "Trabajos pensados para ritmo, motion y retención.",
      description:
        "Edits verticales, motion ads y piezas short-form para campañas mobile-first.",
      tagsLabel: "tags",
      specsLabel: "specs",
      goToLabel: "Ir a",
      projects: [
        {
          id: "julian-motion-performance",
          title: "Performance Motion Cut",
          eyebrow: "9:16 / MOTION",
          category: "Motion de Alto Rendimiento",
          description:
            "Pieza vertical de motion de alto rendimiento, construida sobre ritmo preciso, jerarquía visual limpia y entrega mobile-first.",
          videoSrc:
            "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779289607/JulianPort_y8itgt.mp4",
          tags: ["Motion", "Performance", "9:16"],
        },
        {
          id: "authoritative-motion-ad",
          title: "Authority Motion Ad",
          eyebrow: "9:16 / MOTION AD",
          category: "Motion Ad High-End",
          description:
            "Motion ad high-end y autoritativo, con ritmo firme, jerarquía visual clara y sensación premium de postproducción.",
          videoSrc:
            "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779074774/MOTION_41_xsii0z.mp4",
          tags: ["Motion Ad", "Authority", "Premium"],
        },
        {
          id: "top-iphone",
          title: "Top iPhone",
          eyebrow: "9:16 / SHORT-FORM",
          category: "Social / Mobile Cutdown",
          description:
            "Edit 9:16 para feeds sociales, con ritmo, callouts y encuadre mobile-first.",
          videoSrc:
            "https://res.cloudinary.com/deqkn7ti2/video/upload/Top_Iphone_atljw6.mp4",
          tags: ["9:16", "Short-Form", "Social"],
        },
        {
          id: "gorilon-event",
          title: "Gorilón Event Cutdown",
          eyebrow: "9:16 / TIKTOK",
          category: "TikTok / Evento Creator",
          description:
            "Cutdown de TikTok de alto rendimiento para un evento creator, enfocado en ritmo, retención y entrega mobile-first.",
          videoSrc:
            "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779075003/Gorilon_portafolio_nu0nxj.mp4",
          tags: ["TikTok", "Creator Event", "Cutdown"],
        },
        {
          id: "which-is-stronger-motion-ad",
          title: "Which Is Stronger",
          eyebrow: "9:16 / MOTION AD",
          category: "Motion Ad High-End",
          description:
            "Motion ad vertical high-end con concepto claro, ritmo visual premium y estructura guiada por hook.",
          videoSrc:
            "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779074832/SP_WhichIsStronger_A1_20250910_AIR_EN_Vid_1080x1920_16s_l003kd.mp4",
          tags: ["Motion Ad", "High-End", "9:16"],
        },
        {
          id: "the-guest-rush-3d-ad",
          title: "The Guest Rush",
          eyebrow: "9:16 / HIGH-END AD",
          category: "Motion Ad con Cámara 3D",
          description:
            "Ad vertical high-end con movimiento de cámara 3D, ritmo preciso y un acabado motion premium para entrega mobile-first.",
          videoSrc:
            "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779379990/DM_TheGuestRush_V1_30s_21_05_Demeter_EN_Vid_1080x1920_nohir4.mp4",
          tags: ["High-End Ad", "3D Camera", "Motion"],
        },
        {
          id: "semana-santa-motion-ad",
          title: "Seasonal Motion Campaign",
          eyebrow: "9:16 / SEASONAL AD",
          category: "Motion Conceptual de Campaña",
          description:
            "Motion ad vertical de temporada, trabajado alrededor de mood, ritmo gráfico y entrega pulida para campaña.",
          videoSrc:
            "https://res.cloudinary.com/deqkn7ti2/video/upload/q_auto/f_auto/v1779074796/Motion_SemanaSanta_zu22d8.mp4",
          tags: ["Seasonal", "Motion", "Campaign"],
        },
      ],
    },
    process: {
      eyebrow: "03 / Proceso",
      title: "Un flujo simple de proyecto",
      description:
        "Cada proyecto cambia según el alcance, pero este suele ser el camino desde el brief hasta los exports finales.",
      hint: "La idea es reducir fricción: alcance claro, revisiones útiles y exports correctos para la plataforma.",
      note: "Primero alcance. Luego timing. Entrega clara.",
      steps: [
        {
          number: "01",
          title: "Brief y alcance",
          description:
            "Se definen brief, referencias, plataforma, formato, audiencia, timing y mensaje clave antes de empezar el corte.",
        },
        {
          number: "02",
          title: "Primer corte",
          description:
            "Se arma el hook, ritmo, cutdowns y orden del mensaje en un primer corte revisable.",
        },
        {
          number: "03",
          title: "Motion pass",
          description:
            "Se ajustan motion graphics, tipografía, UI beats, VFX cleanup y ritmo sonoro.",
        },
        {
          number: "04",
          title: "Revisión",
          description:
            "Se aplica feedback, se preparan versiones alternativas y se revisan detalles finales.",
        },
        {
          number: "05",
          title: "Entrega",
          description:
            "Se entregan exports listos para plataforma con formatos, specs y placements requeridos.",
        },
      ],
    },
    contact: {
      eyebrow: "04 / Contacto",
      title: "Hablemos de la próxima pieza.",
      description:
        "Mandame un brief, referencias o assets. Definimos alcance, timing y el mejor formato de entrega antes de empezar.",
      details: "Timing según alcance · Remoto desde Paraguay · Respuesta dentro de 24h",
      actionTitle: "Inicio de proyecto",
      actionNote: "Un brief rápido, algunas referencias o una lista de assets alcanza para empezar.",
      flow: ["Enviar brief", "Definir alcance", "Empezar edit"],
      email: "Email",
      copied: "Email copiado",
      whatsapp: "WhatsApp",
      linkedin: "LinkedIn",
    },
    footer: {
      left: "© 2026 · Gastón Acuña",
      center: "Adobe Suite",
      right: "Asunción — Paraguay",
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: easeOut },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: easeOut },
  },
}

const heroLineReveal = {
  hidden: { opacity: 0, y: 42 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.86, ease: easeOut },
  },
}

function aboutLineReveal(index = 0) {
  return {
    hidden: { opacity: 0, y: 34 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.78, ease: easeOut, delay: index * 0.035 },
    },
  }
}

const heroDotReveal = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
}

const lightFadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.56, ease: easeOut },
  },
}

function cardReveal(index = 0) {
  return {
    hidden: { opacity: 0, y: 20, rotate: 0 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.62, ease: easeOut, delay: index * 0.025 },
    },
  }
}

function chipReveal(index = 0) {
  const direction = index % 2 === 0 ? -1 : 1

  return {
    hidden: { opacity: 0, x: direction * 10, scale: 0.94 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.42, ease: easeOut, delay: index * 0.025 },
    },
  }
}

function useCompactLayout() {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)")
    const update = () => setIsCompact(query.matches)

    update()
    query.addEventListener("change", update)

    return () => query.removeEventListener("change", update)
  }, [])

  return isCompact
}

function useVerticalCarouselMode() {
  const [mode, setMode] = useState("desktop")

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 639px)")
    const tabletQuery = window.matchMedia("(max-width: 1023px)")

    const update = () => {
      if (mobileQuery.matches) {
        setMode("mobile")
      } else if (tabletQuery.matches) {
        setMode("tablet")
      } else {
        setMode("desktop")
      }
    }

    update()
    mobileQuery.addEventListener("change", update)
    tabletQuery.addEventListener("change", update)

    return () => {
      mobileQuery.removeEventListener("change", update)
      tabletQuery.removeEventListener("change", update)
    }
  }, [])

  return mode
}

function wrapIndex(index, length) {
  return ((index % length) + length) % length
}

function getCircularOffset(index, activeIndex, length) {
  let offset = index - activeIndex
  const half = Math.floor(length / 2)

  if (offset > half) offset -= length
  if (offset < -half) offset += length

  return offset
}

function getVerticalCarouselLayout(offset, mode) {
  const absOffset = Math.abs(offset)
  const direction = Math.sign(offset) || 1

  if (mode === "mobile") {
    return {
      isVisible: absOffset === 0,
      x: absOffset === 0 ? 0 : direction * 120,
      y: absOffset === 0 ? 0 : 42,
      scale: absOffset === 0 ? 1 : 0.82,
      opacity: absOffset === 0 ? 1 : 0,
      zIndex: absOffset === 0 ? 30 : 0,
    }
  }

  if (mode === "tablet") {
    if (absOffset === 0) {
      return { isVisible: true, x: 0, y: 0, scale: 1, opacity: 1, zIndex: 30 }
    }

    if (absOffset === 1) {
      return {
        isVisible: true,
        x: direction * 238,
        y: 58,
        scale: 0.76,
        opacity: 0.28,
        zIndex: 12,
      }
    }

    return {
      isVisible: false,
      x: direction * 360,
      y: 96,
      scale: 0.66,
      opacity: 0,
      zIndex: 0,
    }
  }

  if (absOffset === 0) {
    return { isVisible: true, x: 0, y: 0, scale: 1, opacity: 1, zIndex: 30 }
  }

  if (absOffset === 1) {
    return {
      isVisible: true,
      x: direction * 335,
      y: 58,
      scale: 0.82,
      opacity: 0.4,
      zIndex: 14,
    }
  }

  if (absOffset === 2) {
    return {
      isVisible: true,
      x: direction * 650,
      y: 108,
      scale: 0.68,
      opacity: 0.16,
      zIndex: 6,
    }
  }

  return {
    isVisible: false,
    x: direction * 760,
    y: 128,
    scale: 0.62,
    opacity: 0,
    zIndex: 0,
  }
}

function chunkText(text) {
  const words = text.split(" ")
  const chunks = []
  const size = Math.ceil(words.length / 4)

  for (let index = 0; index < words.length; index += size) {
    chunks.push(words.slice(index, index + size).join(" "))
  }

  return chunks
}

function BackgroundTexture() {
  const isCompact = useCompactLayout()
  return isCompact ? <MobileBackgroundTexture /> : <DesktopBackgroundTexture />
}

function MobileBackgroundTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#050505]">
      <div
        className="fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(214,199,161,0.07), transparent 34%), radial-gradient(circle at 100% 78%, rgba(184,138,59,0.035), transparent 32%), linear-gradient(180deg, #0B0C0E 0%, #07080A 44%, #050505 100%)",
        }}
      />
      <div className="fixed inset-0 film-noise-layer opacity-[0.009]" />
    </div>
  )
}

function DesktopBackgroundTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#050505]">
      <div
        className="fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 4%, rgba(214,199,161,0.075), transparent 34%), radial-gradient(circle at 88% 78%, rgba(184,138,59,0.035), transparent 32%), radial-gradient(circle at 12% 42%, rgba(52,57,68,0.18), transparent 36%), linear-gradient(180deg, #0B0C0E 0%, #07080A 42%, #050505 100%)",
        }}
      />
      <div className="fixed inset-0 film-noise-layer opacity-[0.012]" />
      <div
        className="fixed inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,232,227,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(232,232,227,0.08) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(214,199,161,0.035)_0%,transparent_46%)]" />
      <div className="fixed inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(5,5,5,0.18)_48%,rgba(5,5,5,0.52)_100%)]" />
    </div>
  )
}

function LanguageToggle({ language, onChange, className = "" }) {
  return (
    <div
      className={`font-ui items-center rounded-[999px_999px_999px_0.45rem] border border-white/10 bg-[#050505]/64 p-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#A7AAB2] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
      aria-label="Language selector"
    >
      {["en", "es"].map((locale) => {
        const isActive = language === locale

        return (
          <button
            key={locale}
            type="button"
            onClick={() => onChange(locale)}
            className={`rounded-[999px_999px_999px_0.35rem] px-2.5 py-1.5 transition-colors ${
              isActive
                ? "bg-[#E8E8E3] text-[#050505]"
                : "text-[#A7AAB2] hover:bg-white/[0.055] hover:text-[#E8E8E3]"
            }`}
            aria-pressed={isActive}
          >
            {locale.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

function SiteNav({ copy, language, onLanguageChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navItems = copy.nav.items

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)")
    const closeMobileMenu = (event) => {
      if (event.matches) setIsMenuOpen(false)
    }

    closeMobileMenu(desktopQuery)
    desktopQuery.addEventListener("change", closeMobileMenu)

    return () => desktopQuery.removeEventListener("change", closeMobileMenu)
  }, [])

  const scrollToSection = (event, href) => {
    event.preventDefault()

    const target = document.querySelector(href)
    if (!target) {
      setIsMenuOpen(false)
      return
    }

    setIsMenuOpen(false)

    requestAnimationFrame(() => {
      const headerOffset = 76
      const elementPosition = target.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      window.history.pushState(null, "", href)
    })
  }

  const handleLanguageChange = (locale) => {
    onLanguageChange(locale)
  }

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.07] bg-[#050505]/76 backdrop-blur-md"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: easeOut }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="#top"
          className="font-ui text-xs font-medium uppercase tracking-[0.28em] text-[#E8E8E3]"
        >
          Gastón Acuña
        </a>

        <div className="font-ui hidden items-center gap-4 text-[0.68rem] uppercase tracking-[0.16em] text-[#A7AAB2] lg:flex lg:gap-7 lg:text-[0.72rem]">
          {navItems.map((item) => (
            <a
              key={item.href}
              className="transition hover:text-[#D6C7A1]"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>

        <LanguageToggle
          language={language}
          onChange={onLanguageChange}
          className="hidden lg:inline-flex"
        />

        <button
          type="button"
          className="font-ui inline-flex items-center gap-2 rounded-[0.85rem_0.85rem_0.85rem_0.35rem] border border-white/10 bg-[#050505]/55 px-3 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-[#E8E8E3] lg:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
        >
          {copy.nav.menu}
          <span className="relative h-2.5 w-3">
            <span className="absolute left-0 top-0 h-px w-full bg-current" />
            <span className="absolute bottom-0 left-0 h-px w-full bg-current" />
          </span>
        </button>
      </nav>

      <motion.div
        id="mobile-nav"
        className="mx-5 mb-4 overflow-hidden rounded-[1rem] border border-white/10 bg-[#050505]/92 lg:hidden"
        initial={false}
        animate={
          isMenuOpen
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.24, ease: easeOut }}
      >
        <div className="font-ui grid gap-1 p-2 text-[0.72rem] uppercase tracking-[0.16em] text-[#A7AAB2]">
          {navItems.map((item) => (
            <a
              key={item.href}
              className="rounded-[0.75rem] px-3 py-2.5 transition hover:bg-white/[0.04] hover:text-[#E8E8E3]"
              href={item.href}
              onClick={(event) => scrollToSection(event, item.href)}
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2 border-t border-white/[0.06] px-1 pt-3">
            <LanguageToggle
              language={language}
              onChange={handleLanguageChange}
              className="flex w-full justify-center lg:hidden"
            />
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}

function HeroRule({ label }) {
  return (
    <motion.div
      className="mx-auto mb-7 mt-3 flex w-full max-w-[320px] items-center justify-center gap-3 sm:mb-8 sm:mt-4 sm:max-w-[720px] sm:gap-4"
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.58, delay: 0.04, ease: easeOut },
        },
      }}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/16 to-[#D6C7A1]/42" />
      <span className="max-w-[220px] text-center font-ui text-[0.56rem] uppercase leading-5 tracking-[0.16em] text-[#A7AAB2] sm:max-w-none sm:whitespace-nowrap sm:text-[0.68rem] sm:tracking-[0.3em]">
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-[#D6C7A1]/42 via-white/16 to-transparent" />
    </motion.div>
  )
}

function HeroHeadline({ headline }) {
  return (
    <motion.div className="relative mx-auto max-w-[23rem] text-center sm:max-w-[43rem] lg:max-w-[78rem]" variants={fadeUp}>
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[270px] w-[min(92vw,980px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(214,199,161,0.10),rgba(68,49,95,0.035)_42%,transparent_74%)]"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.05, delay: 0.3, ease: easeOut }}
      />
      <h1 className="font-display relative text-[clamp(2.35rem,10.8vw,3rem)] font-bold uppercase leading-[0.92] tracking-[-0.052em] text-[#E8E8E3] sm:text-[clamp(3.15rem,10vw,5.25rem)] sm:tracking-[-0.06em] lg:text-[clamp(4.8rem,6vw,6.25rem)] lg:leading-[0.91] lg:tracking-[-0.058em] 2xl:text-[clamp(5.2rem,6.1vw,6.7rem)]">
        <motion.span
          className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 sm:gap-x-3.5 sm:gap-y-2 lg:gap-x-5"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.14, delayChildren: 0.05 },
            },
          }}
        >
          {headline.services.map((item, index) => (
            <motion.span
              key={item}
              className="inline-flex items-center gap-x-2.5 overflow-visible sm:gap-x-3.5 lg:gap-x-5"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.045 },
                },
              }}
            >
              <span className="-mx-[0.035em] inline-block overflow-hidden px-[0.035em]">
                <motion.span
                  className="inline-block"
                  variants={heroLineReveal}
                >
                  {item}
                </motion.span>
              </span>

              {index < headline.services.length - 1 ? (
                <motion.span
                  className="h-2 w-2 rounded-full bg-[#D6C7A1] shadow-[0_0_14px_rgba(214,199,161,0.38)] sm:h-2.5 sm:w-2.5 sm:shadow-[0_0_18px_rgba(214,199,161,0.42)] lg:h-3 lg:w-3 lg:shadow-[0_0_20px_rgba(214,199,161,0.48)]"
                  variants={heroDotReveal}
                />
              ) : null}
            </motion.span>
          ))}
        </motion.span>

        <motion.span
          className="mx-auto mt-1.5 block overflow-visible sm:mt-2"
          variants={{
            hidden: {},
            visible: { transition: { delayChildren: 0.08 } },
          }}
        >
          <motion.span className="-mx-[0.035em] block px-[0.035em]" variants={heroLineReveal}>
            {headline.final}
          </motion.span>
        </motion.span>
      </h1>
    </motion.div>
  )
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getNodeText(node) {
  if (typeof node === "string" || typeof node === "number") {
    return String(node).replace(/\s+/g, " ").trim()
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join(" ").replace(/\s+/g, " ").trim()
  }

  return ""
}

function AnnotationPortal({ anchorRef, isOpen, term, origin, meaning, labels }) {
  const shouldReduceMotion = useReducedMotion()
  const [position, setPosition] = useState({
    caretX: 24,
    left: 16,
    placement: "bottom",
    top: 0,
    width: 320,
  })

  useEffect(() => {
    if (!isOpen) return undefined

    let frame = 0

    function updatePosition() {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const anchor = anchorRef.current
        if (!anchor) return

        const rect = anchor.getBoundingClientRect()
        const width = Math.min(360, window.innerWidth - 24)
        const estimatedHeight = 230
        const gap = window.innerWidth < 640 ? 10 : 14
        const center = rect.left + rect.width / 2
        const edgePadding = window.innerWidth < 640 ? 12 : 18
        const left = clampNumber(
          center - width / 2,
          edgePadding,
          window.innerWidth - width - edgePadding,
        )
        const roomBelow = window.innerHeight - rect.bottom
        const roomAbove = rect.top
        const placement =
          roomBelow >= estimatedHeight + 26 || roomBelow >= roomAbove
            ? "bottom"
            : "top"
        const rawTop =
          placement === "bottom"
            ? rect.bottom + gap
            : rect.top - estimatedHeight - gap
        const top = clampNumber(
          rawTop,
          edgePadding,
          window.innerHeight - estimatedHeight - edgePadding,
        )

        setPosition({
          caretX: clampNumber(center - left, 22, width - 22),
          left,
          placement,
          top,
          width,
        })
      })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [anchorRef, isOpen])

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="pointer-events-none fixed z-[2147483000]"
          style={{
            left: position.left,
            top: position.top,
            width: position.width,
          }}
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : {
                  opacity: 0,
                  scale: 0.975,
                  y: position.placement === "bottom" ? -8 : 8,
                }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: 0.985,
            y: position.placement === "bottom" ? -4 : 4,
          }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: easeOut }}
        >
          <span
            className={`absolute h-3 w-3 border-l border-t border-[#D6C7A1]/28 bg-[#050505] ${
              position.placement === "bottom" ? "-top-1.5" : "-bottom-1.5"
            }`}
            style={{
              left: position.caretX - 6,
              transform:
                position.placement === "bottom"
                  ? "rotate(45deg)"
                  : "rotate(225deg)",
            }}
          />

          <div className="relative overflow-hidden rounded-[1.05rem] border border-[#D6C7A1]/14 bg-[#050505] text-left shadow-[0_26px_70px_rgba(0,0,0,0.62),0_0_0_1px_rgba(214,199,161,0.10)]">
            <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(184,189,199,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(92,102,122,0.18)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D6C7A1]/48 to-transparent" />
            <div className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-[#B88A3B]/36 via-white/10 to-transparent" />

            <motion.div
              className="relative border-b border-white/[0.075] px-4 py-3.5"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: easeOut }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B88A3B]" />
                  <p className="font-ui text-[0.58rem] uppercase tracking-[0.22em] text-[#D6C7A1]/78">
                    {labels.note}
                  </p>
                </div>
                <p className="font-ui text-[0.54rem] uppercase tracking-[0.18em] text-white/34">
                  {labels.inspector}
                </p>
              </div>
              <h3 className="font-display mt-2.5 text-[1.04rem] font-semibold uppercase leading-tight tracking-[0.005em] text-[#E8E8E3]">
                {term}
              </h3>
            </motion.div>

            <motion.div
              className="relative grid gap-3.5 px-4 py-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    delayChildren: shouldReduceMotion ? 0 : 0.06,
                    staggerChildren: shouldReduceMotion ? 0 : 0.055,
                  },
                },
              }}
            >
              {origin ? (
                <motion.div
                  className="grid gap-1.5"
                  variants={{
                    hidden: { opacity: 0, y: 5 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.22, ease: easeOut }}
                >
                  <p className="font-ui text-[0.56rem] uppercase tracking-[0.2em] text-white/38">
                    {labels.root}
                  </p>
                  <p className="text-[0.78rem] leading-5 text-[#D8DCE6]">
                    {origin}
                  </p>
                </motion.div>
              ) : null}

              {meaning ? (
                <motion.div
                  className="grid gap-1.5"
                  variants={{
                    hidden: { opacity: 0, y: 5 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.22, ease: easeOut }}
                >
                  <p className="font-ui text-[0.56rem] uppercase tracking-[0.2em] text-white/38">
                    {labels.context}
                  </p>
                  <p className="text-[0.78rem] leading-5 text-[#A7AAB2]">
                    {meaning}
                  </p>
                </motion.div>
              ) : null}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function EditorialHighlight({
  children,
  origin,
  meaning,
  labels = siteCopy.en.annotations,
}) {
  const shouldReduceMotion = useReducedMotion()
  const anchorRef = useRef(null)
  const pointerTypeRef = useRef("keyboard")
  const [isOpen, setIsOpen] = useState(false)
  const term = getNodeText(children)

  useEffect(() => {
    if (!isOpen) return undefined

    function handlePointerDown(event) {
      if (!anchorRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <motion.button
        ref={anchorRef}
        type="button"
        className="font-editorial relative inline-flex cursor-help appearance-none overflow-hidden rounded-[0.52rem_0.35rem_0.52rem_0.35rem] border-0 bg-transparent px-1.5 py-0 align-baseline italic text-inherit outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#6D6A90]/60 sm:rounded-[0.65rem_0.42rem_0.65rem_0.42rem] sm:px-2.5 sm:py-0.5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.75 }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setIsOpen(true)
        }}
        onPointerDown={(event) => {
          pointerTypeRef.current = event.pointerType || "keyboard"
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setIsOpen(false)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={(event) => {
          event.stopPropagation()
          if (pointerTypeRef.current === "mouse") return
          setIsOpen((value) => !value)
        }}
      >
        <motion.span
          className="absolute inset-0 rounded-[0.52rem_0.35rem_0.52rem_0.35rem] bg-[linear-gradient(105deg,rgba(26,29,35,0.78),rgba(92,102,122,0.24),rgba(214,199,161,0.18))] shadow-[inset_0_0_0_1px_rgba(214,199,161,0.16),0_8px_18px_rgba(0,0,0,0.20)] sm:rounded-[0.65rem_0.42rem_0.65rem_0.42rem] sm:bg-[linear-gradient(105deg,rgba(26,29,35,0.86),rgba(92,102,122,0.30),rgba(214,199,161,0.22))] sm:shadow-[inset_0_0_0_1px_rgba(214,199,161,0.18),0_10px_24px_rgba(0,0,0,0.22)]"
          variants={{
            hidden: { scaleX: 0, opacity: 0.2 },
            visible: {
              scaleX: 1,
              opacity: 1,
              transition: shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.7, ease: easeOut },
            },
          }}
          style={{ originX: 0 }}
        />
        <motion.span
          className="absolute inset-0 rounded-[0.52rem_0.35rem_0.52rem_0.35rem] bg-[linear-gradient(105deg,rgba(214,199,161,0.24),rgba(92,102,122,0.28),rgba(68,49,95,0.12))] shadow-[inset_0_0_0_1px_rgba(214,199,161,0.22),0_0_16px_rgba(214,199,161,0.10)] sm:rounded-[0.65rem_0.42rem_0.65rem_0.42rem] sm:bg-[linear-gradient(105deg,rgba(214,199,161,0.28),rgba(92,102,122,0.34),rgba(68,49,95,0.16))] sm:shadow-[inset_0_0_0_1px_rgba(214,199,161,0.25),0_0_22px_rgba(214,199,161,0.12)]"
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: easeOut }}
        />
        <motion.span
          className="relative z-10 font-medium text-white"
          variants={{
            hidden: { opacity: 0.64, y: 3 },
            visible: {
              opacity: 1,
              y: 0,
              transition: shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.32, delay: 0.08, ease: easeOut },
            },
          }}
        >
          {children}
        </motion.span>
      </motion.button>

      <AnnotationPortal
        anchorRef={anchorRef}
        isOpen={isOpen}
        term={term}
        origin={origin}
        meaning={meaning}
        labels={labels}
      />
    </>
  )
}

function KeyframeDiamond({ className = "", color = "bg-[#D6C7A1]", style }) {
  return (
    <span
      className={["absolute h-1.5 w-1.5 rotate-45 rounded-[1px]", color, className].join(" ")}
      style={style}
    />
  )
}

function FloatingPostElement({ mouseX, mouseY, enableMouse = false, isActive = true }) {
  const shouldReduceMotion = useReducedMotion()
  const enableIdle = false
  const fallbackX = useMotionValue(0)
  const fallbackY = useMotionValue(0)
  const sourceX = mouseX || fallbackX
  const sourceY = mouseY || fallbackY
  const rightMouseX = useTransform(sourceX, [-1, 1], enableMouse ? [-8, 8] : [0, 0])
  const rightMouseY = useTransform(sourceY, [-1, 1], enableMouse ? [-7, 7] : [0, 0])
  const rightMouseRotate = useTransform(sourceX, [-1, 1], enableMouse ? [-1.2, 1.2] : [0, 0])
  const leftMouseX = useTransform(sourceX, [-1, 1], enableMouse ? [5, -5] : [0, 0])
  const leftMouseY = useTransform(sourceY, [-1, 1], enableMouse ? [4, -4] : [0, 0])
  const leftMouseRotate = useTransform(sourceX, [-1, 1], enableMouse ? [0.8, -0.8] : [0, 0])
  const cubeMouseX = useTransform(sourceX, [-1, 1], enableMouse ? [-12, 12] : [0, 0])
  const cubeMouseY = useTransform(sourceY, [-1, 1], enableMouse ? [-10, 10] : [0, 0])
  const cubeMouseRotate = useTransform(sourceX, [-1, 1], enableMouse ? [-2.5, 2.5] : [0, 0])
  const cubeAvoidRawX = useMotionValue(0)
  const cubeAvoidRawY = useMotionValue(0)
  const cubeAvoidRawRotate = useMotionValue(0)
  const cubeAvoidX = useSpring(cubeAvoidRawX, { stiffness: 150, damping: 24, mass: 0.75 })
  const cubeAvoidY = useSpring(cubeAvoidRawY, { stiffness: 150, damping: 24, mass: 0.75 })
  const cubeAvoidRotate = useSpring(cubeAvoidRawRotate, { stiffness: 150, damping: 24, mass: 0.75 })
  const cubeX = useTransform([cubeMouseX, cubeAvoidX], ([base, avoid]) => base + avoid)
  const cubeY = useTransform([cubeMouseY, cubeAvoidY], ([base, avoid]) => base + avoid)
  const cubeRotate = useTransform(
    [cubeMouseRotate, cubeAvoidRotate],
    ([base, avoid]) => base + avoid,
  )
  const transformPanelX = useTransform(sourceX, [-1, 1], enableMouse ? [6, -6] : [0, 0])
  const transformPanelY = useTransform(sourceY, [-1, 1], enableMouse ? [5, -5] : [0, 0])
  const transformPanelRotate = useTransform(sourceX, [-1, 1], enableMouse ? [1.1, -1.1] : [0, 0])

  function handleCubePointerMove(event) {
    if (!enableMouse || shouldReduceMotion || event.pointerType !== "mouse") return

    const rect = event.currentTarget.getBoundingClientRect()
    const relativeX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const relativeY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)

    cubeAvoidRawX.set(clampNumber(-relativeX * 10, -10, 10))
    cubeAvoidRawY.set(clampNumber(-relativeY * 8, -8, 8))
    cubeAvoidRawRotate.set(clampNumber(-relativeX * 1.6, -1.6, 1.6))
  }

  function handleCubePointerLeave() {
    cubeAvoidRawX.set(0)
    cubeAvoidRawY.set(0)
    cubeAvoidRawRotate.set(0)
  }

  const timelineRows = [
    { width: 78, label: "01", color: "from-[#D6C7A1]/82 to-[#343944]/55", switchColor: "bg-[#D6C7A1]/72", keyframes: [{ left: "34%", color: "bg-[#D6C7A1]" }] },
    { width: 62, label: "02", color: "from-[#343944]/86 to-[#6D6A90]/42", switchColor: "bg-[#6D6A90]/55", keyframes: [{ left: "54%", color: "bg-[#6D6A90]" }] },
    { width: 86, label: "03", color: "from-[#D6C7A1]/72 to-[#6D5A86]/40", switchColor: "bg-[#6D5A86]/58", keyframes: [{ left: "42%", color: "bg-[#6D5A86]" }, { left: "74%", color: "bg-[#D6C7A1]" }] },
    { width: 48, label: "04", color: "from-[#D6C7A1]/58 to-[#D6C7A1]/28", switchColor: "bg-[#D6C7A1]/62", keyframes: [{ left: "67%", color: "bg-[#D6C7A1]" }] },
  ]
  const layerRows = [
    { width: 82, accent: "bg-[#D6C7A1]/72", keyClass: "left-[34%] bg-[#D6C7A1]", label: "01" },
    { width: 64, accent: "bg-[#343944]/85", keyClass: "left-[52%] bg-[#6D6A90]", label: "02" },
    { width: 72, accent: "bg-[#D6C7A1]/70", keyClass: "left-[64%] bg-[#D6C7A1]", label: "03" },
    { width: 56, accent: "bg-[#6D5A86]/62", keyClass: "left-[76%] bg-[#6D5A86]", label: "04" },
  ]
  const portraitTimeline = [
    { left: "28%", color: "bg-[#D6C7A1]" },
    { left: "56%", color: "bg-[#6D5A86]" },
    { left: "78%", color: "bg-[#D6C7A1]" },
  ]
  const assetEntrance = (delay, opacity = 1, y = 26) =>
    shouldReduceMotion
      ? {
          initial: false,
          animate: { opacity: isActive ? opacity : opacity * 0.65 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y, scale: 0.96 },
          animate: { opacity: isActive ? opacity : opacity * 0.65, y: 0, scale: 1 },
          transition: { duration: 0.78, delay, ease: easeOut },
        }

  return (
    <>
      <motion.div
        className="absolute right-[-68px] top-[20%] z-0 hidden xl:block 2xl:right-[-38px] [@media(min-width:1800px)]:right-4"
        {...assetEntrance(0.24, 0.78, 30)}
      >
        <motion.div
          className="pointer-events-auto w-[222px] [@media(min-width:1800px)]:w-[246px]"
          style={{ x: rightMouseX, y: rightMouseY, rotate: rightMouseRotate }}
          whileHover={
            shouldReduceMotion
              ? {}
              : {
                  opacity: 1,
                }
          }
          transition={quickHover}
        >
        <motion.div
          className="rotate-[-4deg]"
          animate={enableIdle ? { y: [-14, 14, -14], rotate: [-5, -2.2, -5] } : {}}
          transition={{ duration: 6.8, ease: "easeInOut", repeat: Infinity }}
        >
        <div className="relative overflow-hidden rounded-[1rem] border border-[#3B465C]/45 bg-[#050505]/90 shadow-[0_26px_78px_rgba(0,0,0,0.42),0_0_54px_rgba(68,49,95,0.08)] transition-colors hover:border-[#6D5A86]/42">
          <div className="font-ui flex items-center border-b border-white/[0.075] bg-[#111315]/78 text-[0.56rem] uppercase tracking-[0.18em] text-[#A7AAB2]/70">
            <div className="flex items-center gap-1.5 border-r border-white/[0.07] px-3 py-2.5">
              <span className="h-1.5 w-1.5 rounded-[2px] bg-[#D6C7A1]/72" />
              <span className="h-1.5 w-1.5 rounded-[2px] bg-[#6D5A86]/58" />
              <span className="h-1.5 w-1.5 rounded-[2px] bg-[#D6C7A1]/75" />
            </div>
              <span className="px-3 text-[#E8E8E3]/72">GRAPH EDITOR</span>
            <span className="ml-auto border-l border-white/[0.07] px-3 py-2.5 text-white/28">COMP / 01</span>
          </div>

          <div className="p-4">
            <div className="relative mb-4 h-28 overflow-hidden rounded-xl border border-white/[0.07] bg-[#111315]/72">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(184,189,199,0.052)_1px,transparent_1px),linear-gradient(90deg,rgba(184,189,199,0.04)_1px,transparent_1px)] bg-[length:18px_18px]" />
              <div className="absolute left-4 right-4 top-1/2 h-px bg-white/[0.08]" />
              <div className="absolute bottom-4 top-4 left-1/2 w-px bg-white/[0.07]" />
              <svg className="absolute inset-x-4 bottom-4 h-16 w-[calc(100%-2rem)]" viewBox="0 0 170 62" fill="none" aria-hidden="true">
                <path d="M3 50 C 24 49, 30 22, 52 26 S 77 56, 98 34 S 125 8, 166 14" stroke="rgba(109,106,144,0.62)" strokeWidth="1.25" />
                <rect x="49.8" y="23.8" width="4.4" height="4.4" rx="0.8" transform="rotate(45 52 26)" fill="rgba(214,199,161,0.62)" />
                <rect x="95.8" y="31.8" width="4.4" height="4.4" rx="0.8" transform="rotate(45 98 34)" fill="rgba(68,49,95,0.66)" />
                <rect x="123.8" y="9.8" width="4.4" height="4.4" rx="0.8" transform="rotate(45 126 12)" fill="rgba(214,199,161,0.66)" />
              </svg>
              <div className="font-ui absolute left-4 top-3 text-[0.5rem] uppercase tracking-[0.18em] text-white/30">speed graph</div>
            </div>

            <div className="relative rounded-xl border border-white/[0.06] bg-[#07080A]/56 px-3 py-3">
              <div className="absolute bottom-3 left-[58%] top-3 w-px bg-[#6D5A86]/48 shadow-[0_0_10px_rgba(68,49,95,0.22)]">
                <span className="absolute -top-1 left-1/2 h-2 w-3 -translate-x-1/2 rounded-[3px] bg-[#6D5A86]/58" />
              </div>
              <div className="font-ui mb-2 flex justify-between text-[0.5rem] uppercase tracking-[0.18em] text-white/25">
                <span>layers</span>
                <span>00:12</span>
              </div>
              <div className="space-y-2.5">
                {timelineRows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[12px_13px_1fr_18px] items-center gap-2">
                    <span className="h-2 w-2 rounded-[2px] border border-white/14" />
                    <span className={["h-3 w-3 rounded-[3px] border border-white/10", row.switchColor].join(" ")} />
                    <span className="relative h-2 rounded-sm bg-white/[0.055]">
                      <span className={["absolute inset-y-0 left-0 rounded-sm bg-gradient-to-r", row.color].join(" ")} style={{ width: row.width + "%" }} />
                      {row.keyframes.map((keyframe) => (
                        <KeyframeDiamond key={keyframe.left} className="top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(214,199,161,0.25)]" color={keyframe.color} style={{ left: keyframe.left }} />
                      ))}
                    </span>
                    <span className="font-ui text-[0.54rem] text-white/28">{row.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hidden"
        {...assetEntrance(0.38, 0.62, 24)}
      >
        <motion.div
          className="pointer-events-auto w-[192px]"
          style={{ x: leftMouseX, y: leftMouseY, rotate: leftMouseRotate }}
          whileHover={
            shouldReduceMotion
              ? {}
              : {
                  opacity: 0.88,
                }
          }
          transition={quickHover}
        >
        <motion.div
          className="rotate-[5deg]"
          animate={enableIdle ? { y: [12, -12, 12], rotate: [6, 3.2, 6] } : {}}
          transition={{ duration: 8.2, ease: "easeInOut", repeat: Infinity, delay: 0.45 }}
        >
        <div className="relative overflow-hidden rounded-[1rem] border border-[#3B465C]/34 bg-[#050505]/84 shadow-[0_24px_70px_rgba(0,0,0,0.36),0_0_34px_rgba(184,138,59,0.06)] transition-colors hover:border-[#B88A3B]/30">
          <div className="font-ui flex items-center justify-between border-b border-white/[0.06] bg-[#111315]/62 px-3 py-2 text-[0.55rem] uppercase tracking-[0.18em] text-[#A7AAB2]/62">
            <span>TIMELINE</span>
            <span className="text-[#D6C7A1]/70">KEYS</span>
          </div>
          <div className="relative p-3.5">
            <div className="absolute bottom-4 left-[48%] top-4 w-px bg-[#B88A3B]/34" />
            <div className="font-ui mb-3 flex justify-between text-[0.5rem] uppercase tracking-[0.18em] text-white/25">
              <span>LAYER / 03</span>
              <span>00:08</span>
            </div>
            <div className="space-y-3">
              {layerRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[12px_1fr_14px_14px] items-center gap-2">
                  <span className={["h-2.5 w-2.5 rounded-[3px]", row.accent].join(" ")} />
                  <span className="relative h-2 rounded-sm bg-white/[0.055]">
                    <span className="absolute inset-y-0 left-0 rounded-sm bg-white/14" style={{ width: row.width + "%" }} />
                    <KeyframeDiamond className={["top-1/2 -translate-y-1/2", row.keyClass].join(" ")} color="" />
                  </span>
                  <span className="h-2 w-2 rounded-[2px] border border-white/12" />
                  <span className="font-ui text-[0.5rem] text-white/24">{row.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute left-[2%] top-[18%] z-10 hidden lg:block xl:left-[4%] xl:top-[18%]"
        {...assetEntrance(0.52, 0.70, 22)}
      >
        <motion.div
          className="pointer-events-auto w-[148px] xl:w-[166px]"
          style={{ x: transformPanelX, y: transformPanelY, rotate: transformPanelRotate }}
          whileHover={shouldReduceMotion ? {} : { opacity: 0.92 }}
          transition={quickHover}
        >
        <motion.div
          className="rotate-[-4deg]"
          animate={enableIdle ? { y: [-8, 8, -8], rotate: [-4.6, -3.1, -4.6] } : {}}
          transition={{ duration: 8.8, ease: "easeInOut", repeat: Infinity, delay: 1.4 }}
        >
          <div className="relative overflow-hidden rounded-[1rem] border border-[#3B465C]/34 bg-[#050505]/86 shadow-[0_24px_68px_rgba(0,0,0,0.34),0_0_34px_rgba(109,106,144,0.07)] transition-colors hover:border-[#6D6A90]/34">
            <div className="font-ui flex items-center justify-between border-b border-white/[0.06] bg-[#111315]/68 px-2.5 py-2 text-[0.48rem] uppercase tracking-[0.15em] text-[#A7AAB2]/62">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-[2px] bg-[#6D6A90]/70" />
                <span className="h-1.5 w-1.5 rounded-[2px] bg-[#6D5A86]/46" />
              </span>
              <span>COMP / PORTRAIT</span>
            </div>

            <div className="p-2.5">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[0.8rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(26,29,33,0.92),rgba(9,12,18,0.96))]">
                <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(184,189,199,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(184,189,199,0.10)_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute inset-x-4 top-4 h-px bg-white/[0.10]" />
                <div className="absolute bottom-16 left-1/2 h-[58%] w-px -translate-x-1/2 bg-[#6D6A90]/18" />
                <div className="absolute left-[22%] top-[20%] h-[56%] w-px bg-white/[0.06]" />
                <div className="absolute right-[22%] top-[20%] h-[56%] w-px bg-white/[0.06]" />

                <div className="absolute left-1/2 top-[24%] h-9 w-9 -translate-x-1/2 rounded-full border border-[#D6C7A1]/18 bg-[#E8E8E3]/18 shadow-[0_0_22px_rgba(214,199,161,0.10)]" />
                <div className="absolute left-1/2 top-[43%] h-20 w-[62%] -translate-x-1/2 rounded-t-full border border-[#D6C7A1]/12 bg-[linear-gradient(180deg,rgba(109,106,144,0.20),rgba(245,245,242,0.08))]" />
                <div className="absolute left-1/2 top-[58%] h-16 w-[74%] -translate-x-1/2 rounded-[45%] bg-[#07080A]/60" />

                <div className="absolute bottom-6 left-3 right-3">
                  <div className="font-ui mb-1.5 flex items-center justify-between text-[0.42rem] uppercase tracking-[0.14em] text-white/26">
                    <span>timeline</span>
                    <span>9:16</span>
                  </div>
                  <div className="relative h-4">
                    <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.14]" />
                    <span className="absolute left-[56%] top-0 h-full w-px bg-[#6D5A86]/52" />
                    {portraitTimeline.map((keyframe) => (
                      <KeyframeDiamond
                        key={keyframe.left}
                        className="top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(214,199,161,0.22)]"
                        color={keyframe.color}
                        style={{ left: keyframe.left }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="font-ui mt-2 flex items-center justify-between text-[0.46rem] uppercase tracking-[0.14em] text-white/32">
                <span>Vertical / Cut</span>
                <span className="text-[#D6C7A1]/48">Subject / Frame</span>
              </div>
            </div>
          </div>
        </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="hidden"
        {...assetEntrance(0.66, 0.76, 28)}
      >
        <motion.div
          className="pointer-events-auto h-[112px] w-[112px] xl:h-[126px] xl:w-[126px]"
          style={{ x: cubeX, y: cubeY, rotate: cubeRotate }}
          onPointerMove={handleCubePointerMove}
          onPointerLeave={handleCubePointerLeave}
          whileHover={shouldReduceMotion ? {} : { opacity: 0.98 }}
          transition={quickHover}
        >
        <motion.div
          className="relative h-full w-full"
          animate={
            !enableIdle
              ? {}
              : {
                  y: [-9, 9, -9],
                  rotate: [-2.5, 2.5, -2.5],
                }
          }
          transition={{ duration: 9.2, ease: "easeInOut", repeat: Infinity, delay: 1.1 }}
        >
          <div className="font-ui absolute -left-4 -top-9 rounded-[0.55rem_0.55rem_0.55rem_0.24rem] border border-[#6D5A86]/28 bg-[#050505]/92 px-2.5 py-1.5 text-[0.5rem] uppercase tracking-[0.18em] text-[#D6C7A1]/78 shadow-[0_12px_34px_rgba(0,0,0,0.30),0_0_20px_rgba(68,49,95,0.08)]">
            3D Layer
          </div>
          <div className="absolute inset-0 rounded-[1rem] border border-[#6D5A86]/34 bg-[#050505]/42 shadow-[0_22px_72px_rgba(0,0,0,0.38),0_0_52px_rgba(68,49,95,0.12)] [transform:perspective(520px)_rotateX(58deg)_rotateZ(-36deg)]">
            <div className="absolute inset-[16px] border border-[#D6C7A1]/40 bg-[#6D5A86]/[0.035]" />
            <div className="absolute left-[16px] right-[16px] top-[50%] h-px bg-[#D6C7A1]/42" />
            <div className="absolute bottom-[16px] top-[16px] left-[50%] w-px bg-[#D6C7A1]/42" />
            <div className="absolute left-[16px] top-[16px] h-[calc(100%-32px)] w-[calc(100%-32px)] border border-[#6D5A86]/18 [transform:translate(10px,-10px)]" />
            <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-[3px] border border-[#D6C7A1]/65 bg-[#050505]" />
            <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-[3px] border border-[#D6C7A1]/65 bg-[#050505]" />
            <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-[3px] border border-[#D6C7A1]/65 bg-[#050505]" />
            <span className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-[3px] border border-[#D6C7A1]/65 bg-[#050505]" />
            <KeyframeDiamond className="left-[30%] top-[20%] shadow-[0_0_10px_rgba(68,49,95,0.32)]" color="bg-[#6D5A86]" />
            <KeyframeDiamond className="left-[68%] top-[62%] shadow-[0_0_10px_rgba(214,199,161,0.30)]" color="bg-[#D6C7A1]" />
          </div>
          <div className="font-ui absolute bottom-[-22px] right-[-18px] flex items-end gap-1.5 text-[0.46rem] uppercase tracking-[0.14em] text-white/42">
            <span className="h-8 w-px bg-[#6D5A86]/60" />
            <span className="h-px w-8 bg-[#D6C7A1]/60" />
            <span>Comp Space</span>
          </div>
        </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}

function ServiceChips({ services }) {
  return (
    <motion.div
      className="mx-auto mt-7 grid max-w-[21rem] grid-cols-2 justify-center gap-2.5 sm:mt-8 sm:flex sm:max-w-3xl sm:flex-wrap sm:gap-3"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.075, delayChildren: 0.06 } },
      }}
    >
      {services.map((service, index) => {
        const accent = serviceAccentList[index % serviceAccentList.length]

        return (
        <motion.span
          key={service}
          className={`font-ui inline-flex items-center justify-center gap-2 rounded-[999px_999px_999px_0.55rem] border border-[#3B465C]/70 bg-[#15171C]/88 px-3 py-2 text-center text-[0.64rem] uppercase tracking-[0.07em] text-[#A7AAB2] shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-colors sm:px-4 sm:text-[0.72rem] sm:tracking-[0.08em] sm:shadow-[0_12px_34px_rgba(0,0,0,0.22)] ${accent.border} hover:text-[#E8E8E3]`}
          variants={chipReveal(index)}
          whileHover={{ y: -3, scale: 1.022 }}
          transition={quickHover}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
          {service}
        </motion.span>
        )
      })}
    </motion.div>
  )
}

function ButtonLink({ href, children, variant = "primary", className = "", ...props }) {
  const isPrimary = variant === "primary"
  const hoverWash = isPrimary
    ? "bg-[linear-gradient(115deg,transparent,rgba(214,199,161,0.075)_34%,rgba(68,49,95,0.055)_64%,transparent)]"
    : "bg-[linear-gradient(115deg,transparent,rgba(92,102,122,0.14)_42%,rgba(109,106,144,0.075)_76%,transparent)]"
  const bottomHairline = isPrimary ? "via-[#D6C7A1]/24" : "via-[#6D6A90]/22"

  return (
    <motion.a
      href={href}
      className={`${
        isPrimary
          ? "font-ui group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-[1rem_1rem_1rem_0.42rem] border border-[#D6C7A1]/34 bg-[linear-gradient(135deg,#1A1D23_0%,#0E1013_52%,#050505_100%)] px-4 py-3.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#E8E8E3] shadow-[0_18px_38px_rgba(0,0,0,0.34),0_0_0_1px_rgba(214,199,161,0.10),inset_0_1px_0_rgba(255,255,255,0.14)] transition-colors hover:border-[#D6C7A1]/42 sm:w-auto sm:px-6 sm:text-[0.72rem] sm:tracking-[0.15em] sm:shadow-[0_22px_52px_rgba(0,0,0,0.42),0_0_0_1px_rgba(214,199,161,0.12),inset_0_1px_0_rgba(255,255,255,0.14)]"
          : "font-ui group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-[0.45rem_1rem_1rem_1rem] border border-[#5C667A]/72 bg-[linear-gradient(145deg,rgba(17,21,27,0.84),rgba(7,10,15,0.72))] px-4 py-3.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#E8E8E3] shadow-[inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-md transition-colors hover:border-[#B8A7FF]/55 hover:bg-[#15171C]/88 sm:w-auto sm:px-6 sm:text-[0.72rem] sm:tracking-[0.15em]"
      } ${className}`}
      whileHover={{ y: -4, scale: 1.012 }}
      whileTap={{ scale: 0.975 }}
      transition={quickHover}
      {...props}
    >
      <span className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${hoverWash}`} />
      <span className={`pointer-events-none absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent ${bottomHairline} to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />
      <span className="relative">{children}</span>
      <span className="relative translate-x-0 text-[#E8E8E3]/85 transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
    </motion.a>
  )
}

function CopyEmailButton({ label = "Email", copiedLabel = "Copied to clipboard", className = "" }) {
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef(null)

  useEffect(() => {
    return () => window.clearTimeout(copiedTimeoutRef.current)
  }, [])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(contact.email)
      window.clearTimeout(copiedTimeoutRef.current)
      setCopied(true)
      copiedTimeoutRef.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      className={`font-ui group relative z-20 inline-flex items-center justify-center gap-2 overflow-visible rounded-[1rem_1rem_1rem_0.42rem] border border-[#D6C7A1]/34 bg-[linear-gradient(135deg,#1A1D23_0%,#0E1013_52%,#050505_100%)] px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#E8E8E3] shadow-[0_22px_52px_rgba(0,0,0,0.42),0_0_0_1px_rgba(214,199,161,0.12),inset_0_1px_0_rgba(255,255,255,0.14)] transition-colors hover:border-[#D6C7A1]/42 ${className}`}
      whileHover={{ y: -4, scale: 1.012 }}
      whileTap={{ scale: 0.975 }}
      transition={quickHover}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] bg-[linear-gradient(115deg,transparent,rgba(214,199,161,0.075)_34%,rgba(68,49,95,0.055)_64%,transparent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#D6C7A1]/24 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <span>{label}</span>
      <span className="translate-x-0 text-[#E8E8E3]/85 transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
      <span
        className={`pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-[90] -translate-x-1/2 whitespace-nowrap rounded-xl border border-[#6D5A86]/35 bg-[#050505]/96 px-4 py-2 text-xs font-medium text-[#E8E8E3] shadow-[0_18px_45px_rgba(0,0,0,0.42),0_0_22px_rgba(68,49,95,0.10)] backdrop-blur-md transition duration-200 ${
          copied
            ? "translate-y-[-2px] opacity-100"
            : "opacity-0 group-hover:translate-y-[-2px] group-hover:opacity-100"
        }`}
        aria-live="polite"
      >
        {copied ? copiedLabel : contact.email}
      </span>
    </motion.button>
  )
}

function VideoPlaceholder({
  aspect = "video",
  title = "Preview",
  placeholderLabel = "Preview coming soon",
  frameClassName = "",
}) {
  const aspectClass = frameClassName || (aspect === "vertical" ? "aspect-[9/16]" : "aspect-video")
  const radiusClass =
    aspect === "vertical" ? "rounded-[1.25rem]" : "rounded-[1.45rem]"

  return (
    <div
      className={`relative flex ${aspectClass} items-center justify-center overflow-hidden ${radiusClass} border border-white/10 bg-[#07080A] px-6 text-center`}
    >
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184,189,199,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(184,189,199,0.07) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(109,106,144,0.30) 1px, transparent 1.15px), radial-gradient(circle at 72% 28%, rgba(184,138,59,0.24) 0.7px, transparent 0.95px)",
          backgroundSize: "23px 23px",
          WebkitMaskImage:
            "radial-gradient(circle at 65% 20%, black 0%, transparent 64%)",
          maskImage:
            "radial-gradient(circle at 65% 20%, black 0%, transparent 64%)",
        }}
      />

      <div className="relative z-10">
        <p className="font-ui text-xs uppercase tracking-[0.28em] text-[#D6C7A1]/80">
          {title}
        </p>
        <p className="mt-3 text-sm font-medium text-[#E8E8E3]">
          {placeholderLabel}
        </p>
      </div>
    </div>
  )
}

function YouTubeEmbed({
  id,
  title,
  aspect = "video",
  shouldLoad = true,
  loading = "lazy",
  placeholderLabel,
  frameClassName = "",
}) {
  const aspectClass = frameClassName || (aspect === "vertical" ? "aspect-[9/16]" : "aspect-video")
  const radiusClass =
    aspect === "vertical" ? "rounded-[1.25rem]" : "rounded-[1.45rem]"
  const isMissing = !id || id.startsWith("TU_ID")

  if (!shouldLoad || isMissing) {
    return <VideoPlaceholder aspect={aspect} title={title} placeholderLabel={placeholderLabel} frameClassName={frameClassName} />
  }

  return (
    <div
      className={`${aspectClass} overflow-hidden ${radiusClass} border border-white/10 bg-[#07080A] shadow-[0_24px_70px_rgba(0,0,0,0.34)]`}
    >
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
        title={title}
        loading={loading}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}

function getCloudinaryPublicVideoPath(src) {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes("/video/upload/")) {
    return null
  }

  const [, rest] = src.split("/video/upload/")
  const versionMatch = rest.match(/(v\d+\/.*)$/)

  return versionMatch ? versionMatch[1] : rest
}

function getOptimizedCloudinaryVideo(src, mode = "desktop") {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes("/video/upload/")) {
    return src
  }

  const [prefix] = src.split("/video/upload/")
  const publicPath = getCloudinaryPublicVideoPath(src)

  if (!publicPath) return src

  const transform =
    mode === "mobile"
      ? "f_mp4,q_auto:eco,w_540"
      : "f_mp4,q_auto,w_720"

  return `${prefix}/video/upload/${transform}/${publicPath}`
}

function getCloudinaryVideoPoster(src, mode = "desktop") {
  if (!src || !src.includes("res.cloudinary.com") || !src.includes("/video/upload/")) {
    return null
  }

  const [prefix] = src.split("/video/upload/")
  const publicPath = getCloudinaryPublicVideoPath(src)
  if (!publicPath) return null

  const posterPath = publicPath.replace(/\.(mp4|mov|webm)(\?.*)?$/i, ".jpg$2")
  const width = mode === "mobile" ? "w_360" : "w_540"

  return `${prefix}/video/upload/so_0,f_jpg,q_auto:eco,${width}/${posterPath}`
}

function VideoPosterPreview({
  src,
  title,
  aspect = "video",
  placeholderLabel,
  videoMode = "desktop",
}) {
  const aspectClass = aspect === "vertical" ? "aspect-[9/16]" : "aspect-video"
  const radiusClass =
    aspect === "vertical" ? "rounded-[1.25rem]" : "rounded-[1.45rem]"
  const posterSrc = getCloudinaryVideoPoster(src, videoMode)

  if (!posterSrc) {
    return <VideoPlaceholder aspect={aspect} title={title} placeholderLabel={placeholderLabel} />
  }

  return (
    <div
      className={`${aspectClass} overflow-hidden ${radiusClass} border border-white/10 bg-[#07080A] shadow-[0_18px_50px_rgba(0,0,0,0.28)]`}
    >
      <img
        src={posterSrc}
        alt={title}
        className="h-full w-full object-cover opacity-90"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

function CloudinaryVideo({
  src,
  title,
  aspect = "video",
  preload = "metadata",
  videoMode = "desktop",
  placeholderLabel,
  controls = true,
  isActive = true,
}) {
  const videoRef = useRef(null)
  const aspectClass = aspect === "vertical" ? "aspect-[9/16]" : "aspect-video"
  const radiusClass =
    aspect === "vertical" ? "rounded-[1.25rem]" : "rounded-[1.45rem]"
  const videoSrc = getOptimizedCloudinaryVideo(src, videoMode)
  const posterSrc = getCloudinaryVideoPoster(src, videoMode)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    if (!isActive) {
      video.pause()
      video.muted = true
      try {
        video.currentTime = 0
      } catch {
        // Some mobile browsers block currentTime changes before metadata loads.
      }
    } else {
      video.muted = false
    }

    return () => {
      video.pause()
      video.muted = true
      try {
        video.currentTime = 0
      } catch {
        // Keep cleanup quiet if the media element is already gone.
      }
    }
  }, [isActive, videoSrc])

  const handlePlay = (event) => {
    const currentVideo = event.currentTarget

    if (!isActive) {
      currentVideo.pause()
      currentVideo.muted = true
      return
    }

    currentVideo.muted = false
    document.querySelectorAll("video[data-vertical-carousel-video]").forEach((video) => {
      if (video === currentVideo) return
      video.pause()
      video.muted = true
      try {
        video.currentTime = 0
      } catch {
        // Ignore reset failures on unloaded media.
      }
    })
  }

  if (!src) {
    return <VideoPlaceholder aspect={aspect} title={title} placeholderLabel={placeholderLabel} />
  }

  return (
    <div
      className={`${aspectClass} overflow-hidden ${radiusClass} border border-white/10 bg-[#07080A] shadow-[0_24px_70px_rgba(0,0,0,0.34)]`}
    >
      <video
        ref={videoRef}
        key={videoSrc}
        className="h-full w-full object-cover"
        title={title}
        poster={posterSrc || undefined}
        controls={controls && isActive}
        muted={!isActive}
        playsInline
        preload={preload}
        data-vertical-carousel-video
        data-active={isActive ? "true" : "false"}
        onPlay={handlePlay}
      >
        <source src={videoSrc} type="video/mp4" />
        {videoSrc !== src ? <source src={src} type="video/mp4" /> : null}
      </video>
    </div>
  )
}

function ScrollRevealSection({
  id,
  children,
  className = "",
  spacingClass = "py-[92px] lg:py-[128px]",
}) {
  return (
    <motion.section
      id={id}
      className={`relative mx-auto max-w-7xl px-5 sm:px-8 ${spacingClass} ${className}`}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute left-5 top-7 hidden h-8 w-8 border-l border-t border-[#D6C7A1]/18 sm:block" />
      <div className="pointer-events-none absolute right-5 top-7 hidden h-8 w-8 border-r border-t border-[#5C667A]/22 sm:block" />
      {children}
    </motion.section>
  )
}

function SectionHeader({ eyebrow, title, description, align = "left" }) {
  const isCentered = align === "center"

  return (
    <div
      className={
        isCentered ? "relative mx-auto max-w-3xl text-center" : "relative max-w-3xl"
      }
    >
      {eyebrow ? (
        <div className={`mb-[18px] flex items-center gap-3 ${isCentered ? "justify-center" : ""}`}>
          <span className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-[#D6C7A1]/70" />
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.34em] text-[#D6C7A1]/78">
            {eyebrow}
          </p>
          <span className="h-px w-[54px] -rotate-2 bg-gradient-to-r from-[#5C667A]/46 to-transparent" />
        </div>
      ) : null}
      {eyebrow ? (
        <div className={`mb-4 hidden items-center gap-1.5 sm:flex ${isCentered ? "justify-center" : ""}`}>
          {Array.from({ length: 9 }).map((_, index) => (
            <span
              key={index}
              className={`block h-px ${index % 3 === 0 ? "w-5 bg-[#D6C7A1]/24" : "w-2 bg-[#5C667A]/28"}`}
            />
          ))}
        </div>
      ) : null}
      <h2 className="font-display text-3xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#E8E8E3] sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-[22px] text-base leading-8 text-[#A7AAB2] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}

function Hero({ copy }) {
  const shouldReduceMotion = useReducedMotion()
  const isCompact = useCompactLayout()
  const heroRef = useRef(null)
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)
  const mouseX = useSpring(rawMouseX, { stiffness: 85, damping: 26, mass: 0.7 })
  const mouseY = useSpring(rawMouseY, { stiffness: 85, damping: 26, mass: 0.7 })
  const enableHeroMouse = !shouldReduceMotion && !isCompact && isHeroVisible

  useEffect(() => {
    const node = heroRef.current
    if (!node || typeof IntersectionObserver === "undefined") return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.08 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function handleHeroPointerMove(event) {
    if (!enableHeroMouse || event.pointerType !== "mouse") return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2

    rawMouseX.set(clampNumber(x, -1, 1))
    rawMouseY.set(clampNumber(y, -1, 1))
  }

  function handleHeroPointerLeave() {
    rawMouseX.set(0)
    rawMouseY.set(0)
  }

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-5 pb-[76px] pt-[104px] text-center sm:px-8 sm:pb-[88px] sm:pt-[116px]"
      onPointerMove={handleHeroPointerMove}
      onPointerLeave={handleHeroPointerLeave}
    >
      <FloatingPostElement
        mouseX={mouseX}
        mouseY={mouseY}
        enableMouse={enableHeroMouse}
        isActive={isHeroVisible}
      />

      <motion.div
        className="relative z-10 w-full"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-[#D6C7A1]/86 sm:text-xs sm:tracking-[0.45em]"
          variants={fadeUp}
        >
          Gastón Acuña
        </motion.p>

        <HeroRule label={copy.hero.role} />
        <HeroHeadline headline={copy.hero.headline} />

        <motion.div
          className="mx-auto mt-[24px] h-px max-w-[18rem] bg-gradient-to-r from-transparent via-white/14 to-transparent sm:mt-[30px] sm:max-w-[34rem] sm:via-white/18"
          variants={fadeUp}
        />

        <motion.p
          className="mx-auto mt-[22px] max-w-[21.5rem] text-[0.95rem] leading-7 text-[#A7AAB2] sm:mt-[26px] sm:max-w-2xl sm:text-lg sm:leading-8"
          variants={fadeUp}
        >
          {copy.hero.intro.before}{" "}
          <EditorialHighlight
            origin={copy.hero.intro.origin}
            meaning={copy.hero.intro.meaning}
            labels={copy.annotations}
          >
            {copy.hero.intro.highlight}
          </EditorialHighlight>{" "}
          {copy.hero.intro.after}
        </motion.p>

        <motion.div variants={fadeUp}>
          <ServiceChips services={copy.hero.services} />
        </motion.div>

        <motion.div
          className="mx-auto mt-[34px] grid max-w-[21rem] grid-cols-2 gap-3 sm:mt-[38px] sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-[14px]"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
          }}
        >
          <ButtonLink href="#work" variants={fadeUp}>{copy.hero.primaryCta}</ButtonLink>
          <ButtonLink href="#contact" variant="secondary" variants={fadeUp}>
            {copy.hero.secondaryCta}
          </ButtonLink>
        </motion.div>

        <motion.div
          className="mx-auto mt-[54px] max-w-4xl"
          variants={fadeUp}
          whileHover={{ y: -5, scale: 1.012 }}
          transition={quickHover}
        >
          <div className="rounded-[1.8rem_1.3rem_1.8rem_1.3rem] border border-white/10 bg-[linear-gradient(145deg,rgba(26,29,33,0.78),rgba(7,10,15,0.74))] p-3 shadow-[0_34px_90px_rgba(0,0,0,0.42)] transition-colors hover:border-[#6D6A90]/42">
            <YouTubeEmbed
              id={showreel.youtubeId}
              title={showreel.title}
              placeholderLabel={copy.media.preview}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function AboutDetailVisual({ type }) {
  const markerPositions = {
    rhythm: ["18%", "46%", "74%"],
    retention: ["26%", "58%", "82%"],
    direction: ["14%", "50%", "88%"],
  }[type] || ["22%", "56%", "78%"]

  return (
    <div className="relative h-8 overflow-hidden rounded-[0.65rem] border border-white/[0.045] bg-[#050505]/34 px-3">
      <span className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-[#5C667A]/28" />
      <span className="absolute left-[18%] top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#D6C7A1]/18" style={{ width: "48%" }} />
      {markerPositions.map((left, index) => (
        <span
          key={left}
          className={`absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px] ${
            index === 0 ? "bg-[#D6C7A1]/70" : index === 1 ? "bg-[#B88A3B]/54" : "bg-[#A7AAB2]/42"
          }`}
          style={{ left }}
        />
      ))}
    </div>
  )
}

function AboutDecorLayer() {
  return null
}

function AboutSection({ copy }) {
  const { about } = copy

  return (
    <ScrollRevealSection id="about" spacingClass="py-[92px] sm:py-[135px]">
      <div className="relative grid gap-[42px] lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-[38px]">
        <AboutDecorLayer />
        <motion.div
          className="relative z-20 max-w-xl lg:pl-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="pointer-events-none absolute -left-3 -top-4 hidden h-12 w-12 border-l border-t border-[#D6C7A1]/16 sm:block" />

          <motion.p
            className="font-ui mb-[18px] flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-[#D6C7A1]/78"
            variants={lightFadeUp}
          >
            <span className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-[#D6C7A1]" />
            {about.eyebrow}
            <span className="h-px w-[54px] -rotate-2 bg-gradient-to-r from-[#D6C7A1]/70 to-transparent" />
          </motion.p>

          <motion.div
            className="font-ui mb-[20px] flex flex-wrap items-center gap-2 text-[0.66rem] uppercase tracking-[0.12em] text-[#A7AAB2]/72"
            variants={lightFadeUp}
          >
            <span className="rounded-full border border-[#D6C7A1]/22 bg-[#050505]/48 px-3 py-1.5 text-[#D6C7A1]/82">
              {about.note}
            </span>
          </motion.div>

          <motion.h2
            className="font-display text-[2.45rem] font-semibold leading-[0.95] tracking-[-0.07em] text-[#E8E8E3] sm:text-[4.1rem] lg:text-[4.55rem]"
            variants={staggerContainer}
          >
            {about.titleLines.map((line, index) => (
              <span
                key={line}
                className="block overflow-hidden pb-[0.04em]"
              >
                <motion.span
                  className={`block ${index === about.titleLines.length - 1 ? "text-[#D6C7A1]" : ""}`}
                  variants={aboutLineReveal(index)}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <motion.p
            className="mt-[26px] max-w-xl text-base leading-8 text-[#A7AAB2] sm:text-lg"
            variants={lightFadeUp}
          >
            {about.description}
          </motion.p>
        </motion.div>

        <motion.div
          className="relative z-20 overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(22,24,30,0.78),rgba(8,9,12,0.82))] p-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-[38px]"
          variants={fadeUp}
          transition={{ duration: 0.58, ease: easeOut }}
        >
          <div className="absolute left-0 top-8 h-24 w-px bg-gradient-to-b from-transparent via-[#B88A3B]/55 to-transparent" />
          <div className="hidden absolute right-[-90px] top-[-90px] h-56 w-56 rounded-full bg-[#D6C7A1]/[0.035] blur-[70px]" />

          <p className="relative text-lg leading-9 text-[#E8E8E3]">
            {about.body.before}{" "}
            <EditorialHighlight
              origin={about.body.origin}
              meaning={about.body.meaning}
              labels={copy.annotations}
            >
              {about.body.highlight}
            </EditorialHighlight>
            {about.body.after}
          </p>

          <div className="relative mt-[22px] grid gap-4 border-y border-white/[0.06] py-[22px]">
            {about.paragraphs.map((paragraph) => (
              <motion.p
                key={paragraph}
                className="max-w-3xl text-sm leading-7 text-[#A7AAB2] sm:text-[0.98rem] sm:leading-8"
                variants={fadeUp}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="relative mt-[24px] grid gap-[14px] sm:grid-cols-3"
            variants={staggerContainer}
          >
            {about.details.map((item, index) => {
              const accents = [
                { border: "border-[#D6C7A1]/24 hover:border-[#D6C7A1]/42", hairline: "from-[#D6C7A1]/46", dot: "bg-[#D6C7A1]", glow: "bg-[#D6C7A1]/[0.035]" },
                { border: "border-[#5C667A]/34 hover:border-[#D6C7A1]/32", hairline: "from-[#5C667A]/42", dot: "bg-[#A7AAB2]/70", glow: "bg-[#D6C7A1]/[0.025]" },
                { border: "border-[#B88A3B]/22 hover:border-[#B88A3B]/38", hairline: "from-[#B88A3B]/40", dot: "bg-[#B88A3B]/82", glow: "bg-[#B88A3B]/[0.03]" },
              ][index % 3]
              const offset = getCardOffset(index + 1)

              return (
              <div
                key={item.id}
                className="sm:motion-safe:[transform:translate3d(var(--card-x),var(--card-y),0)_rotate(var(--card-tilt))]"
                style={{
                  "--card-tilt": `${offset.rotate * 0.55}deg`,
                  "--card-x": `${offset.x}px`,
                  "--card-y": `${offset.y}px`,
                }}
              >
              <motion.div
                className={`group relative min-h-[150px] overflow-hidden rounded-[1rem] border bg-[#07080A]/66 p-[15px] transition-colors hover:bg-[#0E1013]/88 sm:min-h-[164px] ${accents.border}`}
                variants={cardReveal(index, 0.55)}
                whileHover={{ y: -2 }}
                transition={quickHover}
              >
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accents.hairline} via-white/12 to-transparent`} />
                <div className={`absolute right-[-26px] top-[-26px] h-20 w-20 rounded-full ${accents.glow} blur-2xl opacity-0 transition-opacity group-hover:opacity-100`} />

                <AboutDetailVisual type={item.id} />

                <span className="font-ui relative mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#E8E8E3]">
                  <span className={`h-1.5 w-1.5 rounded-full ${accents.dot}`} />
                  {item.title}
                </span>

                <p className="relative mt-3 text-xs leading-6 text-[#A7AAB2]">
                  {item.description}
                </p>
              </motion.div>
              </div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </ScrollRevealSection>
  )
}

function VerticalWorkCarousel({ copy }) {
  const shouldReduceMotion = useReducedMotion()
  const carouselMode = useVerticalCarouselMode()
  const carouselRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const verticalProjects = copy.vertical.projects
  const projectCount = verticalProjects.length
  const isMobileCarousel = carouselMode === "mobile"

  const pauseCarouselVideos = (reset = false) => {
    carouselRef.current
      ?.querySelectorAll("video[data-vertical-carousel-video]")
      .forEach((video) => {
        video.pause()
        video.muted = true
        if (reset) {
          try {
            video.currentTime = 0
          } catch {
            // Ignore reset failures on unloaded media.
          }
        }
      })
  }

  useEffect(() => {
    if (projectCount <= 0 || activeIndex < projectCount) return undefined
    const frame = window.requestAnimationFrame(() => setActiveIndex(0))
    return () => window.cancelAnimationFrame(frame)
  }, [activeIndex, projectCount])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      carouselRef.current
        ?.querySelectorAll("video[data-vertical-carousel-video]")
        .forEach((video) => {
          if (video.dataset.active === "true") return
          video.pause()
          video.muted = true
          try {
            video.currentTime = 0
          } catch {
            // Ignore reset failures on unloaded media.
          }
        })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [activeIndex, carouselMode, copy.vertical.projects])

  useEffect(() => {
    const node = carouselRef.current
    if (!node || typeof IntersectionObserver === "undefined") {
      return () => pauseCarouselVideos(true)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) pauseCarouselVideos(true)
      },
      { threshold: 0.08 },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      pauseCarouselVideos(true)
    }
  }, [])

  const goToSlide = (index) => {
    if (!projectCount) return
    setActiveIndex(wrapIndex(index, projectCount))
  }

  const stepSlide = (direction) => {
    if (!projectCount) return
    setActiveIndex((current) =>
      wrapIndex(current + direction, projectCount),
    )
  }

  const carouselDots = (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#D6C7A1]/12 bg-[#050505]/86 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      {verticalProjects.map((project, index) => (
        <button
          key={project.id}
          type="button"
          onClick={() => goToSlide(index)}
          className={`h-1.5 rounded-full transition-all ${
            index === activeIndex
              ? "w-8 bg-[#D6C7A1] shadow-[0_0_18px_rgba(214,199,161,0.36)]"
              : "w-1.5 bg-[#5C667A]/55 hover:bg-[#A7AAB2]/60"
          }`}
          aria-label={`${copy.vertical.goToLabel} ${project.title}`}
          aria-current={index === activeIndex ? "true" : undefined}
        />
      ))}
    </div>
  )

  if (!projectCount) return null

  return (
    <ScrollRevealSection
      id="work"
      className="overflow-visible"
      spacingClass="py-[92px] sm:py-[118px] lg:py-[124px]"
    >
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader
          eyebrow={copy.vertical.eyebrow}
          title={copy.vertical.title}
          description={copy.vertical.description}
          align="center"
        />
      </div>

      <div ref={carouselRef} className="relative mx-auto mt-16 max-w-6xl overflow-visible">
        <div className="relative h-[965px] overflow-visible sm:h-[980px]">
          <div className="pointer-events-none absolute left-1/2 top-20 hidden h-[620px] w-[min(92vw,880px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(13,16,19,0.72)_0%,rgba(13,16,19,0.38)_48%,transparent_74%)] sm:block" />
          <div className="pointer-events-none absolute left-1/2 top-36 hidden h-[430px] w-[min(84vw,720px)] -translate-x-1/2 rounded-full bg-[#D6C7A1]/[0.035] blur-[88px] sm:block" />
          <div className="pointer-events-none absolute left-1/2 top-[18rem] h-[1px] w-[min(78vw,760px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#6D5A86]/20 to-transparent" />

          <motion.div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -420) stepSlide(1)
              if (info.offset.x > 60 || info.velocity.x > 420) stepSlide(-1)
            }}
          >
          {verticalProjects.map((project, index) => {
            const offset = getCircularOffset(index, activeIndex, projectCount)
            const absOffset = Math.abs(offset)
            const isActive = absOffset === 0
            const layout = getVerticalCarouselLayout(offset, carouselMode)
            const shouldRenderRealMedia =
              layout.isVisible && isActive
            const shouldRenderVideoPoster =
              layout.isVisible && !isActive && !isMobileCarousel && Boolean(project.videoSrc)
            const shouldRenderCardContent = layout.isVisible
            const keepMediaNeutral = project.id === "julian-motion-performance"
            const accent = keepMediaNeutral
              ? verticalAccentClasses[2]
              : verticalAccentClasses[index % verticalAccentClasses.length]
            const carouselTilt = isMobileCarousel || isActive
              ? 0
              : getCardOffset(index).rotate * 0.55
            if (isMobileCarousel && !isActive) return null

            const cardWidthClass =
              isMobileCarousel
                ? "w-[min(88vw,320px)]"
                : carouselMode === "tablet"
                  ? "w-[min(48vw,264px)]"
                  : "w-[min(72vw,272px)]"
            const cardSurfaceClass = !shouldRenderCardContent
              ? "border-transparent bg-transparent shadow-none"
              : isActive
                ? isMobileCarousel
                  ? "border-[#D6C7A1]/24 bg-[linear-gradient(145deg,rgba(26,29,35,0.96),rgba(5,5,5,0.92))] shadow-[0_22px_58px_rgba(0,0,0,0.44)]"
                  : "border-[#D6C7A1]/26 bg-[linear-gradient(145deg,rgba(26,29,35,0.96),rgba(5,5,5,0.92))] shadow-[0_34px_105px_rgba(0,0,0,0.62),0_0_34px_rgba(214,199,161,0.055)]"
                : "border-[#343944]/32 bg-[#0E1013]/84 shadow-[0_24px_78px_rgba(0,0,0,0.42)]"

            return (
                <div
                  key={project.id}
                  className={`pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 sm:top-20 ${cardWidthClass}`}
                >
                  <motion.article
                  aria-hidden={!shouldRenderCardContent}
                  className={`pointer-events-auto relative flex min-h-[730px] flex-col overflow-hidden rounded-[1.65rem] border p-3.5 transition-colors sm:min-h-[780px] ${cardSurfaceClass}`}
                  initial={isMobileCarousel && !shouldReduceMotion ? { opacity: 0, x: 24, y: 8, scale: 0.985 } : false}
                  key={isMobileCarousel ? project.id : undefined}
                  animate={{
                    x: layout.x,
                    y: layout.y,
                    rotate: carouselTilt,
                    scale: layout.scale,
                    opacity: layout.opacity,
                    zIndex: layout.zIndex,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : isMobileCarousel
                        ? { duration: 0.26, ease: easeOut }
                        : carouselSpring
                  }
                  whileHover={
                    isActive && !isMobileCarousel
                      ? { y: -5, scale: 1.014 }
                      : {}
                  }
                  >
                  {shouldRenderCardContent ? (
                  <>
                  {isActive && !keepMediaNeutral ? (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 50% 28%, ${accent.activeGlow}, transparent 46%)`,
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-x-5 top-0 h-px bg-gradient-to-r ${accent.hairline}`} />
                  <div className="font-ui mb-3 flex items-center justify-between rounded-t-[1rem] border border-white/[0.06] bg-[#050505]/40 px-3 py-2 text-[0.54rem] uppercase tracking-[0.16em] text-[#A7AAB2]/50">
                    <span>VERTICAL / CUT</span>
                    <span className={accent.label}>FORMAT / 9:16</span>
                    <span className="text-white/24">/ {String(index + 1).padStart(2, "0")}</span>
                  </div>

                  {project.videoSrc && shouldRenderRealMedia ? (
                    <CloudinaryVideo
                      src={project.videoSrc}
                      title={project.title}
                      aspect="vertical"
                      preload="auto"
                      videoMode={carouselMode === "desktop" ? "desktop" : "mobile"}
                      placeholderLabel={copy.media.preview}
                      controls={isActive}
                      isActive={isActive}
                    />
                  ) : shouldRenderVideoPoster ? (
                    <VideoPosterPreview
                      src={project.videoSrc}
                      title={project.title}
                      aspect="vertical"
                      placeholderLabel={copy.media.preview}
                      videoMode={carouselMode === "tablet" ? "mobile" : "desktop"}
                    />
                  ) : project.youtubeId && shouldRenderRealMedia ? (
                    <YouTubeEmbed
                      id={project.youtubeId}
                      title={project.title}
                      aspect="vertical"
                      shouldLoad
                      loading={isActive ? "eager" : "lazy"}
                      placeholderLabel={copy.media.preview}
                    />
                  ) : (
                    <VideoPlaceholder
                      aspect="vertical"
                      title={project.title}
                      placeholderLabel={copy.media.preview}
                    />
                  )}

                  <div className="flex flex-1 flex-col px-1 pb-[28px] pt-5">
                    <p className={`font-ui text-[0.68rem] uppercase tracking-[0.24em] ${accent.label}`}>
                      {project.eyebrow ?? project.type}
                    </p>
                    <h3 className="font-display mt-3 text-xl font-semibold tracking-[-0.035em] text-[#E8E8E3]">
                      {project.title}
                    </h3>
                    {project.category ? (
                      <p className="font-ui mt-2 text-[0.62rem] uppercase tracking-[0.14em] text-[#A7AAB2]/58">
                        {project.category}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm leading-6 text-[#A7AAB2]">
                      {project.description}
                    </p>
                    <div className="mt-[22px] border-t border-white/[0.07] pt-[18px]">
                      <div className="font-ui mb-3 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.17em] text-white/28">
                        <span>{copy.vertical.tagsLabel}</span>
                        <span>{project.tags.length} {copy.vertical.specsLabel}</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="font-ui rounded-[999px_999px_999px_0.35rem] border border-[#3B465C]/45 bg-[#07080A]/68 px-3 py-1 text-[0.68rem] uppercase tracking-[0.08em] text-[#A7AAB2]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  </>
                  ) : null}
                </motion.article>
              </div>
            )
          })}
          </motion.div>
        </div>

        <div className="relative z-20 mx-auto mt-8 flex justify-center sm:mt-8">
          {carouselDots}
        </div>
      </div>
    </ScrollRevealSection>
  )
}

function AnimatedDescription({ text, show, animationKey }) {
  const chunks = chunkText(text)

  return (
    <motion.div
      className="overflow-hidden"
      initial={false}
      animate={
        show
          ? { height: "auto", opacity: 1, marginTop: 14 }
          : { height: 0, opacity: 0, marginTop: 0 }
      }
      transition={{ duration: 0.4, ease: easeOut }}
    >
      <motion.p
        key={animationKey}
        className="text-sm leading-7 text-[#A7AAB2]"
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: 0.07,
              staggerChildren: 0.12,
            },
          },
        }}
      >
        {chunks.map((chunk, index) => (
          <motion.span
            key={`${chunk}-${index}`}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.44, ease: easeOut },
              },
            }}
          >
            {chunk}&nbsp;
          </motion.span>
        ))}
      </motion.p>
    </motion.div>
  )
}

function StepMicroVisual({ number, isActive, isHovered, shouldReduceMotion }) {
  const isOn = isActive || isHovered
  const softTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.48, ease: easeOut }
  const loopTransition =
    shouldReduceMotion || !isOn
      ? softTransition
      : { duration: 0.62, ease: easeOut }
  const shellState = isOn
    ? "border-[#D6C7A1]/32 bg-[#15171C]/72 opacity-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
    : "border-[#3B465C]/26 bg-[#050505]/44 opacity-[0.48]"

  const referenceCards = [
    { height: 24, tone: "border-[#D6C7A1]/35 bg-[#D6C7A1]/12" },
    { height: 30, tone: "border-[#5C667A]/35 bg-white/[0.035]" },
    { height: 20, tone: "border-[#B88A3B]/32 bg-[#B88A3B]/10" },
  ]

  const structureRows = [
    { width: "82%", tone: "bg-[#D6C7A1]/35" },
    { width: "64%", tone: "bg-[#6D6A90]/32" },
    { width: "74%", tone: "bg-[#5C667A]/38" },
  ]

  return (
    <div
      aria-hidden="true"
      className={`relative mt-4 h-11 overflow-hidden rounded-[0.8rem] border px-3 transition-all duration-300 ${shellState}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(214,199,161,0.07),transparent_42%,rgba(184,138,59,0.035))]" />

      {number === "01" ? (
        <motion.div
          className="relative flex h-full items-center gap-2.5"
          initial={false}
          animate={isOn ? "active" : "idle"}
          variants={{
            idle: {},
            active: {
              transition: shouldReduceMotion
                ? { duration: 0 }
                : { staggerChildren: 0.06 },
            },
          }}
        >
          <div className="flex items-center gap-1.5">
            {referenceCards.map((card, index) => (
              <motion.span
                key={card.height}
                className={`relative w-5 rounded-[0.32rem] border ${card.tone}`}
                style={{ height: card.height }}
                variants={{
                  idle: { opacity: 0.45, y: 3 },
                  active: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.34, ease: easeOut },
                  },
                }}
              >
                <span
                  className={`absolute left-1 top-1 h-1 w-1 rounded-full ${
                    index === 2 ? "bg-[#D6C7A1]/70" : "bg-[#A7AAB2]/45"
                  }`}
                />
              </motion.span>
            ))}
          </div>
          <span className="relative h-px flex-1 bg-[#5C667A]/34">
            <motion.span
              className="absolute left-[28%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#D6C7A1]"
              animate={isOn && !shouldReduceMotion ? { opacity: [0.45, 1] } : { opacity: 0.5 }}
              transition={loopTransition}
            />
            <motion.span
              className="absolute left-[66%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#6D5A86]"
              animate={isOn && !shouldReduceMotion ? { opacity: [0.42, 0.92] } : { opacity: 0.45 }}
              transition={{ ...loopTransition, delay: 0.18 }}
            />
          </span>
        </motion.div>
      ) : null}

      {number === "02" ? (
        <div className="relative flex h-full items-center gap-3">
          <div className="grid h-7 w-7 grid-cols-3 gap-[3px] opacity-70">
            {Array.from({ length: 9 }).map((_, index) => (
              <span
                key={index}
                className={`rounded-[1px] border border-[#3B465C]/36 ${
                  index === 4 ? "bg-[#6D6A90]/42" : "bg-white/[0.025]"
                }`}
              />
            ))}
          </div>
          <div className="grid flex-1 gap-1.5">
            {structureRows.map((row, index) => (
              <motion.span
                key={row.width}
                className="flex items-center gap-2"
                initial={false}
                animate={isOn ? { opacity: 1, x: 0 } : { opacity: 0.5, x: 0 }}
                transition={{ ...softTransition, delay: shouldReduceMotion ? 0 : index * 0.04 }}
              >
                <span className="h-1.5 w-1.5 rounded-[2px] bg-[#5C667A]/52" />
                <span className={`h-1.5 rounded-full ${row.tone}`} style={{ width: row.width }} />
              </motion.span>
            ))}
          </div>
        </div>
      ) : null}

      {number === "03" ? (
        <div className="relative h-full px-1">
          <span className="absolute left-1 right-1 top-1/2 h-px -translate-y-1/2 bg-[#5C667A]/36" />
          <span className="absolute left-[10%] top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#D6C7A1]/30" style={{ width: "22%" }} />
          <span className="absolute left-[39%] top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#6D6A90]/32" style={{ width: "18%" }} />
          <span className="absolute left-[64%] top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#5C667A]/32" style={{ width: "24%" }} />
          {[34, 59].map((left) => (
            <span
              key={left}
              className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-[#B88A3B]/55"
              style={{ left: `${left}%` }}
            />
          ))}
          <motion.span
            className="absolute bottom-2 top-2 w-px bg-[#6D5A86]/82 shadow-[0_0_10px_rgba(68,49,95,0.34)]"
            style={{ left: "51%" }}
            animate={isOn && !shouldReduceMotion ? { x: [-4, 7] } : { x: 0 }}
            transition={loopTransition}
          />
          {[25, 74].map((left, index) => (
            <span
              key={left}
              className={`absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px] ${
                index === 0 ? "bg-[#D6C7A1]/75" : "bg-[#D6C7A1]/70"
              }`}
              style={{ left: `${left}%` }}
            />
          ))}
        </div>
      ) : null}

      {number === "04" ? (
        <svg className="relative h-full w-full" viewBox="0 0 164 44" fill="none">
          <path d="M8 34H156" stroke="rgba(92,102,122,0.28)" strokeWidth="1" />
          <path d="M8 22H156" stroke="rgba(92,102,122,0.16)" strokeWidth="1" />
          <motion.path
            d="M10 31 C38 31 42 11 70 15 C98 19 111 30 152 9"
            stroke="rgba(214,199,161,0.72)"
            strokeWidth="1.5"
            strokeLinecap="round"
            pathLength="1"
            initial={false}
            animate={isOn ? { pathLength: 1, opacity: 1 } : { pathLength: 0.62, opacity: 0.48 }}
            transition={softTransition}
          />
          {[
            { x: 42, y: 18, fill: "#D6C7A1" },
            { x: 72, y: 16, fill: "#6D5A86" },
            { x: 116, y: 27, fill: "#6D6A90" },
            { x: 152, y: 9, fill: "#D6C7A1" },
          ].map((point) => (
            <rect
              key={`${point.x}-${point.y}`}
              x={point.x - 3}
              y={point.y - 3}
              width="6"
              height="6"
              rx="1"
              transform={`rotate(45 ${point.x} ${point.y})`}
              fill={point.fill}
              opacity={isOn ? 0.78 : 0.42}
            />
          ))}
        </svg>
      ) : null}

      {number === "05" ? (
        <div className="relative flex h-full items-center gap-3">
          <span className="relative h-8 w-7 rounded-[0.35rem] border border-[#5C667A]/34 bg-[#0E1013]/76">
            <span className="absolute left-1 top-1 h-px w-3 bg-[#A7AAB2]/32" />
            <motion.span
              className="absolute bottom-1.5 left-1/2 h-2.5 w-4 -translate-x-1/2 rounded-sm border border-[#6D5A86]/46"
              animate={isOn && !shouldReduceMotion ? { opacity: [0.48, 0.95] } : { opacity: 0.48 }}
              transition={loopTransition}
            />
          </span>
          <div className="flex-1">
            <div className="relative h-1.5 overflow-hidden rounded-full bg-[#5C667A]/24">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#D6C7A1] via-[#6D5A86] to-[#D6C7A1]"
                initial={false}
                animate={{ width: isOn ? "82%" : "46%" }}
                transition={softTransition}
              />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[0.45rem] uppercase tracking-[0.18em] text-white/28">
              <span>export</span>
              <span className={isOn ? "text-[#6D5A86]/80" : "text-white/28"}>ready</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function WorkflowSection({ copy }) {
  const shouldReduceMotion = useReducedMotion()
  const isCompact = useCompactLayout()
  const [activeStep, setActiveStep] = useState(0)
  const [hoveredStep, setHoveredStep] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const workflowSteps = copy.process.steps

  const goToStep = (index) => {
    setActiveStep(wrapIndex(index, workflowSteps.length))
    setIsPaused(true)
    window.setTimeout(() => setIsPaused(false), 1000)
  }

  useEffect(() => {
    if (shouldReduceMotion || isPaused) return undefined
    const interval = window.setInterval(() => {
      setActiveStep((current) => wrapIndex(current + 1, workflowSteps.length))
    }, isCompact ? 4200 : 3000)
    return () => window.clearInterval(interval)
  }, [shouldReduceMotion, isPaused, isCompact, workflowSteps.length])

  const activeOutline = workflowStepOutlines[activeStep % workflowStepOutlines.length]

  return (
    <ScrollRevealSection id="process" className="overflow-visible">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <motion.div
          className="max-w-lg lg:pl-6 xl:pl-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.p
            className="font-ui mb-[18px] flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em]"
            variants={lightFadeUp}
          >
            <motion.span
              className="h-1.5 w-1.5 rotate-45 rounded-[1px]"
              animate={{
                backgroundColor: activeOutline.marker,
              }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.52, ease: easeOut }}
            />
            <motion.span
              className="inline-block"
              animate={{
                color: activeOutline.marker,
                textShadow: `0 0 18px ${activeOutline.glow}`,
              }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.52, ease: easeOut }}
            >
              {copy.process.eyebrow}
            </motion.span>
            <motion.span
              className="h-px w-[54px] -rotate-2"
              animate={{
                background: `linear-gradient(90deg, ${activeOutline.marker}, transparent)`,
                opacity: 0.55,
              }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.52, ease: easeOut }}
            />
          </motion.p>
          <motion.h2 className="font-display text-3xl font-semibold tracking-[-0.045em] text-[#E8E8E3] sm:text-5xl" variants={lightFadeUp}>
            {copy.process.title}
          </motion.h2>
          <motion.p className="mt-[22px] max-w-xl text-base leading-8 text-[#A7AAB2] sm:text-lg" variants={lightFadeUp}>
            {copy.process.description}
          </motion.p>
          <motion.p className="mt-[26px] text-sm leading-7 text-[#A7AAB2]/85" variants={lightFadeUp}>
            {copy.process.hint}
          </motion.p>
          {copy.process.note ? (
            <motion.p
              className="font-ui mt-[16px] inline-flex rounded-[999px_999px_999px_0.45rem] border border-[#D6C7A1]/18 bg-[#050505]/42 px-3.5 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#D6C7A1]/78 shadow-[0_0_24px_rgba(214,199,161,0.045)]"
              variants={lightFadeUp}
            >
              {copy.process.note}
            </motion.p>
          ) : null}
          <motion.div className="mt-[34px] flex flex-wrap gap-[10px]" variants={lightFadeUp}>
            {workflowSteps.map((item, index) => {
              const buttonOutline = workflowStepOutlines[index % workflowStepOutlines.length]
              const isCurrent = index === activeStep

              return (
                <motion.button
                  key={item.number}
                  type="button"
                  onClick={() => goToStep(index)}
                  className="font-ui rounded-[999px_999px_999px_0.45rem] border px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-[background,border-color,color,opacity] duration-500 hover:text-[#E8E8E3]"
                  animate={{ opacity: isCurrent ? 1 : 0.62 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.48, ease: easeOut }}
                  style={{
                    borderColor: isCurrent ? buttonOutline.marker : buttonOutline.sideBorder,
                    background: isCurrent
                      ? `linear-gradient(145deg, ${buttonOutline.glow}, rgba(21,25,34,0.64))`
                      : "rgba(21,25,34,0.52)",
                    color: isCurrent ? "#E8E8E3" : "#A7AAB2",
                  }}
                >
                  {item.number}
                </motion.button>
              )
            })}
          </motion.div>
        </motion.div>

        <div
          className="relative min-h-[540px] w-full max-w-[660px] justify-self-center overflow-hidden rounded-[1.35rem] border border-[#D6C7A1]/12 bg-[linear-gradient(145deg,rgba(26,29,35,0.78),rgba(5,5,5,0.88))] p-4 shadow-[0_20px_52px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.04)] sm:min-h-[520px] sm:p-5 sm:shadow-[0_30px_86px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.04)]"
          style={{
            borderColor: activeOutline.panelBorder,
            boxShadow: isCompact
              ? "0 20px 52px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)"
              : "0 30px 86px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => {
            setHoveredStep(null)
            setIsPaused(false)
          }}
        >
          <div className="pointer-events-none absolute left-5 top-5 h-10 w-10 border-l border-t border-[#D6C7A1]/18" />
          <div className="pointer-events-none absolute bottom-5 right-5 h-10 w-10 border-b border-r border-[#5C667A]/22" />
          <AnimatePresence initial={false}>
            <motion.div
              key={`process-ambient-${activeStep}`}
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.52, ease: easeOut }}
              style={{ background: activeOutline.ambient }}
            />
          </AnimatePresence>
          <div className="font-ui relative z-20 flex items-center justify-between rounded-[0.75rem_0.45rem_0.75rem_0.45rem] border border-[#D6C7A1]/12 bg-[#050505]/68 px-4 py-2.5 text-[0.55rem] uppercase tracking-[0.18em] text-[#A7AAB2]/62 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-[#D6C7A1]" />
              TIMELINE / WORKFLOW
            </span>
            <span className="text-[#D6C7A1]/62">INSPECTOR</span>
          </div>
          <div
            className="pointer-events-none absolute inset-x-8 top-[47%] h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${activeOutline.panelBorder}, transparent)`,
            }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-[44%] h-[180px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[32px] sm:h-[230px] sm:w-[420px] sm:opacity-70 sm:blur-[44px]"
            style={{ backgroundColor: activeOutline.glow }}
          />

          <motion.div
            className="relative z-10 mt-3 h-[388px] cursor-grab active:cursor-grabbing sm:h-[364px]"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragStart={() => setIsPaused(true)}
            onDragEnd={(_, info) => {
              if (info.offset.x < -46 || info.velocity.x < -360) {
                setActiveStep((current) => wrapIndex(current + 1, workflowSteps.length))
              }
              if (info.offset.x > 46 || info.velocity.x > 360) {
                setActiveStep((current) => wrapIndex(current - 1, workflowSteps.length))
              }
              window.setTimeout(() => setIsPaused(false), 900)
            }}
          >
            {workflowSteps.map((item, index) => {
              const offset = getCircularOffset(index, activeStep, workflowSteps.length)
              const absOffset = Math.abs(offset)
              const isActive = index === activeStep
              const isHovered = hoveredStep === index
              const showDescription = isActive
              const isHidden = absOffset > 1 || (isCompact && !isActive)
              const outline = workflowStepOutlines[index % workflowStepOutlines.length]
              if (isCompact && !isActive) return null

              return (
                <div key={item.number} className="pointer-events-none absolute left-1/2 top-5 w-[min(76vw,278px)] -translate-x-1/2 sm:top-4">
                  <motion.article
                    role="button"
                    tabIndex={isHidden ? -1 : 0}
                    onClick={() => goToStep(index)}
                    onPointerEnter={() => setHoveredStep(index)}
                    onPointerLeave={() => setHoveredStep(null)}
                    className={`pointer-events-auto relative min-h-[342px] overflow-hidden rounded-[1.08rem] border p-4 shadow-[0_14px_38px_rgba(0,0,0,0.28)] transition-colors sm:min-h-[326px] sm:p-5 sm:shadow-[0_18px_52px_rgba(0,0,0,0.34)] ${
                      isActive
                        ? "border-transparent shadow-[0_26px_74px_rgba(0,0,0,0.52)]"
                        : "border-[#3B465C]/35 bg-[#07080A]/72 hover:border-[#6D6A90]/34"
                    }`}
                    style={
                      isActive
                        ? {
                            background: `linear-gradient(145deg, rgba(13,16,19,0.97), rgba(7,10,15,0.94)) padding-box, ${outline.gradient} border-box`,
                            boxShadow: isCompact
                              ? "0 16px 42px rgba(0,0,0,0.34)"
                              : "0 26px 74px rgba(0,0,0,0.52)",
                          }
                        : {
                            borderColor: outline.sideBorder,
                          }
                    }
                    animate={{
                      x: isCompact ? 0 : offset * 252,
                      y: isActive ? 0 : -2,
                      scale: isActive ? 1 : 0.7,
                      opacity: isHidden ? 0 : isActive ? 1 : 0.4,
                      zIndex: isActive ? 30 : isHidden ? 0 : 8,
                      pointerEvents: isHidden ? "none" : "auto",
                    }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : isCompact
                          ? { duration: 0.22, ease: easeOut }
                          : { duration: 0.5, ease: easeOut }
                    }
                    whileHover={
                      isHidden || isCompact
                        ? {}
                        : { y: isActive ? -4 : -2, scale: isActive ? 1.018 : 0.72 }
                    }
                  >
                    {isActive ? (
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${outline.glow}, transparent 44%)`,
                        }}
                      />
                    ) : null}
                    <div
                      className="absolute inset-x-5 top-0 h-px"
                      style={{ background: outline.hairline }}
                    />
                    <div className="font-ui mb-4 flex items-center justify-between text-[0.52rem] uppercase tracking-[0.17em] text-white/28">
                      <span>{isActive ? "KEYFRAME ACTIVE" : "NEXT MARKER"}</span>
                      <span>{item.number}</span>
                    </div>
                    {isActive ? (
                      <>
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-ui text-xs font-semibold uppercase tracking-[0.34em] text-[#D6C7A1]/78">{item.number}</span>
                          <span className="h-px flex-1 bg-gradient-to-r from-[#D6C7A1]/30 via-[#6D6A90]/22 to-transparent" />
                        </div>
                        <StepMicroVisual
                          number={item.number}
                          isActive={isActive}
                          isHovered={isHovered}
                          shouldReduceMotion={shouldReduceMotion}
                        />
                      </>
                    ) : null}
                    <h3 className="font-display mt-4 text-xl font-semibold tracking-[-0.04em] text-[#E8E8E3]">{item.title}</h3>
                    <AnimatedDescription text={item.description} show={showDescription && !isHidden} animationKey={`${activeStep}-${item.number}`} />
                  </motion.article>
                </div>
              )
            })}
          </motion.div>

          <div className="absolute bottom-5 left-5 right-5 rounded-[0.85rem] border border-[#3B465C]/30 bg-[#050505]/60 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="font-ui mb-2 flex items-center justify-between text-[0.5rem] uppercase tracking-[0.18em] text-white/28">
              <span>workflow</span>
              <span>{workflowSteps[activeStep].number}</span>
            </div>
            <div className="relative h-6">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#5C667A]/30" />
              <div
                className="absolute left-0 top-1/2 h-px -translate-y-1/2 transition-all duration-500"
                style={{
                  background: activeOutline.progress,
                  width: `${(activeStep / (workflowSteps.length - 1)) * 100}%`,
                }}
              />
              {workflowSteps.map((item, index) => {
                const isCurrent = index === activeStep
                return (
                  <span
                    key={item.number}
                    className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1px] transition-all duration-300 ${
                      isCurrent
                        ? "h-2.5 w-2.5 border border-white/30"
                        : "h-1.5 w-1.5 bg-[#5C667A]/62"
                    }`}
                    style={{
                      left: `${(index / (workflowSteps.length - 1)) * 100}%`,
                      ...(isCurrent
                        ? {
                            backgroundColor: activeOutline.marker,
                          }
                        : {}),
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </ScrollRevealSection>
  )
}

function ContactSection({ copy }) {
  const { contact: contactCopy } = copy

  return (
    <ScrollRevealSection id="contact" spacingClass="py-[92px] sm:py-[116px] lg:py-[132px]">
      <div className="relative overflow-visible border border-[#343944]/55 bg-[linear-gradient(145deg,rgba(14,16,19,0.92),rgba(5,5,5,0.94))] p-[28px] shadow-[0_26px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.045)] sm:p-[44px] lg:p-[54px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D6C7A1]/44 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-[#D6C7A1]/36 via-white/[0.06] to-transparent" />

        <div className="relative z-10 grid gap-[34px] lg:grid-cols-[minmax(0,1fr)_minmax(300px,390px)] lg:items-center">
          <div>
            <p className="font-ui mb-5 text-xs font-semibold uppercase tracking-[0.26em] text-[#D6C7A1]/78">
              {contactCopy.eyebrow}
            </p>
            <h2 className="font-display max-w-3xl text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.048em] text-[#E8E8E3] sm:text-5xl">
              {contactCopy.title}
            </h2>
            <p className="mt-[22px] max-w-2xl text-base leading-8 text-[#A7AAB2] sm:text-lg">
              {contactCopy.description}
            </p>

            {contactCopy.details ? (
              <p className="font-ui mt-[24px] max-w-2xl text-[0.62rem] uppercase leading-6 tracking-[0.14em] text-[#D6C7A1]/62">
                {contactCopy.details}
              </p>
            ) : null}
          </div>

          <div className="relative w-full overflow-visible sm:max-w-[440px] lg:w-[400px] lg:justify-self-end">
            <div className="mb-5 hidden items-center gap-3 lg:flex">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D6C7A1]/26 to-white/[0.04]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D6C7A1]/72 shadow-[0_0_18px_rgba(214,199,161,0.22)]" />
            </div>

            <div className="grid gap-3 overflow-visible">
              <CopyEmailButton
                label={contactCopy.email}
                copiedLabel={contactCopy.copied}
                className="min-h-[56px] w-full rounded-[0.75rem_0.75rem_0.75rem_0.28rem] sm:min-w-[320px]"
              />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <ButtonLink
                  href={`https://wa.me/${contact.whatsapp}`}
                  variant="secondary"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[52px] !w-full rounded-[0.32rem_0.75rem_0.75rem_0.75rem] sm:!w-full"
                >
                  {contactCopy.whatsapp}
                </ButtonLink>

                <ButtonLink
                  href={contact.linkedin}
                  variant="secondary"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[52px] !w-full rounded-[0.32rem_0.75rem_0.75rem_0.75rem] sm:!w-full"
                >
                  {contactCopy.linkedin}
                </ButtonLink>
              </div>
            </div>

            <p className="mt-5 max-w-[25rem] text-sm leading-6 text-[#A7AAB2]/72 sm:text-right lg:ml-auto">
              {contactCopy.actionNote}
            </p>
          </div>
        </div>
      </div>
    </ScrollRevealSection>
  )
}

function Footer({ copy }) {
  return (
    <footer className="relative mx-auto max-w-7xl px-5 pb-10 pt-4 sm:px-8">
      <div className="font-ui flex flex-col gap-4 border-t border-white/[0.08] pt-7 text-[0.68rem] uppercase tracking-[0.18em] text-[#A7AAB2]/70 sm:flex-row sm:items-center sm:justify-between">
        <span>{copy.footer.left}</span>
        <span className="text-[#D6C7A1]/78">{copy.footer.center}</span>
        <span>{copy.footer.right}</span>
      </div>
    </footer>
  )
}

function App() {
  const [language, setLanguage] = useState("en")
  const copy = siteCopy[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-[#050505] text-[#E8E8E3]">
      <BackgroundTexture />
      <div className="relative z-10">
        <SiteNav
          copy={copy}
          language={language}
          onLanguageChange={setLanguage}
        />
        <Hero copy={copy} />
        <VerticalWorkCarousel copy={copy} />
        <AboutSection key={`about-${language}`} copy={copy} />
        <WorkflowSection copy={copy} />
        <ContactSection copy={copy} />
        <Footer copy={copy} />
      </div>
    </main>
  )
}

export default App
