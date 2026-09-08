import { useId } from "react"
import { motion } from "motion/react"

export function GADissolve({ variant = "about" }) {
  const id = useId().replace(/:/g, "")
  const ref = (name) => `url(#${id}-${name})`

  return (
    <motion.div className={`ga-dissolve ga-dissolve--${variant}`} aria-hidden="true"
      viewport={{ once: true, amount: 0.12 }}
      onViewportEnter={(entry) => { if (entry) entry.target.dataset.revealed = "true" }}>
      <svg viewBox="0 0 1000 560" fill="currentColor" focusable="false" aria-hidden="true">
        <defs>
          {/* Shared crossbar and open terminals leave the initials slightly unresolved. */}
          <path id={`${id}-mark`} fillRule="evenodd" d="M510 116C462 57 391 26 302 26C142 26 36 130 36 280C36 435 140 534 297 534C390 534 467 503 526 451V268H294V356H421V402C390 426 350 438 305 438C204 438 145 378 145 280C145 181 205 121 307 121C362 121 405 142 440 176ZM363 526L572 34H681L908 526H784L747 436H508L472 526ZM546 342H708L624 140Z" />
          <pattern id={`${id}-dense`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path fill="white" d="M0 0H6V6H0ZM8 0H14V6H8ZM16 0H22V6H16ZM0 8H6V14H0ZM16 8H22V14H16ZM0 16H6V22H0ZM8 16H14V22H8ZM16 16H22V22H16Z" />
          </pattern>
          <pattern id={`${id}-medium`} width="32" height="32" patternUnits="userSpaceOnUse" x="4" y="8">
            <path fill="white" d="M0 0H8V8H0ZM16 4H22V10H16ZM8 16H16V24H8ZM26 24H30V28H26Z" />
          </pattern>
          <pattern id={`${id}-sparse`} width="48" height="48" patternUnits="userSpaceOnUse" x="12">
            <path fill="white" d="M0 8H4V12H0ZM24 0H30V6H24ZM12 32H16V36H12ZM40 24H44V28H40Z" />
          </pattern>
          <clipPath id={`${id}-solid`}><path d="M0 0H610V96H570V172H514V256H478V344H418V428H378V560H0Z" /></clipPath>
          <mask id={`${id}-raster`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="560">
            <path fill={ref("dense")} d="M610 0H732V68H700V160H654V240H604V332H564V432H516V560H378V428H418V344H478V256H514V172H570V96H610Z" />
            <path fill={ref("medium")} d="M732 0H842V104H804V188H764V292H706V380H680V476H620V560H516V432H564V332H604V240H654V160H700V68H732Z" />
            <path fill={ref("sparse")} d="M842 0H1000V560H620V476H680V380H706V292H764V188H804V104H842Z" />
            <path fill="black" d="M580 184H676V192H580ZM492 384H576V400H492ZM736 296H832V304H736Z" />
            <path fill="white" d="M592 256H608V264H592ZM700 144H710V154H700ZM664 404H672V412H664ZM770 360H774V364H770Z" />
          </mask>
          <mask id={`${id}-cuts`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="560">
            <rect width="1000" height="560" fill="white" />
            <path fill="black" d="M0 210H180V216H0ZM372 26H400V58H372ZM186 498H256V510H186ZM394 268H420V280H394Z" />
          </mask>
        </defs>
        <g mask={ref("cuts")}>
          <g className="ga-solid" clipPath={ref("solid")}><use href={`#${id}-mark`} /></g>
          <g className="ga-raster" mask={ref("raster")}><use href={`#${id}-mark`} /></g>
        </g>
        <path className="ga-playhead" d="M232 8V548" fill="none" stroke="var(--accent)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </motion.div>
  )
}
