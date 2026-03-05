import Header from '../components/Header/Header.jsx'
import Hero from '../components/Hero/Hero.jsx'
import Features from '../components/Features/Features.jsx'
import Tariffs from '../components/Tariffs/Tariffs.jsx'
import FAQ from '../components/FAQ/FAQ.jsx'
import Footer from '../components/Footer/Footer.jsx'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <Header />
      <main>
        <Hero />
        <Features />
        <Tariffs />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
