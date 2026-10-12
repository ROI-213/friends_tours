import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  Quote, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  Clock, 
  Users, 
  Car,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { BRAND } from '../constants/branding';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { TESTIMONIALS_DATA } from '../data/testimonialsData.js';
import { api } from '../lib/api.js';
import { useDataSync } from '../hooks/useDataSync';

const CATEGORIES = ['ALL', 'AIRPORT', 'LOCAL', 'OUTSTATION', 'CORPORATE', 'FAMILY'];

export const TestimonialsPage = ({ onNavigate, onBookNowClick }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [testimonialsList, setTestimonialsList] = useState(TESTIMONIALS_DATA);

  const fetchTestimonials = React.useCallback(() => {
    api.getTestimonials().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map((t, idx) => ({
          id: t.id || idx,
          name: t.customer_name || t.name || 'Verified Guest',
          location: t.location || 'Bangalore, India',
          tripType: (t.trip_type || 'OUTSTATION').toUpperCase(),
          tripTitle: t.trip_title || `${t.trip_type || 'Travel'} Journey with Friends Tours`,
          vehicle: t.vehicle_used || 'Chauffeur Driven Car',
          rating: t.rating || 5,
          isFeatured: t.is_featured || idx === 0,
          quote: t.review || t.quote || '',
          date: t.travel_date || 'Verified Booking'
        }));
        setTestimonialsList(normalized);
      }
    }).catch((err) => {
      console.warn('Notice: Using default testimonials data:', err.message);
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Traveller Experiences & Testimonials | ${BRAND.name}`;
    fetchTestimonials();
  }, [fetchTestimonials]);

  useDataSync('testimonials', fetchTestimonials);

  const filtered = activeCategory === 'ALL' 
    ? testimonialsList 
    : testimonialsList.filter((item) => (item.tripType || '').includes(activeCategory));

  const featured = testimonialsList.find(t => t.isFeatured) || testimonialsList[0];

  return (
    <div className="page-container" aria-label="Customer Experiences and Reviews">
      <Navbar
        activeSection="testimonials"
        onNavClick={onNavigate}
        onBookNowClick={onBookNowClick}
      />

      {/* 1. CINEMATIC HERO */}
      <header className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80"
          alt="Traveller experiences on the road"
          className="page-hero-bg"
        />
        <div className="page-hero-scrim" />

        <div className="page-hero-content">
          <nav className="page-breadcrumbs" aria-label="Breadcrumb">
            <span className="page-breadcrumb-link" onClick={() => onNavigate('/')}>Home</span>
            <span>/</span>
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Testimonials</span>
          </nav>

          <div className="page-eyebrow">
            <Sparkles size={11} />
            <span>TRAVELLER EXPERIENCES</span>
          </div>

          <h1 className="page-title">
            THE JOURNEY IS BETTER<br />WHEN YOU TRAVEL WITH CONFIDENCE.
          </h1>

          <p className="page-subtitle">
            Discover what travellers value about their journeys with Friends Tours &amp; Travels across Bangalore, Kempegowda Airport, and Karnataka outstation routes.
          </p>
        </div>
      </header>

      {/* 2. FEATURED TESTIMONIAL SPOTLIGHT */}
      <section className="page-main-section" style={{ paddingBottom: 0 }}>
        <div className="page-max-width">
          
          <div className="featured-testimonial-hero">
            <div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>

              <Quote size={36} color="var(--color-primary)" opacity={0.35} style={{ marginBottom: 12 }} />

              <p className="featured-quote-text">
                "{featured.quote}"
              </p>

              <div className="featured-quote-author">
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--color-pink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.1rem' }}>
                  VR
                </div>
                <div>
                  <div className="featured-author-name">{featured.name}</div>
                  <div className="featured-author-meta">{featured.tripTitle} • {featured.location}</div>
                </div>
              </div>
            </div>

            <div className="service-block-img-wrap" style={{ borderRadius: 24, minHeight: 300 }}>
              <img
                src="/gallery/innova_crysta_highway.jpg"
                alt="Family road trip in Innova Crysta"
                className="service-block-img"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. CATEGORY FILTER TABS */}
      <section className="rentalcars-controls-section">
        <div className="rentalcars-controls-container">
          <div className="rentalcars-filter-row" role="tablist" aria-label="Testimonial categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn-rental-filter ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EDITORIAL TESTIMONIALS GRID */}
      <main className="page-main-section">
        <div className="page-max-width">
          
          <div className="editorial-testimonials-grid">
            {filtered.map((item, idx) => (
              <article
                key={item.id}
                className={`testimonial-card-editorial ${idx === 0 && filtered.length > 2 ? 'span-2col' : ''}`}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                    <span className="rental-card-badge" style={{ fontSize: '0.625rem', position: 'static' }}>
                      {item.tripType}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-main)', fontStyle: 'italic', marginBottom: 20 }}>
                    "{item.quote}"
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0A1938', margin: '0 0 2px' }}>{item.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      <MapPin size={11} />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', display: 'block' }}>{item.tripTitle}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{item.vehicle}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 5. TRAVEL STORY STRIP — WHY CUSTOMERS COME BACK */}
          <section className="testimonials-trust-strip">
            <div className="trust-pillar-card">
              <Compass size={28} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '4px 0 2px' }}>EASY PLANNING</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                Instant booking on WhatsApp or phone with verified chauffeur details dispatched well in advance.
              </p>
            </div>

            <div className="trust-pillar-card">
              <Car size={28} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '4px 0 2px' }}>COMFORTABLE TRAVEL</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                Clean, climate-controlled interiors with polite, experienced highway drivers for relaxed family journeys.
              </p>
            </div>

            <div className="trust-pillar-card">
              <ShieldCheck size={28} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '4px 0 2px' }}>LOCAL EXPERIENCE</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                Comprehensive familiarity with Bangalore shortcuts, airport routes, and South Indian tourist circuits.
              </p>
            </div>
          </section>

          {/* 6. TESTIMONIAL FINAL CTA */}
          <div className="page-cta-banner">
            <div>
              <h3 className="page-cta-title">READY TO PLAN YOUR OWN JOURNEY?</h3>
              <p className="page-cta-desc">
                Join hundreds of satisfied travellers across Bangalore who trust Friends Tours &amp; Travels.
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
                onClick={() => onNavigate('/contact')}
              >
                <span>Contact Us</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer
        onNavClick={onNavigate}
        onBookClick={onBookNowClick}
      />
    </div>
  );
};
