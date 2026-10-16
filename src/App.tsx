import { About } from './components/About'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { ScrollProgress } from './components/ScrollProgress'
import { site } from './site'

function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollProgress />
      <Hero />
      <Marquee />
      <main id="main">
        <About />
        <Experience />
        <Contact />
      </main>
      <footer>
        <div className="wrap label">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>Built with React + Vite</span>
        </div>
      </footer>
    </>
  )
}

export default App
