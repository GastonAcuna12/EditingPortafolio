import { useId } from "react"
import { motion } from "motion/react"

export function AcunaResidue() {
  const id = useId().replace(/:/g, "")
  const paint = (name) => `url(#${id}-${name})`
  return (
    <motion.div className="acuna-residue" aria-hidden="true" viewport={{ once: true, amount: 0.1 }}
      onViewportEnter={(entry) => { if (entry) entry.target.dataset.revealed = "true" }}>
      <svg viewBox="0 60 1320 360" aria-hidden="true" focusable="false">
        <defs>
          <text id={`${id}-word`} className="acuna-type" x="0" y="390">acuña.</text>
          <pattern id={`${id}-dense`} width="64" height="56" patternUnits="userSpaceOnUse">
            <path fill="white" d="M0 0H12V12H0ZM16 0H24V8H16ZM32 4H44V16H32ZM48 0H60V8H48ZM4 20H16V32H4ZM24 16H32V24H24ZM44 24H60V32H44ZM0 40H8V48H0ZM16 36H28V48H16ZM36 40H44V48H36ZM52 40H60V52H52Z" />
          </pattern>
          <pattern id={`${id}-sparse`} width="88" height="72" patternUnits="userSpaceOnUse" x="13" y="7">
            <path fill="white" d="M4 4H12V12H4ZM40 0H52V8H40ZM68 24H72V28H68ZM20 32H28V40H20ZM44 52H52V60H44ZM4 60H8V64H4Z" />
          </pattern>
          <mask id={`${id}-solid`} maskUnits="userSpaceOnUse" width="1400" height="440">
            <path fill="white" d="M0 0H784V152H740V212H696V256H736V292H672V348H624V440H0Z" />
            <path fill="black" d="M128 348H172V356H128ZM484 188H504V232H484ZM556 288H600V300H556ZM668 168H704V184H668ZM624 368H664V400H624Z" />
          </mask>
          <mask id={`${id}-pixels`} maskUnits="userSpaceOnUse" width="1400" height="440">
            <path fill={paint("dense")} d="M784 0H1016V144H1056V200H984V272H1032V320H968V376H1008V440H624V348H672V292H736V256H696V212H740V152H784Z" />
            <path fill={paint("sparse")} d="M1016 0H1400V440H1008V376H968V320H1032V272H984V200H1056V144H1016Z" />
            <path fill="black" d="M804 216H860V260H804ZM900 336H944V388H900ZM1060 260H1112V296H1060Z" />
            <path fill="white" d="M796 148H820V180H796ZM860 284H888V308H860ZM992 180H1032V196H992ZM1068 348H1088V368H1068ZM1176 348H1200V372H1176Z" />
          </mask>
        </defs>
        <g className="acuna-solid" mask={paint("solid")}><use href={`#${id}-word`} /></g>
        <g className="acuna-pixels" mask={paint("pixels")}><use href={`#${id}-word`} /></g>
      </svg>
    </motion.div>
  )
}
