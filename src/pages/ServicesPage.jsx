import React, { useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Plane, 
  Briefcase, 
  Compass, 
  MapPin, 
  Car, 
  ShieldCheck, 
  Check, 
  Clock, 
  Users,
  MessageCircle,
  Phone,
  FileText
} from 'lucide-react';
import { BRAND } from '../constants/branding';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { OfficialTariffSection } from '../components/home/OfficialTariffSection';
import { CorporateClientsSection } from '../components/home/CorporateClientsSection';
import { api } from '../lib/api.js';
import { useDataSync } from '../hooks/useDataSync';

export const ServicesPage = ({ onNavigate, onBookNowClick, onOpenTariffModal }) => {
  const [services, setServices] = React.useState([]);

  const fetchServices = React.useCallback(() => {
    api.getServices().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setServices(data);
      }
    }).catch((err) => {
      console.warn('Notice: Using static services on ServicesPage:', err.message);
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Travel & Mobility Services in Bangalore | ${BRAND.name}`;
    fetchServices();
  }, [fetchServices]);

  useDataSync('services', fetchServices);

  const handleTalkToUs = () => {
    window.open(`https://wa.me/${BRAND.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Friends Tours, I would like to inquire about your travel services.')}`, '_blank');
  };

  return (
    <div className="page-container" aria-label="Bangalore Travel Services Hub">
      <Navbar
        activeSection="services"
        onNavClick={onNavigate}
        onBookNowClick={onBookNowClick}
      />

      {/* 1. CINEMATIC HERO */}
      <header className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1920&q=80"
          alt="Bangalore travel services"
          className="page-hero-bg"
        />
        <div className="page-hero-scrim" />

        <div className="page-hero-content">
          <nav className="page-breadcrumbs" aria-label="Breadcrumb">
            <span className="page-breadcrumb-link" onClick={() => onNavigate('/')}>Home</span>
            <span>/</span>
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Services</span>
          </nav>

          <div className="page-eyebrow">
            <Sparkles size={11} />
            <span>MOBILITY SOLUTIONS</span>
          </div>

          <h1 className="page-title">
            FRIENDS TOURS &amp; TRAVELS<br />CORE SERVICES
          </h1>

          <p className="page-subtitle">
            From daily employee transportation and airport transfers to flexible local hourly rentals, shuttle fleets, and Karnataka outstation road trips.
          </p>

          <div className="page-hero-actions">
            <button
              className="btn-page-cta-primary"
              onClick={() => {
                const el = document.getElementById('services-list');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>View 4 Core Services</span>
              <ArrowRight size={14} />
            </button>

            <button
              className="btn-vehichero-secondary"
              onClick={() => {
                const el = document.getElementById('official-price-list');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <FileText size={14} />
              <span>Official Price List</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. 4 CORE SERVICES DETAILED BLOCKS */}
      <main id="services-list" className="page-main-section">
        <div className="page-max-width">
          
          {services.length > 0 ? (
            services.map((s, idx) => {
              const isReversed = idx % 2 === 1;
              const feats = Array.isArray(s.features) ? s.features : [];
              return (
                <article key={s.id} className={`service-feature-block ${isReversed ? 'reversed' : ''}`}>
                  {!isReversed && (
                    <div className="service-block-img-wrap">
                      <img
                        src={s.image || '/services/employee-transport.jpg'}
                        alt={s.title}
                        className="service-block-img"
                      />
                    </div>
                  )}
                  <div className="service-block-content">
                    <span className="service-block-badge">{s.badge || `SERVICE 0${idx + 1}`}</span>
                    <h2 className="service-block-title">{s.title}</h2>
                    <p className="service-block-desc">{s.full_desc || s.short_desc}</p>

                    {feats.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '0 0 24px 0' }}>
                        {feats.map((feat, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600 }}>
                            <span style={{ color: 'var(--color-primary)' }}>✓</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      className="btn-page-cta-primary"
                      style={{ background: 'var(--color-primary)', color: '#FFFFFF', width: 'fit-content' }}
                      onClick={() => onNavigate(s.target_route || '/contact')}
                    >
                      <span>{s.title.includes('Airport') ? 'Airport Transport Details' : s.title.includes('Employee') ? 'Corporate Mobility Details' : 'Details & Booking'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  {isReversed && (
                    <div className="service-block-img-wrap">
                      <img
                        src={s.image || '/services/employee-transport.jpg'}
                        alt={s.title}
                        className="service-block-img"
                      />
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <>
              {/* SERVICE 01: EMPLOYEE TRANSPORTATION */}
              <article className="service-feature-block">
                <div className="service-block-img-wrap">
                  <img
                    src="/services/employee-transport.jpg"
                    alt="Bangalore employee transportation service"
                    className="service-block-img"
                  />
                </div>
                <div className="service-block-content">
                  <span className="service-block-badge">SERVICE 01 • CORPORATE MOBILITY</span>
                  <h2 className="service-block-title">EMPLOYEE TRANSPORTATION</h2>
                  <p className="service-block-desc">
                    Dedicated daily employee pickup and drop services for Bangalore tech parks (Whitefield, Electronic City, Manyata, ORR), IT/BPO companies, and corporate offices. Includes centralized monthly GST billing, automated MIS logs, and vetted chauffeurs.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '0 0 24px 0' }}>
                    {['Scheduled Shift Pickups', 'Tech Park Transit', 'Monthly GST Invoicing', 'Vetted & Uniformed Drivers', '24/7 Dispatch Desk'].map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--color-primary)' }}>✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn-page-cta-primary"
                    style={{ background: 'var(--color-primary)', color: '#FFFFFF', width: 'fit-content' }}
                    onClick={() => onNavigate('/services/corporate-travel')}
                  >
                    <span>Corporate Mobility Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>

              {/* SERVICE 02: AIRPORT TRANSPORT */}
              <article className="service-feature-block reversed">
                <div className="service-block-content">
                  <span className="service-block-badge">SERVICE 02 • 24/7 AIRPORT SERVICE</span>
                  <h2 className="service-block-title">AIRPORT TRANSPORT</h2>
                  <p className="service-block-desc">
                    Reliable airport pickup and drop services connecting Kempegowda International Airport (BLR) with all Bangalore areas. Real-time flight tracking ensures chauffeurs adjust automatically for flight delays with zero waiting surcharges.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '0 0 24px 0' }}>
                    {['Kempegowda Airport Drops', 'Terminal 1 & 2 Pickups', 'Live Flight Delay Tracking', 'Expressway Toll Management', 'Luggage Handling Assistance'].map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--color-primary)' }}>✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn-page-cta-primary"
                    style={{ background: 'var(--color-primary)', color: '#FFFFFF', width: 'fit-content' }}
                    onClick={() => onNavigate('/services/airport-transfer')}
                  >
                    <span>Airport Transport Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
                <div className="service-block-img-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80"
                    alt="Kempegowda airport cab service"
                    className="service-block-img"
                  />
                </div>
              </article>

              {/* SERVICE 03: LOCAL AND OUTSTATION RENTALS */}
              <article className="service-feature-block">
                <div className="service-block-img-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
                    alt="Local and outstation car rentals"
                    className="service-block-img"
                  />
                </div>
                <div className="service-block-content">
                  <span className="service-block-badge">SERVICE 03 • HOURLY &amp; HIGHWAY</span>
                  <h2 className="service-block-title">LOCAL AND OUTSTATION RENTALS</h2>
                  <p className="service-block-desc">
                    Flexible hourly rentals (4hr/40km &amp; 8hr/80km) for Bangalore city transit, business errands, and shopping, plus outstation highway rentals (min 300 km/day) to Mysore, Coorg, Ooty, Chikmagalur, Hampi, and South India.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '0 0 24px 0' }}>
                    {['4hr/40km Half Day', '8hr/80km Full Day', 'Outstation Min 300km/Day', 'Transparent Per-Km Rates', 'Highway Verified Drivers'].map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--color-primary)' }}>✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      className="btn-page-cta-primary"
                      style={{ background: 'var(--color-primary)', color: '#FFFFFF', width: 'fit-content' }}
                      onClick={() => onNavigate('/local-packages')}
                    >
                      <span>Local Packages</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      className="btn-vehichero-secondary"
                      style={{ width: 'fit-content' }}
                      onClick={() => onNavigate('/outstation')}
                    >
                      <span>Outstation Trips</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>

              {/* SERVICE 04: SHUTTLE SERVICES */}
              <article className="service-feature-block reversed">
                <div className="service-block-content">
                  <span className="service-block-badge">SERVICE 04 • GROUP &amp; EVENT FLEET</span>
                  <h2 className="service-block-title">SHUTTLE SERVICES</h2>
                  <p className="service-block-desc">
                    Cost-effective point-to-point shuttle transportation for corporate delegations, tech conferences, wedding guest convoys, and group tours with 12–17 seater AC &amp; Non-AC Tempo Travellers.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '0 0 24px 0' }}>
                    {['Corporate Office Shuttles', 'Wedding & Event Transfers', '12–17 Seater Tempo AC', 'Conference Transit', 'Large Group Economy'].map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--color-primary)' }}>✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn-page-cta-primary"
                    style={{ background: 'var(--color-primary)', color: '#FFFFFF', width: 'fit-content' }}
                    onClick={() => onNavigate('/rental-cars')}
                  >
                    <span>View Fleet &amp; Shuttles</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
                <div className="service-block-img-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
                    alt="Shuttle services in Bangalore"
                    className="service-block-img"
                  />
                </div>
              </article>
            </>
          )}

        </div>
      </main>

      {/* 3. OFFICIAL TARIFF SECTION EMBED */}
      <OfficialTariffSection onBookVehicle={(data) => {
        onNavigate('/contact?intent=booking');
      }} />

      {/* 4. CORPORATE CLIENTS & PARTNERS */}
      <CorporateClientsSection onContactClick={() => onNavigate('/contact?intent=booking')} />

      {/* 5. FINAL CTA BANNER */}
      <section className="page-main-section" style={{ paddingTop: 0 }}>
        <div className="page-max-width">
          <div className="page-cta-banner">
            <div>
              <h3 className="page-cta-title">READY TO PLAN YOUR JOURNEY?</h3>
              <p className="page-cta-desc">
                Speak directly with our 24/7 concierge desk at J.P. Nagar to confirm your route, vehicle allocation, and guaranteed best pricing.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn-page-cta-primary"
                onClick={() => onNavigate('/contact?intent=booking')}
              >
                <span>Book Now</span>
                <ArrowRight size={14} />
              </button>

              <button
                className="btn-vehichero-secondary"
                onClick={handleTalkToUs}
              >
                <MessageCircle size={15} />
                <span>Talk to Our Team</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer
        onNavClick={onNavigate}
        onBookClick={onBookNowClick}
      />
    </div>
  );
};
