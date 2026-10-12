import React, { useState, useEffect, useCallback } from 'react';
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
import { api } from '../lib/api.js';
import { useDataSync } from '../hooks/useDataSync';
import { useSiteSettings } from '../context/SiteSettingsContext';
import '../styles/about.css';

const DEFAULT_HIGHLIGHTS = [
  { num: '01', name: 'EMPLOYEE TRANSPORTATION', desc: 'Scheduled shift pickups, tech park mobility, and monthly corporate GST billing.' },
  { num: '02', name: 'AIRPORT TRANSPORT', desc: 'Guaranteed on-time Kempegowda Airport transfers with live flight tracking.' },
  { num: '03', name: 'LOCAL & OUTSTATION RENTALS', desc: '4hr/8hr local city packages and outstation journeys (min 300 km/day).' },
  { num: '04', name: 'SHUTTLE SERVICES', desc: 'Dedicated office shuttles, event transit, and 12–17 seater Tempo Travellers.' },
];

export const AboutPage = ({ onNavigate, onBookNowClick }) => {
  const { getSetting } = useSiteSettings();
  const [highlights, setHighlights] = useState(DEFAULT_HIGHLIGHTS);

  const aboutTitle = getSetting('about_title', 'MORE THAN A RIDE. A BETTER WAY TO TRAVEL.');
  const aboutStory = getSetting('about_story', 'Located at #18, 24th Main, 5th Phase, J.P. Nagar, Bangalore, Friends Tours & Travels delivers dependable, punctual, and transparent mobility services.');
  const statYears = getSetting('stat_years_exp', '15+');
  const statTrips = getSetting('stat_trips_completed', '50,000+');
  const statRating = getSetting('stat_client_rating', '4.9 / 5');

  let titleLine1 = aboutTitle;
  let titleLine2 = '';
  if (aboutTitle.includes('.')) {
    const parts = aboutTitle.split('.');
    titleLine1 = parts[0].trim() + (parts.length > 1 && parts[1].trim() ? '.' : '');
    titleLine2 = parts.slice(1).join('.').trim();
  } else {
    const words = aboutTitle.trim().split(/\s+/);
    if (words.length > 2) {
      const splitIdx = Math.ceil(words.length / 2);
      titleLine1 = words.slice(0, splitIdx).join(' ');
      titleLine2 = words.slice(splitIdx).join(' ');
    }
  }

  const fetchServices = useCallback(() => {
    api.getServices().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setHighlights(data.map((s, idx) => ({
          num: `0${idx + 1}`.slice(-2),
          name: s.title,
          desc: s.short_desc || s.full_desc || ''
        })));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `About Us | ${BRAND.name} J.P. Nagar Bangalore`;
    fetchServices();
  }, [fetchServices]);

  useDataSync('services', fetchServices);

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
                {titleLine1}{' '}
                {titleLine2 && <span className="about-heading-dark">{titleLine2}</span>}
              </h2>

              <p className="about-text" style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '1rem' }}>
                {aboutStory}
              </p>

              {/* Dynamic Stats Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
                margin: '16px 0 20px',
                padding: '14px 16px',
                background: '#f8fafc',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary, #0D256C)', lineHeight: 1.1 }}>{statYears}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>Years Exp.</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FA4616', lineHeight: 1.1 }}>{statTrips}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>Trips Completed</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary, #0D256C)', lineHeight: 1.1 }}>{statRating}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>Customer Rating</div>
                </div>
              </div>

              <p className="about-text">
                Whether you need scheduled daily employee transportation for your tech park workforce, 24/7 Kempegowda Airport transfers with flight delay tracking, hourly city packages (4hr/8hr), or outstation road trips across Karnataka (min 300 km/day), our priority is always your safety, comfort, and schedule.
              </p>

              <p className="about-text" style={{ marginBottom: 20 }}>
                With clean, yellow-board air-conditioned vehicles, experienced highway chauffeurs, and official transparent billing (rates effective 01 Jan 2026), we ensure every mile is seamless and stress-free.
              </p>

              {/* 2×2 Service Highlights Grid (Dynamic from Database) */}
              <div className="about-highlights-grid">
                {highlights.map((h, i) => (
                  <div key={i} className="about-highlight-item">
                    <span className="about-highlight-num">{h.num}</span>
                    <div>
                      <p className="about-highlight-name">{h.name}</p>
                      <p className="about-highlight-desc">{h.desc}</p>
                    </div>
                  </div>
                ))}
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
