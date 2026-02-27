import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Steps from '../components/Steps.jsx'
import Benefits from '../components/Benefits.jsx'
import Cta from '../components/Cta.jsx'
import Footer from '../components/Footer.jsx'

function Home() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero />
        <Steps />
        <Benefits />
        <Cta />
      </main>

      <Footer />
    </div>
  )
}

export default Home
