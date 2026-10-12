import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Car, 
  Users, 
  CheckCircle2 
} from 'lucide-react';
import { BRAND } from '../constants/branding';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ContactSection } from '../components/home/ContactSection';
import { CorporatePricingSection } from '../components/corporate/CorporatePricingSection';
import { CorporateClientsSection } from '../components/home/CorporateClientsSection';
import { useToast } from '../context/ToastContext';

export const CorporateTravelPage = ({ onNavigate, onBookNowClick, onOpenBookingModal }) => {
  const { addToast } = useToast();
  const [prefilled, setPrefilled] = useState({ travelType: 'Corporate Travel', destination: 'Bangalore Corporate Mobility' });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Corporate Mobility & Executive Cabs Bangalore | ${BRAND.name}`;
  }, []);

  const handleCorporateQuote = (quoteData) => {
    setPrefilled({
      travelType: 'Corporate Travel',
      pickupLocation: quoteData.pickupLocation,
      destination: quoteData.destination,
      vehiclePreference: quoteData.vehiclePreference,
      message: `Selected Corporate Account: ${quoteData.description}`
    });

    addToast({
      message: `Selected ${quoteData.title}`,
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
    <div className="page-container" aria-label="Corporate Mobility Solutions">
      <Navbar
        activeSection="services"
        onNavClick={onNavigate}
        onBookNowClick={onBookNowClick}
      />

      {/* 1. CINEMATIC HERO */}
      <header className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=80"
          alt="Bangalore corporate mobility solutions"
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
              <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Corporate Travel</span>
            </nav>
          </div>

          <div className="page-eyebrow">
            <Briefcase size={11} />
            <span>BUSINESS MOBILITY PARTNER</span>
          </div>

          <h1 className="page-title">CORPORATE TRAVEL SOLUTIONS</h1>

          <p className="page-subtitle">
            Tailored transportation solutions for Bangalore enterprises, tech park corporate teams, visiting business delegations, and executive airport transit.
          </p>
        </div>
      </header>

      {/* 2. CORPORATE PRICING MATRIX & RETAINER CONTRACTS */}
      <CorporatePricingSection onRequestQuote={handleCorporateQuote} />

      {/* 3. MAIN CONTENT */}
      <main className="page-main-section" style={{ paddingTop: 0 }}>
        <div className="page-max-width">
          
          <div className="page-grid-2col">
            
            <article className="page-content-card">
              <h2 className="page-section-title">
                <Building2 size={20} />
                <span>TECH PARK &amp; ENTERPRISE MOBILITY</span>
              </h2>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: 14 }}>
                We partner with corporate firms across Whitefield, Manyata Tech Park, Electronic City, and Outer Ring Road to provide reliable employee and executive mobility.
              </p>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-main)', margin: 0 }}>
                Whether handling VIP client visits from Europe or the US, or managing inter-office transit across Bangalore, our executive fleet ensures punctuality, privacy, and acoustic comfort.
              </p>
            </article>

            <article className="page-content-card">
              <h2 className="page-section-title">
                <FileText size={20} />
                <span>CORPORATE PERKS &amp; BILLING</span>
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Centralized monthly invoicing with itemized GST invoices',
                  'Dedicated account manager for enterprise logistics',
                  'Background-checked chauffeurs in executive attire',
                  'Bottled water, mobile chargers & WiFi enabled cars upon request',
                  'Priority booking hotline with instant vehicle dispatch'
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                    <CheckCircle2 size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

          </div>

          {/* CTA Banner */}
          <div className="page-cta-banner">
            <div>
              <h3 className="page-cta-title">SETUP A CORPORATE TRAVEL ACCOUNT</h3>
              <p className="page-cta-desc">
                Speak with our business mobility desk for customized enterprise retainers and rates.
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
                <span>Request Corporate Quote</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </main>

      <CorporateClientsSection onContactClick={() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      <ContactSection
        prefilledData={prefilled}
        onSubmitSuccess={(data) => {
          addToast({
            message: `Enquiry sent for ${data.destination}! We will call you shortly.`,
            type: 'success',
          });
        }}
      />

      <Footer
        onNavClick={onNavigate}
        onBookClick={onBookNowClick}
      />
    </div>
  );
};
