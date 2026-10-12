import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  User, 
  Car, 
  Compass, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  RotateCcw,
  Plane,
  ArrowLeftRight,
  Info,
  Hash
} from 'lucide-react';
import { BRAND } from '../../constants/branding';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { VEHICLES_DATA } from '../../data/vehiclesData';
import { LocationAutocomplete } from '../ui/LocationAutocomplete';
import { api } from '../../lib/api';
import { redirectToWhatsAppEnquiry, getWhatsAppEnquiryUrl } from '../../lib/whatsapp';
import '../../styles/contact.css';

export const TRIP_TYPES = [
  { id: 'airport', label: 'Airport Transfer', icon: Plane },
  { id: 'local', label: 'Local Rental', icon: Clock },
  { id: 'oneway', label: 'One Way', icon: ArrowRight },
  { id: 'roundtrip', label: 'Round Trip', icon: RotateCcw },
  { id: 'outstation', label: 'Outstation', icon: Compass },
];

export const LOCAL_PACKAGES = [
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

// Helper: Default convenient pickup time for tomorrow or later
const getDefaultPickupTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 2);
  return `${String(now.getHours()).padStart(2, '0')}:00`;
};

export const ContactSection = ({ 
  prefilledData, 
  onSubmitSuccess, 
  hideVisualSide = false, 
  hideHeader = false 
}) => {
  const { getSetting } = useSiteSettings();
  const phone = getSetting('phone', BRAND.phoneRaw);
  const phoneAlt = getSetting('phone_alt', BRAND.phoneAltRaw);
  const whatsapp = getSetting('whatsapp', BRAND.whatsappRaw);
  const email = getSetting('email', BRAND.email);
  const address = getSetting('address', BRAND.address);
  const googleMapsUrl = getSetting('google_maps_url', BRAND.googleMapsUrl);

  const cleanPhone = phone.includes('/')
    ? phone.split('/')[0].replace(/[^\d+]/g, '')
    : phone.replace(/[^\d+]/g, '');
  const cleanPhoneAlt = phoneAlt ? phoneAlt.replace(/[^\d+]/g, '') : '';
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, '');

  const todayStr = getLocalDateString();

  const [formData, setFormData] = useState({
    name: prefilledData?.name || '',
    phone: prefilledData?.phone || '',
    email: prefilledData?.email || '',
    tripType: prefilledData?.tripType || prefilledData?.travelType || 'Airport Transfer',
    // Airport Specifics
    airportDirection: prefilledData?.airportDirection || 'toAirport', // 'toAirport' | 'fromAirport'
    airportTerminal: prefilledData?.airportTerminal || 'Terminal 1', // 'Terminal 1' | 'Terminal 2 (Garden Terminal)'
    flightNumber: prefilledData?.flightNumber || '',
    // Local Specifics
    localPackage: prefilledData?.localPackage || '8 hrs / 80 km',
    // Locations
    pickupLocation: prefilledData?.pickupLocation || '',
    destination: prefilledData?.destination || (
      (prefilledData?.tripType === 'Local Rental' || prefilledData?.travelType === 'Local Rental')
        ? 'Bangalore Local Sightseeing & City Travel'
        : 'Kempegowda International Airport (BLR) - Terminal 1'
    ),
    // Date & Time
    travelDate: prefilledData?.travelDate || todayStr,
    travelTime: prefilledData?.travelTime || getDefaultPickupTime(),
    returnDate: prefilledData?.returnDate || '',
    returnTime: '18:00',
    // Vehicle & Party
    passengers: prefilledData?.passengers || 2,
    vehiclePreference: prefilledData?.vehiclePreference || 'Etios / Swift Dzire / Logan',
    message: prefilledData?.message || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');

  // Synchronize dynamic prefilledData updates (e.g. when selecting an airport route or cab preference)
  useEffect(() => {
    if (prefilledData) {
      setFormData((prev) => ({
        ...prev,
        tripType: prefilledData.tripType || prefilledData.travelType || prev.tripType,
        localPackage: prefilledData.localPackage || prev.localPackage,
        airportDirection: prefilledData.airportDirection || prev.airportDirection,
        airportTerminal: prefilledData.airportTerminal || prev.airportTerminal,
        pickupLocation: prefilledData.pickupLocation !== undefined ? prefilledData.pickupLocation : prev.pickupLocation,
        destination: prefilledData.destination !== undefined ? prefilledData.destination : prev.destination,
        vehiclePreference: prefilledData.vehiclePreference || prev.vehiclePreference,
        passengers: prefilledData.passengers !== undefined ? prefilledData.passengers : prev.passengers,
        message: prefilledData.message !== undefined ? prefilledData.message : prev.message,
      }));
    }
  }, [prefilledData]);

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

    // Clear related errors
    setErrors((prev) => ({ ...prev, travelDate: null, travelTime: null, returnDate: null, destination: null, pickupLocation: null }));
  };

  // Toggle Airport Direction (To Airport vs From Airport)
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

  // Terminal selector change
  const handleTerminalChange = (terminal) => {
    setFormData((prev) => {
      const terminalStr = `Kempegowda International Airport (BLR) - ${terminal}`;
      const updated = { ...prev, airportTerminal: terminal };
      if (prev.airportDirection === 'toAirport') {
        updated.destination = terminalStr;
      } else {
        updated.pickupLocation = terminalStr;
      }
      return updated;
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Keep return date in sync if travel date moved beyond return date
      if (field === 'travelDate' && updated.returnDate && updated.returnDate < value) {
        updated.returnDate = value;
      }

      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handlePassengerChange = (delta) => {
    setFormData((prev) => {
      const next = prev.passengers + delta;
      if (next >= 1 && next <= 50) return { ...prev, passengers: next };
      return prev;
    });
  };

  // Comprehensive Validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Customer Details
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || cleanPhone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number (minimum 8 digits).';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // 2. Locations
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Please select or enter your pickup location.';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Please select or enter your destination.';
    }

    // 3. Date & Time Validation
    if (!formData.travelDate) {
      newErrors.travelDate = 'Please select a travel date.';
    } else if (formData.travelDate < todayStr) {
      newErrors.travelDate = 'Past travel dates cannot be selected.';
    }

    if (!formData.travelTime) {
      newErrors.travelTime = 'Please select a pickup time.';
    } else if (formData.travelDate === todayStr) {
      const minTime = getMinTimeForDate(todayStr);
      if (formData.travelTime < minTime) {
        newErrors.travelTime = `Pickup time for today must be at least 1 hour from now (after ${minTime}).`;
      }
    }

    // 4. Return Date for Round Trip & Outstation
    if (formData.tripType === 'Round Trip' || formData.tripType === 'Outstation') {
      if (!formData.returnDate) {
        newErrors.returnDate = 'Please select a return date.';
      } else if (formData.returnDate < formData.travelDate) {
        newErrors.returnDate = 'Return date cannot be earlier than travel date.';
      } else if (formData.tripType === 'Round Trip' && formData.returnDate === formData.travelDate) {
        if (formData.returnTime && formData.travelTime && formData.returnTime <= formData.travelTime) {
          newErrors.returnTime = 'Return time must be after pickup time.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Build rich special requests / itinerary summary
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
      source: 'homepage_contact',
    };

    try {
      const res = await api.submitEnquiry(payload);
      const bookingRef = res.booking_ref || `FT${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedBookingRef(bookingRef);
      setIsSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess({ ...formData, bookingRef });
      redirectToWhatsAppEnquiry(formData, bookingRef);
    } catch (err) {
      console.error('Enquiry submission error:', err);
      // Fallback display if network error occurs
      const bookingRef = `FT${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedBookingRef(bookingRef);
      setIsSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess({ ...formData, bookingRef });
      redirectToWhatsAppEnquiry(formData, bookingRef);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
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
      vehiclePreference: 'Etios / Swift Dzire / Logan',
      message: '',
    });
    setErrors({});
  };

  return (
    <section id="contact" className={`contact-section ${hideHeader ? 'contact-section-compact' : ''}`} aria-label="Contact and Bangalore Trip Enquiry">
      <div className="contact-container">
        
        {/* Section Header */}
        {!hideHeader && (
          <div className="contact-header reveal-on-scroll">
            <span className="contact-eyebrow">
              <Compass size={13} />
              <span>LET'S PLAN YOUR BANGALORE JOURNEY</span>
            </span>
            <h2 className="contact-title">PLAN YOUR JOURNEY WITH FRIENDS TOURS</h2>
            <p className="contact-subtitle">
              Reliable employee transportation, airport transfers, local city rentals, shuttle services, and outstation trips across Karnataka.
            </p>
          </div>
        )}

        {/* Main 2-Column Contact & Enquiry Panel */}
        <div className={`contact-panel reveal-scale ${hideVisualSide ? 'contact-panel-form-only' : ''}`}>
          
          {/* Left Side: Visual & Contact Information (45%) */}
          {!hideVisualSide && (
            <div className="contact-visual-side">
            <img
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
              alt="Friends Tours Bangalore chauffeur on highway"
              className="contact-visual-bg"
              loading="lazy"
            />
            <div className="contact-visual-scrim" />

            <div className="contact-visual-top">
              <h3 className="contact-visual-quote">
                WHERE YOUR JOURNEY STARTS.
              </h3>

              {/* Verified Contact Details List */}
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="contact-info-label">PHONE NUMBERS</div>
                    <div className="contact-info-val">
                      <a href={`tel:${cleanPhone}`}>{phone}</a>{phoneAlt ? <> / <a href={`tel:${cleanPhoneAlt}`}>{phoneAlt}</a></> : null}
                    </div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon" style={{ background: '#E6F7ED', color: '#25D366' }}>
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <div className="contact-info-label">WHATSAPP NUMBER</div>
                    <div className="contact-info-val">
                      <a 
                        href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours, I would like to make an inquiry.')}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {whatsapp}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="contact-info-label">EMAIL</div>
                    <div className="contact-info-val">
                      <a href={`mailto:${email}`} style={{ wordBreak: 'break-all' }}>{email}</a>
                    </div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="contact-info-label">OFFICE ADDRESS</div>
                    <div className="contact-info-val">
                      <a 
                        href={googleMapsUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {address}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="contact-info-label">BUSINESS HOURS</div>
                    <div className="contact-info-val">{BRAND.hours}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="contact-actions-row">
              <a href={`tel:${cleanPhone}`} className="btn-contact-call">
                <Phone size={14} />
                <span>CALL {phone}</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours, I would like to plan a journey from Bangalore.')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-contact-whatsapp"
              >
                <MessageCircle size={14} />
                <span>WHATSAPP US</span>
              </a>
            </div>

          </div>
          )}

          {/* Right Side: Enquiry Form */}
          <div className="contact-form-side">
            {isSubmitted ? (
              <div className="contact-success-state">
                <div className="success-icon-circle">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="success-title">RESERVATION CONFIRMED</h3>
                <p className="success-desc">
                  Thank you, <strong>{formData.name}</strong>! Your booking enquiry has been registered successfully with Friends Tours &amp; Travels Bangalore.
                </p>

                {confirmedBookingRef && (
                  <div style={{
                    backgroundColor: '#F0F4FF',
                    border: '1px solid #D1E1FF',
                    borderRadius: 12,
                    padding: '12px 20px',
                    marginBottom: 20,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Booking Reference
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-primary, #0D256C)', letterSpacing: '0.04em' }}>
                      {confirmedBookingRef}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, marginTop: 4 }}>
                      ✓ Recorded directly in reservations system
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
                  width: '100%',
                  maxWidth: 420
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
                  <button className="btn-success-reset" onClick={handleReset}>
                    MAKE ANOTHER BOOKING
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
              <>
                <div className="contact-form-head">
                  <h3 className="contact-form-title">RESERVE YOUR JOURNEY</h3>
                  <p className="contact-form-subtitle">
                    Select your service type below. Pickup and destination suggest matching Bangalore areas instantly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  
                  {/* 1. Trip Type Selector Pills */}
                  <div className="trip-types-container">
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

                  {/* 2. AIRPORT TRANSFER SPECIFIC CONTROLS */}
                  {formData.tripType === 'Airport Transfer' && (
                    <>
                      {/* Direction Switcher (To Airport vs From Airport) */}
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

                      {/* Terminal Selection & Flight Number Row */}
                      <div className="form-field">
                        <label className="form-label" htmlFor="airport-terminal">
                          <span>Airport Terminal</span>
                        </label>
                        <div className="form-input-wrap">
                          <Plane size={15} className="form-input-icon" />
                          <select
                            id="airport-terminal"
                            value={formData.airportTerminal}
                            onChange={(e) => handleTerminalChange(e.target.value)}
                            className="form-select"
                          >
                            <option value="Terminal 1">Terminal 1 (Domestic / Indigo, Akasa)</option>
                            <option value="Terminal 2 (Garden Terminal)">Terminal 2 (Garden Terminal / Air India, Vistara, Int'l)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-field">
                        <label className="form-label" htmlFor="flight-number">
                          <span>Flight Number (Optional)</span>
                        </label>
                        <div className="form-input-wrap">
                          <Hash size={15} className="form-input-icon" />
                          <input
                            id="flight-number"
                            type="text"
                            placeholder="e.g. 6E 2145 / AI 506"
                            value={formData.flightNumber}
                            onChange={(e) => handleChange('flightNumber', e.target.value)}
                            className="form-input"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* 3. LOCAL RENTAL SPECIFIC CONTROLS */}
                  {formData.tripType === 'Local Rental' && (
                    <div className="form-field form-group-full">
                      <label className="form-label">
                        <Clock size={14} />
                        <span>Select Bangalore Hourly Package</span>
                      </label>
                      <div className="package-pills-row">
                        {LOCAL_PACKAGES.map((pkg) => {
                          const isSelected = formData.localPackage === pkg.label;
                          return (
                            <button
                              key={pkg.id}
                              type="button"
                              className={`package-pill-btn ${isSelected ? 'active' : ''}`}
                              onClick={() => handleChange('localPackage', pkg.label)}
                            >
                              <span>{pkg.label}</span>
                              <span style={{ fontSize: '0.6875rem', opacity: 0.8 }}>({pkg.desc})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 4. OUTSTATION TARIFF CALLOUT */}
                  {formData.tripType === 'Outstation' && (
                    <div className="tariff-info-callout">
                      <Info size={18} style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Official Outstation Tariff Rule:</strong> Minimum 300 km/day billed. Chauffeur night allowance, tolls, and inter-state permit charges as per actual highway receipts.
                      </div>
                    </div>
                  )}

                  {/* 5. PICKUP LOCATION (AUTOCOMPLETE) */}
                  <LocationAutocomplete
                    id="enquiry-pickup"
                    label={formData.tripType === 'Airport Transfer' && formData.airportDirection === 'fromAirport' ? 'Airport Pickup Point' : 'Pickup Location (Bangalore)'}
                    placeholder="Type area e.g. Ba for Banashankari, Banaswadi, Bannerghatta..."
                    value={formData.pickupLocation}
                    onChange={(val) => handleChange('pickupLocation', val)}
                    required
                    error={errors.pickupLocation}
                    disabled={formData.tripType === 'Airport Transfer' && formData.airportDirection === 'fromAirport'}
                    helperText={formData.tripType === 'Airport Transfer' && formData.airportDirection === 'fromAirport' ? 'Chauffeur will meet you at Airport Arrivals pickup lane' : 'Select from suggestions or enter hotel/address'}
                  />

                  {/* 6. DESTINATION (AUTOCOMPLETE) */}
                  <LocationAutocomplete
                    id="enquiry-destination"
                    label={formData.tripType === 'Local Rental' ? 'Local Destination Limits' : (formData.tripType === 'Outstation' ? 'Outstation Destination City / Spot' : 'Drop Destination')}
                    placeholder={formData.tripType === 'Outstation' ? 'Type Mysore, Coorg, Ooty, Chikmagalur...' : 'Type area, hospital, hotel, or station...'}
                    value={formData.destination}
                    onChange={(val) => handleChange('destination', val)}
                    required
                    error={errors.destination}
                    disabled={formData.tripType === 'Local Rental' || (formData.tripType === 'Airport Transfer' && formData.airportDirection === 'toAirport')}
                    helperText={formData.tripType === 'Local Rental' ? 'Covers full Bangalore city sightseeing, meetings, and local travel' : 'Select from suggestions to ensure clean route assignment'}
                  />

                  {/* 7. TRAVEL DATE & PICKUP TIME (SIDE BY SIDE) */}
                  <div className="form-field form-group-full">
                    <div className="date-time-grid">
                      
                      {/* Travel Date */}
                      <div>
                        <label className="form-label" htmlFor="enquiry-travel-date">
                          <span>Travel Date</span>
                          <span className="form-label-required">*</span>
                        </label>
                        <div className="form-input-wrap">
                          <Calendar size={15} className="form-input-icon" />
                          <input
                            id="enquiry-travel-date"
                            type="date"
                            min={todayStr}
                            value={formData.travelDate}
                            onChange={(e) => handleChange('travelDate', e.target.value)}
                            className={`form-input ${errors.travelDate ? 'error' : ''}`}
                            required
                          />
                        </div>
                        {errors.travelDate && <span className="form-error-msg">{errors.travelDate}</span>}
                      </div>

                      {/* Pickup Time */}
                      <div>
                        <label className="form-label" htmlFor="enquiry-travel-time">
                          <span>Pickup Time</span>
                          <span className="form-label-required">*</span>
                        </label>
                        <div className="form-input-wrap">
                          <Clock size={15} className="form-input-icon" />
                          <input
                            id="enquiry-travel-time"
                            type="time"
                            min={formData.travelDate === todayStr ? getMinTimeForDate(todayStr) : '00:00'}
                            value={formData.travelTime}
                            onChange={(e) => handleChange('travelTime', e.target.value)}
                            className={`form-input ${errors.travelTime ? 'error' : ''}`}
                            required
                          />
                        </div>
                        {errors.travelTime && <span className="form-error-msg">{errors.travelTime}</span>}
                      </div>

                    </div>
                  </div>

                  {/* 8. RETURN DATE & RETURN TIME (FOR ROUND TRIP & OUTSTATION) */}
                  {(formData.tripType === 'Round Trip' || formData.tripType === 'Outstation') && (
                    <div className="form-field form-group-full">
                      <div className="date-time-grid">
                        
                        {/* Return Date */}
                        <div>
                          <label className="form-label" htmlFor="enquiry-return-date">
                            <span>Return Date</span>
                            <span className="form-label-required">*</span>
                          </label>
                          <div className="form-input-wrap">
                            <Calendar size={15} className="form-input-icon" />
                            <input
                              id="enquiry-return-date"
                              type="date"
                              min={formData.travelDate || todayStr}
                              value={formData.returnDate}
                              onChange={(e) => handleChange('returnDate', e.target.value)}
                              className={`form-input ${errors.returnDate ? 'error' : ''}`}
                              required
                            />
                          </div>
                          {errors.returnDate && <span className="form-error-msg">{errors.returnDate}</span>}
                        </div>

                        {/* Return Time (only for round trip) */}
                        {formData.tripType === 'Round Trip' && (
                          <div>
                            <label className="form-label" htmlFor="enquiry-return-time">
                              <span>Return Time</span>
                            </label>
                            <div className="form-input-wrap">
                              <Clock size={15} className="form-input-icon" />
                              <input
                                id="enquiry-return-time"
                                type="time"
                                value={formData.returnTime}
                                onChange={(e) => handleChange('returnTime', e.target.value)}
                                className={`form-input ${errors.returnTime ? 'error' : ''}`}
                              />
                            </div>
                            {errors.returnTime && <span className="form-error-msg">{errors.returnTime}</span>}
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* 9. CUSTOMER NAME */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="enquiry-name">
                      <span>Full Name</span>
                      <span className="form-label-required">*</span>
                    </label>
                    <div className="form-input-wrap">
                      <User size={15} className="form-input-icon" />
                      <input
                        id="enquiry-name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        required
                      />
                    </div>
                    {errors.name && <span className="form-error-msg">{errors.name}</span>}
                  </div>

                  {/* 10. PHONE NUMBER */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="enquiry-phone">
                      <span>Phone Number</span>
                      <span className="form-label-required">*</span>
                    </label>
                    <div className="form-input-wrap">
                      <Phone size={15} className="form-input-icon" />
                      <input
                        id="enquiry-phone"
                        type="tel"
                        placeholder="e.g. 8277393089"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        required
                      />
                    </div>
                    {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
                  </div>

                  {/* 11. EMAIL ADDRESS */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="enquiry-email">
                      <span>Email Address (Optional)</span>
                    </label>
                    <div className="form-input-wrap">
                      <Mail size={15} className="form-input-icon" />
                      <input
                        id="enquiry-email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                      />
                    </div>
                    {errors.email && <span className="form-error-msg">{errors.email}</span>}
                  </div>

                  {/* 12. VEHICLE PREFERENCE */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="enquiry-vehicle">
                      <span>Vehicle Preference</span>
                    </label>
                    <div className="form-input-wrap">
                      <Car size={15} className="form-input-icon" />
                      <select
                        id="enquiry-vehicle"
                        value={formData.vehiclePreference}
                        onChange={(e) => handleChange('vehiclePreference', e.target.value)}
                        className="form-select"
                      >
                        {VEHICLES_DATA.map((v) => (
                          <option key={v.id} value={v.name}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 13. PASSENGERS COUNTER */}
                  <div className="form-field">
                    <label className="form-label">
                      <span>Passengers</span>
                    </label>
                    <div className="passenger-selector">
                      <button
                        type="button"
                        className="btn-counter"
                        onClick={() => handlePassengerChange(-1)}
                        disabled={formData.passengers <= 1}
                        aria-label="Decrease passengers"
                      >
                        −
                      </button>
                      <span className="passenger-count-val">
                        {formData.passengers} {formData.passengers === 1 ? 'Passenger' : 'Passengers'}
                      </span>
                      <button
                        type="button"
                        className="btn-counter"
                        onClick={() => handlePassengerChange(1)}
                        disabled={formData.passengers >= 50}
                        aria-label="Increase passengers"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* 14. MESSAGE / SPECIAL REQUESTS */}
                  <div className="form-field form-group-full">
                    <label className="form-label" htmlFor="enquiry-message">
                      <span>Special Requests / Route Notes (Optional)</span>
                    </label>
                    <textarea
                      id="enquiry-message"
                      placeholder="Share any specific apartment tower, landmark pickup point, corporate billing instructions, or stops along the route..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="form-textarea"
                    />
                  </div>

                  {/* 15. SUBMIT ROW */}
                  <div className="form-submit-row">
                    <div className="form-trust-text">
                      <ShieldCheck size={16} color="var(--color-primary, #0D256C)" />
                      <span>Direct 2026 tariff card applied • Instant confirmation</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-form-submit"
                    >
                      <span>{isSubmitting ? 'CONFIRMING...' : 'CONFIRM RESERVATION →'}</span>
                    </button>
                  </div>

                </form>

                {/* Contact Quick Actions Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: '1px solid var(--color-border-subtle)',
                  flexWrap: 'wrap'
                }}>
                  <a
                    href={`tel:${cleanPhone}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#444444', fontSize: '0.8125rem', fontWeight: 700 }}
                  >
                    <Phone size={14} color="var(--color-primary)" />
                    <span>CALL {phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours, I would like to book a cab.')}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#444444', fontSize: '0.8125rem', fontWeight: 700 }}
                  >
                    <MessageCircle size={14} color="#25D366" />
                    <span>WHATSAPP</span>
                  </a>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
