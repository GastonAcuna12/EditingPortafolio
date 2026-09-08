import { useId } from "react"
import { motion } from "motion/react"

export function NameResidue() {
  const id = useId().replace(/:/g, "")
  const paint = (name) => `url(#${id}-${name})`

  return (
    <motion.div className="name-residue" aria-hidden="true" viewport={{ once: true, amount: 0.08 }}
      onViewportEnter={(entry) => { if (entry) entry.target.dataset.revealed = "true" }}>
      <svg viewBox="120 0 1440 860" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <defs>
          <g id={`${id}-name`} className="residue-type">
            <text x="-150" y="378">GASTÓN</text>
            <text x="170" y="784">ACUÑA</text>
          </g>
          {/* Uneven clusters repeat at different scales; larger cuts interrupt the repeat. */}
          <pattern id={`${id}-grain`} width="104" height="88" patternUnits="userSpaceOnUse">
            <path fill="white" d="M0 0H12V12H0ZM16 0H24V8H16ZM36 4H44V12H36ZM64 0H80V8H64ZM88 8H96V16H88ZM8 20H16V28H8ZM24 16H36V32H24ZM48 24H56V32H48ZM72 16H80V24H72ZM92 32H100V40H92ZM0 44H8V52H0ZM16 40H32V48H16ZM40 40H48V48H40ZM56 44H68V56H56ZM76 36H84V44H76ZM8 64H20V76H8ZM28 60H36V68H28ZM48 68H56V76H48ZM72 64H88V72H72ZM96 72H104V80H96Z" />
          </pattern>
          <pattern id={`${id}-coarse`} width="136" height="112" patternUnits="userSpaceOnUse" x="28" y="12">
            <path fill="white" d="M0 0H20V16H0ZM32 8H44V20H32ZM76 0H84V8H76ZM108 24H124V40H108ZM12 44H24V56H12ZM48 36H68V48H48ZM84 60H96V72H84ZM28 84H36V92H28ZM56 76H72V92H56ZM116 88H124V96H116Z" />
          </pattern>
          <pattern id={`${id}-dust`} width="160" height="136" patternUnits="userSpaceOnUse" x="9" y="31">
            <path fill="white" d="M8 12H12V16H8ZM68 4H76V12H68ZM112 40H116V44H112ZM36 76H44V84H36ZM92 108H96V112H92ZM144 92H152V100H144Z" />
          </pattern>
          <mask id={`${id}-broken`} maskUnits="userSpaceOnUse" x="-200" y="0" width="2000" height="900">
            <rect x="-200" width="2000" height="900" fill={paint("grain")} />
            <path fill="white" d="M-120 80H112V128H68V204H-120ZM296 92H440V140H392V188H296ZM600 48H760V88H704V152H648V216H600ZM1016 164H1176V188H1136V248H1056V276H1016ZM152 508H264V572H232V636H152ZM400 576H584V608H536V688H472V744H400ZM816 476H968V516H916V564H856V620H816ZM1140 660H1288V692H1240V744H1140Z" />
            <path fill="black" d="M-200 284H128V432H-200ZM192 240H384V304H272V384H192ZM440 32H536V136H440ZM488 232H656V312H576V356H488ZM760 96H880V196H832V248H760ZM936 316H1216V432H936ZM16 448H312V508H208V552H16ZM336 640H400V768H336ZM600 476H784V548H704V608H600ZM656 696H832V852H656ZM1000 516H1108V612H1000ZM1280 560H1552V668H1280Z" />
            <path fill={paint("coarse")} d="M192 240H384V304H272V384H192ZM488 232H656V312H576V356H488ZM600 476H784V548H704V608H600ZM1000 516H1108V612H1000Z" />
            <path fill="white" d="M180 548H316V588H276V648H228V684H180ZM456 492H612V524H568V588H520V680H456ZM800 632H984V672H948V736H872V768H800ZM1160 480H1308V528H1260V608H1208V640H1160Z" />
            <path fill="black" d="M408 152H472V168H408ZM664 96H680V128H664ZM512 624H544V648H512ZM864 544H896V568H864ZM1160 708H1192V724H1160Z" />
          </mask>
          <mask id={`${id}-remnants`} maskUnits="userSpaceOnUse" x="-200" y="0" width="2000" height="900">
            <path fill={paint("dust")} d="M40 200H584V460H40ZM584 120H1000V380H584ZM256 592H1104V860H256ZM1040 416H1640V824H1040Z" />
          </mask>
          <linearGradient id={`${id}-ink`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".13" />
            <stop offset=".46" stopColor="currentColor" stopOpacity=".22" />
            <stop offset=".76" stopColor="currentColor" stopOpacity=".58" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".18" />
          </linearGradient>
        </defs>
        <g className="residue-ink" fill={paint("ink")} mask={paint("broken")}><use href={`#${id}-name`} /></g>
        <g className="residue-remnants" fill={paint("ink")} mask={paint("remnants")} transform="translate(24 16)"><use href={`#${id}-name`} /></g>
        <path className="residue-fragments" fill="currentColor" d="M284 408H300V424H284ZM332 444H340V452H332ZM668 380H692V388H668ZM736 420H744V428H736ZM1072 456H1088V472H1072ZM936 768H948V780H936ZM1208 804H1216V812H1208Z" />
      </svg>
    </motion.div>
  )
}
