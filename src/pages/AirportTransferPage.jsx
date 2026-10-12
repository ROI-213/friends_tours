import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Plane, 
  Clock, 
  ShieldCheck, 
  Car, 
  CheckCircle2, 
  MapPin,
  Luggage
} from 'lucide-react';
import { BRAND } from '../constants/branding';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ContactSection } from '../components/home/ContactSection';
import { AirportTransferSection } from '../components/airport/AirportTransferSection';
import { useToast } from '../context/ToastContext';

export const AirportTransferPage = ({ onNavigate, onBookNowClick, onOpenBookingModal }) => {
  const { addToast } = useToast();
  const [prefilledBooking, setPrefilledBooking] = useState({
    travelType: 'Airport Transfer',
    destination: 'Kempegowda International Airport (BLR)'
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Bangalore Airport Taxi & Kempegowda Airport Transfer | ${BRAND.name}`;
  }, []);

  const handleAirportBooking = (bookingData) => {
    setPrefilledBooking({
      travelType: 'Airport Transfer',
      pickupLocation: bookingData.pickupLocation,
      destination: bookingData.destination,
      vehiclePreference: bookingData.vehiclePreference,
      message: `Selected Route: ${bookingData.description}`
    });

    addToast({
      message: `Selected ${bookingData.pickupLocation} → ${bookingData.destination} (${bookingData.badge})`,
      type: 'info'
    });

    // Directly redirect and smoothly scroll to the booking form
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      const inputToFocus = contactEl.querySelector('#customer-name') || contactEl.querySelector('input');
      if (inputToFocus) setTimeout(() => inputToFocus.focus(), 600);
    } else if (onNavigate) {
      onNavigate('/contact');
    }
  };

  return (
    <div className="page-container" aria-label="Bangalore Airport Transfers">
      <Navbar
        activeSection="services"
        onNavClick={onNavigate}
        onBookNowClick={onBookNowClick}
      />

      {/* 1. CINEMATIC HERO */}
      <header className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1920&q=80"
          alt="Bangalore airport taxi transfer"
          className="page-hero-bg"
        />
        <div className="page-hero-scrim" />

        <div className="page-hero-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <button
              onClick={() => onNavigate('/services')}
              className="btn-vehicledetail-back"
              aria-label="Back to Services"
            >
              <ArrowLeft size={14} />
              <span>Back to Services</span>
            </button>

            <nav className="page-breadcrumbs" aria-label="Breadcrumb">
              <span className="page-breadcrumb-link" onClick={() => onNavigate('/')}>Home</span>
              <span>/</span>
              <span className="page-breadcrumb-link" onClick={() => onNavigate('/services')}>Services</span>
              <span>/</span>
              <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Airport Transfer</span>
            </nav>
          </div>

          <div className="page-eyebrow">
            <Plane size={11} />
            <span>KEMPEGOWDA AIRPORT (BLR) SPECIALIST</span>
          </div>

          <h1 className="page-title">BANGALORE AIRPORT TRANSFERS</h1>

          <p className="page-subtitle">
            Fixed-price private airport transfers from major Bengaluru areas to Kempegowda International Airport (BLR). Choose your pickup area and vehicle to see your estimated fare.
          </p>
        </div>
      </header>

      {/* 2. ENQUIRY / BOOKING FORM (Displayed 1st in both desktop and mobile view, visual contact card omitted) */}
      <ContactSection
        hideVisualSide={true}
        hideHeader={true}
        prefilledData={prefilledBooking}
        onSubmitSuccess={(data) => {
          addToast({
            message: `Enquiry sent for ${data.destination}! We will call you shortly.`,
            type: 'success',
          });
        }}
      />

      {/* 3. AIRPORT CALCULATOR & FARE MATRIX SECTION */}
      <AirportTransferSection onBookTransfer={handleAirportBooking} />

      {/* 4. MAIN CONTENT (Overview & Process) */}
      <main className="page-main-section" style={{ paddingTop: 0 }}>
        <div className="page-max-width">
          
          {/* Overview & Key Highlights Grid */}
          <div className="page-grid-2col">
            
            <article className="page-content-card">
              <h2 className="page-section-title">
                <Clock size={20} />
                <span>FLIGHT TRACKING &amp; PUNCTUALITY</span>
              </h2>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: 14 }}>
                Catching an early morning flight or landing late at night? Our operations desk monitors real-time flight telemetry at Kempegowda International Airport (BLR).
              </p>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-main)', margin: 0 }}>
                If your flight is delayed, your assigned chauffeur adjusts their arrival time automatically at no extra cost. Your car is ready at the terminal pickup zone the moment you exit baggage claim.
              </p>
            </article>

            <article className="page-content-card">
              <h2 className="page-section-title">
                <ShieldCheck size={20} />
                <span>AIRPORT TRANSFER FEATURES</span>
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Flat transparent rates with no surge pricing',
                  'Kempegowda Airport expressway toll handling',
                  'Luggage assistance & clean air-conditioned cabs',
                  'Professional chauffeurs in verified attire',
                  'Instant booking confirmation with driver contact 2h before pickup'
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                    <CheckCircle2 size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

          </div>

          {/* Transfer Process Steps */}
          <section style={{ marginTop: 24 }}>
            <h2 className="page-section-title" style={{ textAlign: 'center', justifyContent: 'center', marginBottom: 28 }}>
              HOW OUR AIRPORT TRANSFER WORKS
            </h2>

            <div className="page-grid-3col">
              
              <div className="page-content-card" style={{ marginBottom: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>STEP 01</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '6px 0 10px' }}>Book Online or via WhatsApp</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Share your flight number, travel date, pickup address in Bangalore, and vehicle choice (Sedan or Innova).
                </p>
              </div>

              <div className="page-content-card" style={{ marginBottom: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>STEP 02</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '6px 0 10px' }}>Driver Details Dispatched</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Receive chauffeur name, contact number, and sanitized vehicle number 2 hours prior to scheduled departure.
                </p>
              </div>

              <div className="page-content-card" style={{ marginBottom: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>STEP 03</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '6px 0 10px' }}>Smooth Doorstep Transit</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Enjoy a relaxed, expressway journey directly to Terminal 1 or Terminal 2 without navigating parking hassles.
                </p>
              </div>

            </div>
          </section>

          {/* CTA Banner */}
          <div className="page-cta-banner">
            <div>
              <h3 className="page-cta-title">RESERVE YOUR AIRPORT TAXI TODAY</h3>
              <p className="page-cta-desc">
                Guaranteed on-time pickup for Kempegowda Airport transfers with 24/7 support.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn-page-cta-primary"
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Book Airport Taxi</span>
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
