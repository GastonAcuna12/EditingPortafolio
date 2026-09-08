import { useEffect, useState } from "react"
import { MotionConfig } from "motion/react"
import { copy as translations } from "./data/copy"
import { featuredClients, localizeProject, playgroundProjects, projects } from "./data/portfolio"
import { getProjectNotes } from "./data/projectNotes"
import { useCompactLayout } from "./hooks/useCompactLayout"
import { useProjectNavigation } from "./hooks/useProjectNavigation"
import { SiteNav } from "./components/SiteNav"
import { Hero } from "./components/Hero"
import { FeaturedWork } from "./components/FeaturedWork"
import { ProjectDetail } from "./components/ProjectDetail"
import { FeaturedClients } from "./components/FeaturedClients"
import { About } from "./components/About"
import { Playground } from "./components/Playground"
import { Contact } from "./components/Contact"

export default function App() {
  const [language, setLanguage] = useState("en")
  const isCompact = useCompactLayout()
  const copy = translations[language]
  const localize = (project) => ({
    ...localizeProject(project, language),
    ...getProjectNotes(project.id, language),
  })
  const work = projects.map(localize)
  const lab = playgroundProjects.map(localize)
  const allProjects = [...work, ...lab]
  const { selection, openProject, closeProject, stepProject, finishClose } = useProjectNavigation(allProjects)
  const selectedIndex = allProjects.findIndex((project) => project.id === selection?.id)
  const selectedProject = allProjects[selectedIndex]

  useEffect(() => { document.documentElement.lang = language }, [language])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#work">{copy.nav.skip}</a>
      <SiteNav language={language} onLanguageChange={setLanguage} copy={copy.nav} hasLab={lab.length > 0} />
      <main>
        <Hero copy={copy.hero} />
        <FeaturedWork projects={work} onOpen={openProject} videoMode={isCompact ? "mobile" : "desktop"} copy={copy.work} />
        <FeaturedClients clients={featuredClients} copy={copy.clients} />
        <About copy={copy.about} />
        <Playground projects={lab} onOpen={openProject} videoMode={isCompact ? "mobile" : "desktop"} copy={copy.lab} watchLabel={copy.work.open} />
      </main>
      <Contact copy={copy.contact} />
      {selectedProject && <ProjectDetail project={selectedProject} index={selectedIndex} total={allProjects.length} origin={selection.origin} closing={selection.closing} onClosed={finishClose} onClose={closeProject} onStep={stepProject} videoMode={isCompact ? "mobile" : "desktop"} copy={copy} language={language} onLanguageChange={setLanguage} />}
    </MotionConfig>
  )
}
