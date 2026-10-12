import React, { useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Car, 
  Clock, 
  CheckCircle2, 
  Phone,
  Compass,
  Briefcase,
  Plane,
  Award,
  FileText
} from 'lucide-react';
import { BRAND } from '../constants/branding';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CorporateClientsSection } from '../components/home/CorporateClientsSection';
import '../styles/about.css';

export const AboutPage = ({ onNavigate, onBookNowClick }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `About Us | ${BRAND.name} J.P. Nagar Bangalore`;
  }, []);

  return (
    <div className="page-container" aria-label="About Friends Tours & Travels">
      <Navbar
        activeSection="about"
        onNavClick={onNavigate}
        onBookNowClick={onBookNowClick}
      />

      {/* 1. CINEMATIC HERO */}
      <header className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80"
          alt="Friends Tours & Travels highway journeys"
          className="page-hero-bg"
        />
        <div className="page-hero-scrim" />

        <div className="page-hero-content">
          <nav className="page-breadcrumbs" aria-label="Breadcrumb">
            <span className="page-breadcrumb-link" onClick={() => onNavigate('/')}>Home</span>
            <span>/</span>
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>About Us</span>
          </nav>

          <div className="page-eyebrow">
            <Sparkles size={11} />
            <span>WHO WE ARE</span>
          </div>

          <h1 className="page-title">ABOUT FRIENDS TOURS &amp; TRAVELS</h1>

          <p className="page-subtitle">
            Bangalore's trusted travel partner for employee transportation, airport transfers, local city rentals, shuttle services, and Karnataka outstation journeys.
          </p>
        </div>
      </header>

      {/* 2. EDITORIAL "MORE THAN A RIDE" SECTION */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-main-grid">

            {/* LEFT: Car Image with Floating Badge */}
            <div className="about-visual-col">
              <div className="about-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80"
                  alt="Friends Tours & Travels - Premium vehicle on scenic highway"
                  className="about-img-main"
                />
                {/* Floating Badge */}
                <div className="about-floating-badge">
                  <div className="about-badge-icon">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="about-badge-label">Premier Service</span>
                    <p className="about-badge-val">J.P. Nagar, Bangalore</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Headline + Description + 4 Core Services */}
            <div className="about-content-col">
              <h2 className="about-heading">
                MORE THAN A RIDE.
                <span className="about-heading-dark">A BETTER WAY TO TRAVEL.</span>
              </h2>

              <p className="about-text" style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '1rem' }}>
                Located at #18, 24th Main, 5th Phase, J.P. Nagar, Bangalore, Friends Tours &amp; Travels delivers dependable, punctual, and transparent mobility services.
              </p>

              <p className="about-text">
                Whether you need scheduled daily employee transportation for your tech park workforce, 24/7 Kempegowda Airport transfers with flight delay tracking, hourly city packages (4hr/8hr), or outstation road trips across Karnataka (min 300 km/day), our priority is always your safety, comfort, and schedule.
              </p>

              <p className="about-text" style={{ marginBottom: 20 }}>
                With clean, yellow-board air-conditioned vehicles, experienced highway chauffeurs, and official transparent billing (rates effective 01 Jan 2026), we ensure every mile is seamless and stress-free.
              </p>

              {/* 2×2 Service Highlights Grid (4 Core Services) */}
              <div className="about-highlights-grid">
                <div className="about-highlight-item">
                  <span className="about-highlight-num">01</span>
                  <div>
                    <p className="about-highlight-name">EMPLOYEE TRANSPORTATION</p>
                    <p className="about-highlight-desc">Scheduled shift pickups, tech park mobility, and monthly corporate GST billing.</p>
                  </div>
                </div>
                <div className="about-highlight-item">
                  <span className="about-highlight-num">02</span>
                  <div>
                    <p className="about-highlight-name">AIRPORT TRANSPORT</p>
                    <p className="about-highlight-desc">Guaranteed on-time Kempegowda Airport transfers with live flight tracking.</p>
                  </div>
                </div>
                <div className="about-highlight-item">
                  <span className="about-highlight-num">03</span>
                  <div>
                    <p className="about-highlight-name">LOCAL &amp; OUTSTATION RENTALS</p>
                    <p className="about-highlight-desc">4hr/8hr local city packages and outstation journeys (min 300 km/day).</p>
                  </div>
                </div>
                <div className="about-highlight-item">
                  <span className="about-highlight-num">04</span>
                  <div>
                    <p className="about-highlight-name">SHUTTLE SERVICES</p>
                    <p className="about-highlight-desc">Dedicated office shuttles, event transit, and 12–17 seater Tempo Travellers.</p>
                  </div>
                </div>
              </div>

              <div className="about-cta-row">
                <button className="btn-about-story" onClick={() => onNavigate('/contact?intent=booking')}>
                  <span>Book Your Journey</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MAIN STORY & PHILOSOPHY */}
      <main className="page-main-section">
        <div className="page-max-width">
          
          {/* Story & Philosophy Grid */}
          <div className="page-grid-2col">
            
            {/* Left: Our Story Card */}
            <article className="page-content-card">
              <h2 className="page-section-title">
                <Compass size={22} />
                <span>OUR STORY</span>
              </h2>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: 14 }}>
                Friends Tours &amp; Travels was established in J.P. Nagar, Bangalore, with a clear focus: to deliver dependable, stress-free transportation for corporate organizations, local residents, and leisure travelers.
              </p>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-main)', margin: 0 }}>
                From enterprise shift shuttles to airport drops and scenic weekend getaways to Mysore, Coorg, and Chikkamagaluru, our focus is always on punctuality, safety, and transparent pricing.
              </p>
            </article>

            {/* Right: Our Approach Card */}
            <article className="page-content-card">
              <h2 className="page-section-title">
                <ShieldCheck size={22} />
                <span>OUR APPROACH</span>
              </h2>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: 14 }}>
                We believe in straightforward, transparent travel. No hidden surcharges, no surprise toll fees, and zero unverified drivers.
              </p>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-main)', margin: 0 }}>
                Every vehicle in our commercial fleet is yellow-board registered, routinely inspected, and operated by polite, background-verified chauffeurs with comprehensive route familiarity across Karnataka.
              </p>
            </article>

          </div>

          {/* Core Pillars Grid */}
          <section style={{ marginTop: 24 }}>
            <h2 className="page-section-title" style={{ textAlign: 'center', justifyContent: 'center', marginBottom: 28 }}>
              WHY CHOOSE FRIENDS TOURS &amp; TRAVELS
            </h2>

            <div className="page-grid-3col">
              
              <div className="page-content-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <MapPin size={20} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>J.P. Nagar &amp; Bangalore Hub</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Centrally based in J.P. Nagar 5th Phase with extensive dispatch coverage across Bangalore city and all major tech parks.
                </p>
              </div>

              <div className="page-content-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Users size={20} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Verified Chauffeurs</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Polite, background-verified chauffeurs trained for safe highway driving, shift punctuality, and courteous client handling.
                </p>
              </div>

              <div className="page-content-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Car size={20} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Official 2026 Tariff</h3>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Fixed transparent pricing with zero surge charges. Verified per-km and per-hour rates for local and outstation trips.
                </p>
              </div>

            </div>
          </section>

          {/* CTA Banner */}
          <div className="page-cta-banner">
            <div>
              <h3 className="page-cta-title">READY TO PLAN YOUR NEXT JOURNEY?</h3>
              <p className="page-cta-desc">
                Contact our 24/7 concierge desk at {BRAND.phoneRaw} for custom quotes, corporate retainers, or outstation bookings.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn-page-cta-primary"
                onClick={() => onNavigate('/contact?intent=booking')}
              >
                <span>Book Your Journey</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </main>

      <CorporateClientsSection onContactClick={() => onNavigate('/contact?intent=booking')} />

      <Footer
        onNavClick={onNavigate}
        onBookClick={onBookNowClick}
      />
    </div>
  );
};
