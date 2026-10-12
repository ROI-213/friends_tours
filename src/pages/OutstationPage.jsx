import React, { useState, useEffect } from 'react';
import { 
  Compass 
} from 'lucide-react';
import { BRAND } from '../constants/branding';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ContactSection } from '../components/home/ContactSection';
import { OutstationDestinations } from '../components/home/OutstationDestinations';
import { OutstationTransferSection } from '../components/outstation/OutstationTransferSection';
import { useToast } from '../context/ToastContext';

export const OutstationPage = ({ onNavigate, onBookNowClick, onEnquireRoute, onOpenBookingModal }) => {
  const { addToast } = useToast();
  const [prefilled, setPrefilled] = useState({ travelType: 'Outstation', destination: '' });

  const handleEnquireDestination = (dest) => {
    const destName = dest.name || dest.title || '';
    const state = dest.state ? ` (${dest.state})` : '';
    const priceText = dest.starting_price ? `Starting at ₹${Number(dest.starting_price).toLocaleString('en-IN')}` : '';
    setPrefilled({
      travelType: 'Outstation',
      destination: `${destName}${state}`,
      message: `Enquiry for trip to ${destName}. ${dest.distance || ''} ${priceText}`.trim()
    });
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleOutstationBooking = (bookingData) => {
    setPrefilled({
      travelType: 'Outstation',
      pickupLocation: bookingData.pickupLocation,
      destination: bookingData.destination,
      vehiclePreference: bookingData.vehiclePreference,
      message: `Selected Route: ${bookingData.description}`
    });

    addToast({
      message: `Selected ${bookingData.title} (${bookingData.badge})`,
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Karnataka Outstation Cabs & South India Tours | ${BRAND.name}`;
  }, []);

  return (
    <div className="page-container" aria-label="Karnataka Outstation Travel">
      <Navbar
        activeSection="services"
        onNavClick={onNavigate}
        onBookNowClick={onBookNowClick}
      />

      {/* 1. HERO */}
      <header className="page-hero">
        <img
          src="/gallery/innova_crysta_highway.jpg"
          alt="Karnataka outstation travel routes"
          className="page-hero-bg"
        />
        <div className="page-hero-scrim" />

        <div className="page-hero-content">
          <nav className="page-breadcrumbs" aria-label="Breadcrumb">
            <span className="page-breadcrumb-link" onClick={() => onNavigate('/')}>Home</span>
            <span>/</span>
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Outstation Travel</span>
          </nav>

          <div className="page-eyebrow">
            <Compass size={11} />
            <span>HIGHWAY TARIFF &amp; EXPLORATIONS</span>
          </div>

          <h1 className="page-title">KARNATAKA OUTSTATION CABS</h1>

          <p className="page-subtitle">
            Transparent round-trip and one-way outstation cab rentals from Bangalore to South India's hill stations, coastal routes, and heritage capitals.
          </p>
        </div>
      </header>

      {/* 2. OUTSTATION TARIFF CALCULATOR & RATES */}
      <OutstationTransferSection onBookOutstation={handleOutstationBooking} />

      {/* 3. OUTSTATION DESTINATIONS */}
      <OutstationDestinations
        onEnquireDestination={handleEnquireDestination}
        onExploreDestination={handleEnquireDestination}
      />

      {/* 4. ENQUIRY FORM */}
      <ContactSection
        key={prefilled.destination || 'default'}
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
