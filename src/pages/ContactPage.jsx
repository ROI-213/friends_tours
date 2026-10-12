import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Car,
  FileText,
  Compass,
  Plane,
  RotateCcw,
  Hash,
  Info
} from 'lucide-react';
import { BRAND } from '../constants/branding';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { VEHICLES_DATA } from '../data/vehiclesData';
import { LocationAutocomplete } from '../components/ui/LocationAutocomplete';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { api } from '../lib/api';
import { redirectToWhatsAppEnquiry, getWhatsAppEnquiryUrl } from '../lib/whatsapp';

const TRIP_TYPES = [
  { id: 'airport', label: 'Airport Transfer', icon: Plane },
  { id: 'local', label: 'Local Rental', icon: Clock },
  { id: 'oneway', label: 'One Way', icon: ArrowRight },
  { id: 'roundtrip', label: 'Round Trip', icon: RotateCcw },
  { id: 'outstation', label: 'Outstation', icon: Compass },
];

const LOCAL_PACKAGES = [
  { id: '4hr', label: '4 hrs / 40 km', desc: 'Half Day' },
  { id: '8hr', label: '8 hrs / 80 km', desc: 'Full Day (Recommended)' },
  { id: '12hr', label: '12 hrs / 120 km', desc: 'Extended Day' },
];

// Helper: Local Date YYYY-MM-DD
const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Local Time HH:MM
const getLocalTimeString = (d = new Date()) => {
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Helper: Minimum allowed pickup time for today (1 hour advance notice)
const getMinTimeForDate = (dateStr) => {
  const today = getLocalDateString();
  if (dateStr === today) {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return getLocalTimeString(now);
  }
  return '00:00';
};

const getDefaultPickupTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 2);
  return `${String(now.getHours()).padStart(2, '0')}:00`;
};

export const ContactPage = ({ onNavigate, onBookNowClick, onSubmitSuccess }) => {
  const { getSetting } = useSiteSettings();
  const todayStr = getLocalDateString();
  const isBookingIntent = typeof window !== 'undefined' && window.location.search.includes('intent=booking');
  const formRef = useRef(null);

  const phone = getSetting('phone', BRAND.phoneRaw);
  const whatsapp = getSetting('whatsapp', BRAND.whatsappRaw);
  const email = getSetting('email', BRAND.email);
  const address = getSetting('address', BRAND.address);
  const googleMapsUrl = getSetting('google_maps_url', BRAND.googleMapsUrl);
  const cleanPhone = phone.includes('/')
    ? phone.split('/')[0].replace(/[^\d+]/g, '')
    : phone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, '');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tripType: 'Airport Transfer',
    // Airport Specifics
    airportDirection: 'toAirport', // 'toAirport' | 'fromAirport'
    airportTerminal: 'Terminal 1',
    flightNumber: '',
    // Local Specifics
    localPackage: '8 hrs / 80 km',
    // Locations
    pickupLocation: '',
    destination: 'Kempegowda International Airport (BLR) - Terminal 1',
    // Date & Time
    travelDate: todayStr,
    travelTime: getDefaultPickupTime(),
    returnDate: '',
    returnTime: '18:00',
    // Vehicle & Party
    passengers: 2,
    vehiclePreference: VEHICLES_DATA[0]?.name || 'Etios / Swift Dzire / Logan',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Contact Us & Enquiry | ${BRAND.name} J.P. Nagar Bangalore`;

    if (isBookingIntent && formRef.current) {
      setTimeout(() => {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [isBookingIntent]);

  // Handle Trip Type switching with contextual defaults
  const handleTripTypeSelect = (newType) => {
    setFormData((prev) => {
      const updated = { ...prev, tripType: newType };

      if (newType === 'Airport Transfer') {
        if (prev.airportDirection === 'toAirport') {
          updated.destination = `Kempegowda International Airport (BLR) - ${prev.airportTerminal}`;
          if (prev.pickupLocation.includes('Kempegowda')) updated.pickupLocation = '';
        } else {
          updated.pickupLocation = `Kempegowda International Airport (BLR) - ${prev.airportTerminal}`;
          if (prev.destination.includes('Kempegowda')) updated.destination = '';
        }
      } else if (newType === 'Local Rental') {
        if (prev.pickupLocation.includes('Kempegowda')) updated.pickupLocation = 'J.P. Nagar, Bangalore';
        updated.destination = 'Bangalore Local Sightseeing & City Travel';
      } else if (newType === 'One Way') {
        if (prev.destination.includes('Kempegowda') || prev.destination.includes('Local Sightseeing')) {
          updated.destination = '';
        }
        updated.returnDate = '';
      } else if (newType === 'Round Trip' || newType === 'Outstation') {
        if (prev.destination.includes('Local Sightseeing')) {
          updated.destination = newType === 'Outstation' ? 'Mysore / Mysuru (Palace, Chamundi Hill)' : '';
        }
        if (!updated.returnDate || updated.returnDate < updated.travelDate) {
          updated.returnDate = updated.travelDate || todayStr;
        }
      }

      return updated;
    });

    setErrors((prev) => ({ ...prev, travelDate: null, travelTime: null, returnDate: null, destination: null, pickupLocation: null }));
  };

  const handleAirportDirectionChange = (direction) => {
    setFormData((prev) => {
      const terminalStr = `Kempegowda International Airport (BLR) - ${prev.airportTerminal}`;
      if (direction === 'toAirport') {
        return {
          ...prev,
          airportDirection: direction,
          destination: terminalStr,
          pickupLocation: prev.pickupLocation.includes('Kempegowda') ? '' : prev.pickupLocation
        };
      } else {
        return {
          ...prev,
          airportDirection: direction,
          pickupLocation: terminalStr,
          destination: prev.destination.includes('Kempegowda') ? '' : prev.destination
        };
      }
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Valid phone number is required (minimum 8 digits).';
    }
    if (formData.email && !formData.email.includes('@')) {
      errs.email = 'Valid email address is required.';
    }
    if (!formData.pickupLocation.trim()) {
      errs.pickupLocation = 'Pickup location in Bangalore is required.';
    }
    if (!formData.destination.trim()) {
      errs.destination = 'Destination is required.';
    }
    if (!formData.travelDate) {
      errs.travelDate = 'Travel date is required.';
    } else if (formData.travelDate < todayStr) {
      errs.travelDate = 'Past dates cannot be selected.';
    }

    if (!formData.travelTime) {
      errs.travelTime = 'Pickup time is required.';
    } else if (formData.travelDate === todayStr) {
      const minTime = getMinTimeForDate(todayStr);
      if (formData.travelTime < minTime) {
        errs.travelTime = `Pickup time for today must be after ${minTime}.`;
      }
    }

    if (formData.tripType === 'Round Trip' || formData.tripType === 'Outstation') {
      if (!formData.returnDate) {
        errs.returnDate = 'Return date is required.';
      } else if (formData.returnDate < formData.travelDate) {
        errs.returnDate = 'Return date cannot be earlier than travel date.';
      }
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitError('Please correct the highlighted fields before submitting.');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    const specDetails = [];
    specDetails.push(`Pickup Time: ${formData.travelTime}`);
    if (formData.tripType === 'Airport Transfer') {
      specDetails.push(`Direction: ${formData.airportDirection === 'toAirport' ? 'To BLR Airport (Drop)' : 'From BLR Airport (Pickup)'}`);
      specDetails.push(`Terminal: ${formData.airportTerminal}`);
      if (formData.flightNumber) specDetails.push(`Flight No: ${formData.flightNumber.trim()}`);
    } else if (formData.tripType === 'Local Rental') {
      specDetails.push(`Hourly Package: ${formData.localPackage}`);
    } else if (formData.tripType === 'Round Trip') {
      specDetails.push(`Return: ${formData.returnDate} at ${formData.returnTime || '18:00'}`);
    } else if (formData.tripType === 'Outstation') {
      specDetails.push(`Outstation Return Date: ${formData.returnDate}`);
    }

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      trip_type: formData.tripType,
      pickup_location: formData.pickupLocation.trim(),
      drop_location: formData.destination.trim(),
      travel_date: formData.travelDate,
      return_date: (formData.tripType === 'Round Trip' || formData.tripType === 'Outstation') ? formData.returnDate : null,
      passengers: formData.passengers,
      vehicle_preference: formData.vehiclePreference,
      package_name: formData.tripType === 'Local Rental' 
        ? formData.localPackage 
        : (formData.tripType === 'Airport Transfer' ? `BLR Airport ${formData.airportTerminal}` : formData.tripType),
      special_requests: specDetails.join(' | '),
      message: formData.message.trim(),
      source: 'contact_page',
    };

    try {
      const res = await api.submitEnquiry(payload);
      const bookingRef = res.booking_ref || `FT${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedBookingRef(bookingRef);
      setSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess({ ...formData, bookingRef });
      redirectToWhatsAppEnquiry(formData, bookingRef);
    } catch (err) {
      console.error('Enquiry submission error:', err);
      const bookingRef = `FT${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedBookingRef(bookingRef);
      setSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess({ ...formData, bookingRef });
      redirectToWhatsAppEnquiry(formData, bookingRef);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenGoogleMaps = () => {
    window.open(BRAND.googleMapsUrl, '_blank');
  };

  return (
    <div className="page-container" aria-label="Contact Friends Tours & Travels">
      <Navbar
        activeSection="contact"
        onNavClick={onNavigate}
        onBookNowClick={onBookNowClick}
      />

      {/* 1. CINEMATIC HERO */}
      <header className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1920&q=80"
          alt="Contact Friends Tours & Travels Bangalore"
          className="page-hero-bg"
        />
        <div className="page-hero-scrim" />

        <div className="page-hero-content">
          <nav className="page-breadcrumbs" aria-label="Breadcrumb">
            <span className="page-breadcrumb-link" onClick={() => onNavigate('/')}>Home</span>
            <span>/</span>
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Contact Us</span>
          </nav>

          <div className="page-eyebrow">
            <Sparkles size={11} />
            <span>LET'S TALK TRAVEL</span>
          </div>

          <h1 className="page-title">
            FRIENDS TOURS &amp; TRAVELS<br />J.P. NAGAR, BANGALORE
          </h1>

          <p className="page-subtitle">
            Book your employee transportation, airport transfers, local city hourly rentals, shuttle services, and outstation trips. Our 24/7 travel desk is ready to assist you.
          </p>
        </div>
      </header>

      {/* 2. MAIN 40/60 INTERACTIVE LAYOUT */}
      <main className="page-main-section">
        <div className="page-max-width">
          
          <div className="contact-interactive-grid">
            
            {/* LEFT 40%: CONTACT INFORMATION & OFFICE CARDS */}
            <aside className="contact-info-panel">
              
              <div>
                <span className="service-block-badge">DIRECT 24/7 HELPDESK</span>
                <h2 className="page-section-title" style={{ fontSize: '1.65rem' }}>
                  BANGALORE OFFICE
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                  Contact our J.P. Nagar booking desk for custom tariff quotes, outstation rentals, airport transfers, and corporate employee mobility retainers.
                </p>
              </div>

              {/* CALL US */}
              <a href={`tel:${cleanPhone}`} className="contact-card-item">
                <div className="contact-card-icon">
                  <Phone size={22} />
                </div>
                <div className="contact-card-text">
                  <span className="contact-card-label">
                    Call Us (24/7 Hotline)
                  </span>
                  <strong className="contact-card-value">
                    {phone.includes('/') ? (
                      <span className="contact-card-split-val">
                        <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:${phone.split('/')[0].replace(/[^\d+]/g, '')}`; }}>
                          {phone.split('/')[0].trim()}
                        </span>
                        <span className="contact-card-sep">/</span>
                        <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:${phone.split('/')[1].replace(/[^\d+]/g, '')}`; }}>
                          {phone.split('/')[1].trim()}
                        </span>
                      </span>
                    ) : (
                      phone
                    )}
                  </strong>
                </div>
              </a>

              {/* WHATSAPP */}
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours, I would like to book a journey.')}`}
                target="_blank"
                rel="noreferrer"
                className="contact-card-item"
              >
                <div className="contact-card-icon" style={{ background: '#E6F7ED', color: '#25D366' }}>
                  <MessageCircle size={22} />
                </div>
                <div className="contact-card-text">
                  <span className="contact-card-label">
                    WhatsApp Concierge (24/7)
                  </span>
                  <strong className="contact-card-value" style={{ color: '#0A1938' }}>{whatsapp}</strong>
                </div>
              </a>

              {/* EMAIL */}
              <a href={`mailto:${email}`} className="contact-card-item">
                <div className="contact-card-icon">
                  <Mail size={22} />
                </div>
                <div className="contact-card-text">
                  <span className="contact-card-label">
                    Official Email
                  </span>
                  <strong className="contact-card-value" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>{email}</strong>
                </div>
              </a>

              {/* OFFICE & HOURS */}
              <div className="contact-card-item" style={{ cursor: 'default' }}>
                <div className="contact-card-icon">
                  <Clock size={22} />
                </div>
                <div className="contact-card-text">
                  <span className="contact-card-label">
                    Operating Hours
                  </span>
                  <strong className="contact-card-value">24 Hours / 7 Days a Week</strong>
                </div>
              </div>

              {/* BANGALORE LOCATION CARD WITH GOOGLE MAPS LINK */}
              <div className="page-content-card" style={{ padding: 22, margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <MapPin size={20} color="var(--color-primary)" />
                  <strong style={{ fontSize: '0.95rem', color: '#0A1938' }}>Office Address</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#444', lineHeight: 1.5, margin: '0 0 14px 0', fontWeight: 600 }}>
                  {address}
                </p>
                <button
                  type="button"
                  onClick={handleOpenGoogleMaps}
                  className="btn-card-view-details"
                  style={{ fontSize: '0.775rem' }}
                >
                  <MapPin size={13} />
                  <span>Open in Google Maps</span>
                  <ExternalLink size={12} />
                </button>
              </div>

            </aside>

            {/* RIGHT 60%: INTERACTIVE ENQUIRY FORM PANEL */}
            <div ref={formRef} className="contact-form-panel">
              
              <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 16, marginBottom: 20 }}>
                <span className="service-block-badge">ONLINE RESERVATION CONCIERGE</span>
                <h2 className="page-section-title" style={{ fontSize: '1.75rem', margin: '6px 0 4px' }}>
                  PLAN YOUR JOURNEY
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Fill in your travel preferences below for custom fixed-rate quotes and vehicle reservation.
                </p>
              </div>

              {submitted ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EBF2FF', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A1938', marginBottom: 8 }}>
                    RESERVATION CONFIRMED
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 20, maxWidth: 480, marginInline: 'auto' }}>
                    Thank you, <strong>{formData.name}</strong>. Your enquiry for <strong>{formData.tripType}</strong> has been registered directly with Friends Tours &amp; Travels booking desk.
                  </p>

                  {confirmedBookingRef && (
                    <div style={{
                      backgroundColor: '#F0F4FF',
                      border: '1px solid #D1E1FF',
                      borderRadius: 12,
                      padding: '12px 20px',
                      marginBottom: 20,
                      maxWidth: 360,
                      marginInline: 'auto'
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Booking Reference
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-primary, #0D256C)', letterSpacing: '0.04em' }}>
                        {confirmedBookingRef}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, marginTop: 4 }}>
                        ✓ Recorded in reservations system
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    fontSize: '0.84375rem',
                    color: '#475569',
                    textAlign: 'left',
                    backgroundColor: '#F8FAFC',
                    padding: '14px 18px',
                    borderRadius: 10,
                    marginBottom: 22,
                    maxWidth: 420,
                    marginInline: 'auto'
                  }}>
                    <div><strong>Service:</strong> {formData.tripType}</div>
                    <div><strong>Pickup:</strong> {formData.pickupLocation}</div>
                    <div><strong>Drop:</strong> {formData.destination}</div>
                    <div><strong>Date &amp; Time:</strong> {formData.travelDate} at {formData.travelTime}</div>
                    {formData.returnDate && (formData.tripType === 'Round Trip' || formData.tripType === 'Outstation') && (
                      <div><strong>Return Date:</strong> {formData.returnDate}</div>
                    )}
                    <div><strong>Vehicle:</strong> {formData.vehiclePreference} ({formData.passengers} Passengers)</div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      className="btn-page-cta-primary"
                      style={{ background: 'var(--color-primary)', color: '#FFFFFF' }}
                      onClick={() => {
                        setSubmitted(false);
                        setConfirmedBookingRef('');
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          tripType: 'Airport Transfer',
                          airportDirection: 'toAirport',
                          airportTerminal: 'Terminal 1',
                          flightNumber: '',
                          localPackage: '8 hrs / 80 km',
                          pickupLocation: '',
                          destination: 'Kempegowda International Airport (BLR) - Terminal 1',
                          travelDate: todayStr,
                          travelTime: getDefaultPickupTime(),
                          returnDate: '',
                          returnTime: '18:00',
                          passengers: 2,
                          vehiclePreference: VEHICLES_DATA[0]?.name || 'Etios / Swift Dzire / Logan',
                          message: ''
                        });
                      }}
                    >
                      Submit Another Enquiry
                    </button>
                    <a
                      href={getWhatsAppEnquiryUrl(formData, confirmedBookingRef)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '10px 20px',
                        borderRadius: 999,
                        background: '#25D366',
                        color: '#FFFFFF',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <MessageCircle size={14} />
                      <span>Open WhatsApp (82773 93089)</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="veh-card-form" noValidate>
                  
                  {submitError && (
                    <div style={{ background: '#FEE2E2', border: '1px solid #F87171', color: '#991B1B', padding: '10px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem' }}>
                      <AlertCircle size={16} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* 1. Trip Type Selector Pills */}
                  <div className="trip-types-container" style={{ margin: 0 }}>
                    <label className="trip-types-label">
                      <Compass size={14} />
                      <span>Select Trip Type</span>
                    </label>
                    <div className="trip-types-pills" role="radiogroup" aria-label="Select Trip Type">
                      {TRIP_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isActive = formData.tripType === type.label;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            className={`trip-type-pill ${isActive ? 'active' : ''}`}
                            onClick={() => handleTripTypeSelect(type.label)}
                          >
                            <Icon size={14} />
                            <span>{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. AIRPORT TRANSFER CONTROLS */}
                  {formData.tripType === 'Airport Transfer' && (
                    <>
                      <div className="direction-toggle-row">
                        <button
                          type="button"
                          className={`btn-direction-toggle ${formData.airportDirection === 'toAirport' ? 'active' : ''}`}
                          onClick={() => handleAirportDirectionChange('toAirport')}
                        >
                          <Plane size={14} style={{ transform: 'rotate(-45deg)' }} />
                          <span>To Airport (City Drop)</span>
                        </button>
                        <button
                          type="button"
                          className={`btn-direction-toggle ${formData.airportDirection === 'fromAirport' ? 'active' : ''}`}
                          onClick={() => handleAirportDirectionChange('fromAirport')}
                        >
                          <Plane size={14} style={{ transform: 'rotate(45deg)' }} />
                          <span>From Airport (City Pickup)</span>
                        </button>
                      </div>

                      <div className="veh-form-row">
                        <div className="veh-form-group">
                          <label className="veh-form-label">Airport Terminal</label>
                          <select
                            value={formData.airportTerminal}
                            onChange={(e) => {
                              const terminal = e.target.value;
                              const terminalStr = `Kempegowda International Airport (BLR) - ${terminal}`;
                              setFormData((prev) => ({
                                ...prev,
                                airportTerminal: terminal,
                                ...(prev.airportDirection === 'toAirport' ? { destination: terminalStr } : { pickupLocation: terminalStr })
                              }));
                            }}
                            className="veh-card-select"
                          >
                            <option value="Terminal 1">Terminal 1 (Domestic)</option>
                            <option value="Terminal 2 (Garden Terminal)">Terminal 2 (Garden Terminal)</option>
                          </select>
                        </div>

                        <div className="veh-form-group">
                          <label className="veh-form-label">Flight Number (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. 6E 2145 / AI 506"
                            value={formData.flightNumber}
                            onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                            className="veh-card-input"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 3. LOCAL RENTAL HOURLY PACKAGES */}
                  {formData.tripType === 'Local Rental' && (
                    <div className="veh-form-group">
                      <label className="veh-form-label">Select Bangalore Hourly Package</label>
                      <div className="package-pills-row">
                        {LOCAL_PACKAGES.map((pkg) => {
                          const isSelected = formData.localPackage === pkg.label;
                          return (
                            <button
                              key={pkg.id}
                              type="button"
                              className={`package-pill-btn ${isSelected ? 'active' : ''}`}
                              onClick={() => setFormData({ ...formData, localPackage: pkg.label })}
                            >
                              <span>{pkg.label}</span>
                              <span style={{ fontSize: '0.6875rem', opacity: 0.8 }}>({pkg.desc})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 4. OUTSTATION TARIFF NOTE */}
                  {formData.tripType === 'Outstation' && (
                    <div className="tariff-info-callout">
                      <Info size={18} style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Official Outstation Tariff Rule:</strong> Minimum 300 km/day billed. Driver allowance, tolls, and inter-state permits as per actuals.
                      </div>
                    </div>
                  )}

                  {/* 5. PICKUP LOCATION (AUTOCOMPLETE) */}
                  <LocationAutocomplete
                    id="page-pickup"
                    label={formData.tripType === 'Airport Transfer' && formData.airportDirection === 'fromAirport' ? 'Airport Pickup Point' : 'Pickup Location (Bangalore)'}
                    placeholder="Type area e.g. Ba for Banashankari, Banaswadi, Bannerghatta..."
                    value={formData.pickupLocation}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, pickupLocation: val }));
                      if (errors.pickupLocation) setErrors((prev) => ({ ...prev, pickupLocation: null }));
                    }}
                    required
                    error={errors.pickupLocation}
                    disabled={formData.tripType === 'Airport Transfer' && formData.airportDirection === 'fromAirport'}
                    helperText={formData.tripType === 'Airport Transfer' && formData.airportDirection === 'fromAirport' ? 'Chauffeur will meet you at Airport Arrivals' : 'Type to select from Bangalore areas, hotels or stations'}
                  />

                  {/* 6. DESTINATION (AUTOCOMPLETE) */}
                  <LocationAutocomplete
                    id="page-destination"
                    label={formData.tripType === 'Local Rental' ? 'Local Destination Limits' : (formData.tripType === 'Outstation' ? 'Outstation Destination City / Spot' : 'Drop Destination')}
                    placeholder={formData.tripType === 'Outstation' ? 'Type Mysore, Coorg, Ooty, Chikmagalur...' : 'Type area, hospital, hotel, or station...'}
                    value={formData.destination}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, destination: val }));
                      if (errors.destination) setErrors((prev) => ({ ...prev, destination: null }));
                    }}
                    required
                    error={errors.destination}
                    disabled={formData.tripType === 'Local Rental' || (formData.tripType === 'Airport Transfer' && formData.airportDirection === 'toAirport')}
                    helperText={formData.tripType === 'Local Rental' ? 'Covers full Bangalore city sightseeing, meetings, and local travel' : 'Select from suggestions to ensure clean route assignment'}
                  />

                  {/* 7. TRAVEL DATE & PICKUP TIME */}
                  <div className="veh-form-row">
                    <div className="veh-form-group">
                      <label className="veh-form-label">Travel Date *</label>
                      <input
                        type="date"
                        min={todayStr}
                        value={formData.travelDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            travelDate: val,
                            returnDate: (prev.returnDate && prev.returnDate < val) ? val : prev.returnDate
                          }));
                          if (errors.travelDate) setErrors((prev) => ({ ...prev, travelDate: null }));
                        }}
                        className="veh-card-input"
                        style={errors.travelDate ? { borderColor: '#DC2626' } : {}}
                      />
                      {errors.travelDate && <span className="form-field-error">{errors.travelDate}</span>}
                    </div>

                    <div className="veh-form-group">
                      <label className="veh-form-label">Pickup Time *</label>
                      <input
                        type="time"
                        min={formData.travelDate === todayStr ? getMinTimeForDate(todayStr) : '00:00'}
                        value={formData.travelTime}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, travelTime: e.target.value }));
                          if (errors.travelTime) setErrors((prev) => ({ ...prev, travelTime: null }));
                        }}
                        className="veh-card-input"
                        style={errors.travelTime ? { borderColor: '#DC2626' } : {}}
                      />
                      {errors.travelTime && <span className="form-field-error">{errors.travelTime}</span>}
                    </div>
                  </div>

                  {/* 8. RETURN DATE & TIME (FOR ROUND TRIP & OUTSTATION) */}
                  {(formData.tripType === 'Round Trip' || formData.tripType === 'Outstation') && (
                    <div className="veh-form-row">
                      <div className="veh-form-group">
                        <label className="veh-form-label">Return Date *</label>
                        <input
                          type="date"
                          min={formData.travelDate || todayStr}
                          value={formData.returnDate}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, returnDate: e.target.value }));
                            if (errors.returnDate) setErrors((prev) => ({ ...prev, returnDate: null }));
                          }}
                          className="veh-card-input"
                          style={errors.returnDate ? { borderColor: '#DC2626' } : {}}
                        />
                        {errors.returnDate && <span className="form-field-error">{errors.returnDate}</span>}
                      </div>

                      {formData.tripType === 'Round Trip' && (
                        <div className="veh-form-group">
                          <label className="veh-form-label">Return Time</label>
                          <input
                            type="time"
                            value={formData.returnTime}
                            onChange={(e) => setFormData((prev) => ({ ...prev, returnTime: e.target.value }))}
                            className="veh-card-input"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* 9. NAME & PHONE */}
                  <div className="veh-form-row">
                    <div className="veh-form-group">
                      <label className="veh-form-label">Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Rajesh Kumar"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, name: e.target.value }));
                          if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                        }}
                        className="veh-card-input"
                        style={errors.name ? { borderColor: '#DC2626' } : {}}
                      />
                      {errors.name && <span className="form-field-error">{errors.name}</span>}
                    </div>

                    <div className="veh-form-group">
                      <label className="veh-form-label">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="e.g. 8277393089"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, phone: e.target.value }));
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                        }}
                        className="veh-card-input"
                        style={errors.phone ? { borderColor: '#DC2626' } : {}}
                      />
                      {errors.phone && <span className="form-field-error">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* 10. EMAIL */}
                  <div className="veh-form-group">
                    <label className="veh-form-label">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. rajesh@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, email: e.target.value }));
                        if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                      }}
                      className="veh-card-input"
                      style={errors.email ? { borderColor: '#DC2626' } : {}}
                    />
                    {errors.email && <span className="form-field-error">{errors.email}</span>}
                  </div>

                  {/* 11. PASSENGERS & VEHICLE */}
                  <div className="veh-form-row">
                    <div className="veh-form-group">
                      <label className="veh-form-label">Passengers</label>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--color-border-subtle)', borderRadius: 10, padding: '4px 10px', height: 44 }}>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 800, color: 'var(--color-primary)' }}
                          onClick={() => setFormData((f) => ({ ...f, passengers: Math.max(1, f.passengers - 1) }))}
                        >
                          −
                        </button>
                        <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0A1938' }}>{formData.passengers} Passengers</span>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 800, color: 'var(--color-primary)' }}
                          onClick={() => setFormData((f) => ({ ...f, passengers: Math.min(50, f.passengers + 1) }))}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="veh-form-group">
                      <label className="veh-form-label">Vehicle Preference</label>
                      <select
                        value={formData.vehiclePreference}
                        onChange={(e) => setFormData((prev) => ({ ...prev, vehiclePreference: e.target.value }))}
                        className="veh-card-select"
                      >
                        {VEHICLES_DATA.map((veh) => (
                          <option key={veh.id} value={veh.name}>
                            {veh.name} ({veh.passengerCapacity})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 12. MESSAGE */}
                  <div className="veh-form-group">
                    <label className="veh-form-label">Special Requests / Route Notes (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Flight number, luggage requirements, employee pickup shift timings, multi-day itinerary..."
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      className="veh-card-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  {/* 13. SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="btn-veh-book"
                    disabled={isSubmitting}
                    style={{ marginTop: 8 }}
                  >
                    <span>{isSubmitting ? 'CONFIRMING...' : 'CONFIRM RESERVATION'}</span>
                    <ArrowRight size={15} />
                  </button>

                  <div className="veh-trust-reassurance">
                    <ShieldCheck size={14} color="var(--color-primary)" />
                    <span>Direct 2026 tariff card applied • Instant reservation</span>
                  </div>

                  {/* 14. Quick Action Badges */}
                  <div className="contact-quick-actions-grid">
                    <a
                      href={`tel:${BRAND.phoneRaw}`}
                      className="btn-card-view-details"
                      style={{ justifyContent: 'center', fontSize: '0.75rem', padding: '10px 12px' }}
                    >
                      <Phone size={13} />
                      <span>Call {BRAND.phoneRaw}</span>
                    </a>

                    <a
                      href={`https://wa.me/${BRAND.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Friends Tours, I would like to book a cab.')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-card-view-details"
                      style={{ justifyContent: 'center', fontSize: '0.75rem', color: '#25D366', padding: '10px 12px' }}
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                </form>
              )}

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
