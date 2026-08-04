import { Link } from 'react-router-dom';
import { Navbar, ScrollController } from '../../components/landing/LandingHero';
import { AiEngine, Closing, CsvFlow, Faq, Metrics, Onboarding, Pillars, Positioning, Problem, Proof, Verticals } from '../../components/landing/sections';
import '../../styles/landing.css';
import '../../styles/landing-sections.css';

// The landing story, top to bottom:
//   ScrollController  ACT 1-4  curiosity, reveal, understanding, trust (cinematic)
//   Verticals         who it is for
//   Problem           why it matters
//   Positioning       where ShelfSense sits
//   Pillars           what it is made of
//   CsvFlow           how data gets in
//   Metrics           what it computes
//   AiEngine          what it decides
//   Proof             what that looks like
//   Onboarding        how to begin
//   Faq               what you are still wondering
//   Closing           ACT 5  action
export default function LandingPage() {
  return (
    <div className="ss-landing">
      <Navbar />
      <main>
        <ScrollController />
        <Verticals />
        <Problem />
        <Positioning />
        <Pillars />
        <CsvFlow />
        <Metrics />
        <AiEngine />
        <Proof />
        <Onboarding />
        <Faq />
        <Closing />
      </main>
      <footer className="ss-footer">
        <div className="ss-footer-brand">
          <span className="ss-brand ss-brand-sm"><span><i className="bi bi-layers-fill" /></span>ShelfSense <b>AI</b></span>
          <p>Transforming sales data into smarter inventory decisions.</p>
        </div>
        <nav className="ss-footer-links">
          <div><h4>Product</h4><a href="#platform">Platform</a><a href="#sync">Synchronization</a><a href="#analytics">Analytics</a><a href="#intelligence">Intelligence</a></div>
          <div><h4>Company</h4><a href="#problem">Why ShelfSense</a><a href="#positioning">Where it sits</a><a href="#faq">FAQ</a></div>
          <div><h4>Get started</h4><Link to="/dashboard">Sign in</Link><Link to="/dashboard">Create account</Link><a href="#start">How it works</a></div>
        </nav>
        <div className="ss-footer-base">
          <span>&copy; {new Date().getFullYear()} ShelfSense AI</span>
          <span>Clarity for every inventory decision.</span>
        </div>
      </footer>
    </div>
  );
}
