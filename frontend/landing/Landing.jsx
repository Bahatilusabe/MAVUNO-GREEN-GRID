import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Problem from "./components/Problem";
import Why from "./components/Why";
import HowItWorks from "./components/HowItWorks";
import Different from "./components/Different";
import Impact from "./components/Impact";
import Portals from "./components/Portals";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

/**
 * The landing page.
 *
 * It answers five questions, in the order a reader asks them:
 *
 *   what it is      — the hero
 *   what goes wrong — the problem
 *   why it exists   — the mission and its three pillars
 *   how it runs     — the five-stage loop
 *   how it differs  — the comparison against the usual chain
 *
 * and closes with the measured impact and a way into the product.
 */
export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Why />
        <HowItWorks />
        <Different />
        <Impact />
        <Portals />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
