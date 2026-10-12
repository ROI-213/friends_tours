import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Luggage, 
  Wind, 
  Check, 
  X, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Camera,
  Car,
  Compass,
  Calendar
} from 'lucide-react';
import { getVehicleBySlug, VEHICLES_DATA } from '../data/vehiclesData';
import { BRAND } from '../constants/branding';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { redirectToWhatsAppEnquiry } from '../lib/whatsapp';
import '../styles/vehicledetail.css';

import { api } from '../lib/api.js';
import { useDataSync } from '../hooks/useDataSync';

export const VehicleDetailPage = ({ 
  slug, 
  onBackToFleet, 
  onOpenBookingConcierge, 
  onSelectAnotherVehicle,
  onNavigate,
  onBookNowClick
}) => {
  const initialVehicle = getVehicleBySlug(slug) || VEHICLES_DATA[0];
  const [vehicle, setVehicle] = useState(initialVehicle);

  const fetchVehicle = React.useCallback(() => {
    const local = getVehicleBySlug(slug);
    api.getVehicle(slug).then((v) => {
      if (v && v.name) {
        setVehicle({
          ...v,
          id: v.id,
          slug: v.slug,
          name: v.name,
          category: v.category || '',
          typeCategory: v.type_category || v.typeCategory || 'SEDAN',
          passengerCount: v.passenger_count || v.passengerCount || 4,
          passengerCapacity: v.passenger_capacity || v.passengerCapacity || '4 Passengers',
          luggageCapacity: v.luggage_capacity || v.luggageCapacity || '2 Bags',
          airConditioning: v.air_conditioning || v.airConditioning || 'AC',
          bestSuitedFor: v.best_suited_for || v.bestSuitedFor || '',
          package8hr80km: v.package_8hr_80km || v.package8hr80km || null,
          package4hr40km: v.package_4hr_40km || v.package4hr40km || null,
          extraKm: v.extra_km || v.extraKm || null,
          extraHour: v.extra_hour || v.extraHour || null,
          nightBata: v.night_bata || v.nightBata || 200,
          outstationRatePerKm: v.outstation_rate_per_km || v.outstationRatePerKm || 12,
          outstationMinPerDay: v.outstation_min_per_day || v.outstationMinPerDay || 3600,
          pricingType: v.pricing_type || v.pricingType || '',
          priceNote: v.price_note || v.priceNote || '',
          image: v.image || v.image_url || '/fleet/dzire-white.jpg',
          gallery: Array.isArray(v.gallery) && v.gallery.length > 0 ? v.gallery : (local?.gallery || ['/fleet/dzire-white.jpg']),
          features: Array.isArray(v.features) ? v.features : (local?.features || []),
          rentalTypes: Array.isArray(v.rental_types) ? v.rental_types : (local?.rentalTypes || ['Local Bangalore', 'Airport Transfer', 'Outstation']),
          rentalDurations: Array.isArray(v.rental_durations) ? v.rental_durations : (local?.rentalDurations || ['Half Day (4hr/40km)', 'Full Day (8hr/80km)']),
        });
      }
    }).catch((err) => {
      console.warn('Notice: Using local vehicle detail fallback:', err.message);
    });
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const local = getVehicleBySlug(slug);
    if (local) setVehicle(local);
    fetchVehicle();
  }, [slug, fetchVehicle]);

  useDataSync('vehicles', fetchVehicle);

  // Booking Card State
  const todayStr = new Date().toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(vehicle.passengerCount || 4);
  const [selectedRentalType, setSelectedRentalType] = useState((vehicle.rentalTypes && vehicle.rentalTypes[0]) || 'Local Bangalore');
  const [selectedDuration, setSelectedDuration] = useState((vehicle.rentalDurations && vehicle.rentalDurations[0]) || 'Full Day (8hr/80km)');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Gallery Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Set dynamic SEO title
  useEffect(() => {
    document.title = `${vehicle.name} Rental in Bangalore | ${BRAND.name}`;
  }, [vehicle.name]);

  // Gallery keyboard navigation & scroll lock
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev === 0 ? vehicle.gallery.length - 1 : prev - 1));
        }
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev === vehicle.gallery.length - 1 ? 0 : prev + 1));
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [lightboxIndex, vehicle.gallery.length]);

  const handleBookingScroll = () => {
    const el = document.getElementById('veh-booking-card');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOptionsScroll = () => {
    const el = document.getElementById('rental-options-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnquireSubmit = (e) => {
    e.preventDefault();
    const enquiryDetails = {
      type: 'vehicle',
      title: `${vehicle.name} (${vehicle.category})`,
      image: vehicle.image,
      badge: vehicle.badge,
      duration: selectedDuration,
      travelType: selectedRentalType,
      vehiclePreference: vehicle.name,
      travelDate: travelDate || 'Flexible / Upcoming',
      returnDate: returnDate || '',
      passengers: passengers,
      pickupLocation: pickupLocation || 'Bangalore City / Airport',
      destination: destination || 'As per itinerary',
      phone: phone || '',
      email: email || '',
      description: `Vehicle: ${vehicle.name} • Rental Type: ${selectedRentalType} • Duration: ${selectedDuration} • Passengers: ${passengers} • Travel Date: ${travelDate || 'TBD'}`
    };

    redirectToWhatsAppEnquiry({
      name: 'Guest',
      phone: phone || '',
      email: email || '',
      tripType: selectedRentalType,
      vehiclePreference: vehicle.name,
      passengers: passengers,
      pickupLocation: pickupLocation || 'Bangalore City / Airport',
      destination: destination || 'As per itinerary',
      travelDate: travelDate || 'Flexible / Upcoming',
      returnDate: returnDate || '',
      specialRequests: `Vehicle: ${vehicle.name} • Rental Type: ${selectedRentalType} • Duration: ${selectedDuration}`
    });

    if (onOpenBookingConcierge) {
      onOpenBookingConcierge(enquiryDetails);
    }
  };

  return (
    <div className="vehicledetail-page" aria-label={`${vehicle.name} Rental Details`}>
      <Navbar
        activeSection="services"
        onNavClick={onNavigate || onBackToFleet}
        onBookNowClick={onBookNowClick}
      />
      
      {/* 1. CINEMATIC HERO */}
      <section className="vehicledetail-hero">
        <img
          src={vehicle.image}
          alt={`${vehicle.name} rental in Bangalore`}
          className="vehicledetail-hero-bg"
        />
        <div className="vehicledetail-hero-scrim" />

        <div className="vehicledetail-hero-container">
          
          {/* Navigation & Breadcrumbs Row */}
          <div className="vehicledetail-nav-row">
            <button
              onClick={onBackToFleet}
              className="btn-vehicledetail-back"
              aria-label="Back to Rental Cars"
            >
              <ArrowLeft size={14} />
              <span>Back to Rental Cars</span>
            </button>

            <nav className="vehicledetail-breadcrumbs" aria-label="Breadcrumb">
              <span className="vehicledetail-breadcrumb-link" onClick={onBackToFleet}>Home</span>
              <span>/</span>
              <span className="vehicledetail-breadcrumb-link" onClick={onBackToFleet}>Bangalore Rental Cars</span>
              <span>/</span>
              <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{vehicle.name}</span>
            </nav>
          </div>

          {/* Hero Content */}
          <div className="vehicledetail-hero-content">
            <div className="vehicledetail-hero-eyebrow">
              <Sparkles size={11} />
              <span>BANGALORE RENTAL CARS</span>
            </div>

            <h1 className="vehicledetail-hero-title">{vehicle.name}</h1>

            <div className="vehicledetail-hero-pills">
              <span className="vehicledetail-hero-pill">
                <Users size={12} />
                <span>{vehicle.passengerCapacity} Passengers</span>
              </span>
              <span className="vehicledetail-hero-pill">
                <Luggage size={12} />
                <span>{vehicle.luggageCapacity} Bags</span>
              </span>
              <span className="vehicledetail-hero-pill">
                <Wind size={12} />
                <span>{vehicle.airConditioning}</span>
              </span>
              <span className="vehicledetail-hero-pill" style={{ background: 'var(--color-primary)', borderColor: 'rgba(255,255,255,0.4)' }}>
                <span>{vehicle.category}</span>
              </span>
            </div>

            <p className="vehicledetail-hero-desc">
              {vehicle.description}
            </p>

            <div className="vehicledetail-hero-actions">
              <button
                className="btn-vehichero-primary"
                onClick={handleBookingScroll}
              >
                <span>Enquire Now</span>
                <ArrowRight size={15} />
              </button>

              <button
                className="btn-vehichero-secondary"
                onClick={handleOptionsScroll}
              >
                <span>Check Rental Options</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. QUICK VEHICLE INFO BAR */}
      <section className="vehicledetail-infobar">
        <div className="vehicledetail-infobar-container">
          <div className="veh-info-item">
            <span className="veh-info-label">Passengers</span>
            <span className="veh-info-val">{vehicle.passengerCapacity}</span>
          </div>

          <div className="veh-info-item">
            <span className="veh-info-label">Luggage</span>
            <span className="veh-info-val">{vehicle.luggageCapacity} Bags</span>
          </div>

          <div className="veh-info-item">
            <span className="veh-info-label">Air Conditioning</span>
            <span className="veh-info-val">{vehicle.airConditioning}</span>
          </div>

          <div className="veh-info-item">
            <span className="veh-info-label">Vehicle Type</span>
            <span className="veh-info-val">{vehicle.category}</span>
          </div>

          <div className="veh-info-item">
            <span className="veh-info-label">Best For</span>
            <span className="veh-info-val" style={{ fontSize: '0.8125rem' }}>{vehicle.bestSuitedFor}</span>
          </div>

          <div className="veh-info-item">
            <span className="veh-info-label">Pricing</span>
            <span className="veh-info-val">Custom Quote</span>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT GRID (65% Left / 35% Right) */}
      <main className="vehicledetail-main-wrapper">
        <div className="vehicledetail-grid">
          
          {/* LEFT: Vehicle Information & Rental Options (65%) */}
          <div className="vehicledetail-content-col">
            
            {/* About & Verified Features Block */}
            <article className="vehicledetail-section-block">
              <h2 className="vehicledetail-block-title">
                <Car size={20} />
                <span>ABOUT THIS VEHICLE</span>
              </h2>
              <p className="vehicledetail-overview-text">
                {vehicle.description}
              </p>

              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0A1938', marginBottom: 10 }}>
                KEY FEATURES &amp; SPECIFICATIONS
              </h3>
              <div className="vehicledetail-features-grid">
                {vehicle.features.map((feature, idx) => (
                  <div key={idx} className="vehicledetail-feature-item">
                    <Check size={16} className="vehicledetail-feature-icon" strokeWidth={2.5} />
                    <span className="vehicledetail-feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* Rental Options & Durations Block */}
            <article id="rental-options-section" className="vehicledetail-section-block">
              <h2 className="vehicledetail-block-title">
                <Compass size={20} />
                <span>RENT THIS VEHICLE FOR</span>
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                Select your intended travel context to tailor the chauffeur allocation:
              </p>

              {/* Rental Type Context Pills */}
              <div className="rental-options-row">
                {vehicle.rentalTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`btn-rental-context-pill ${selectedRentalType === type ? 'active' : ''}`}
                    onClick={() => setSelectedRentalType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0A1938', marginTop: 24, marginBottom: 8 }}>
                HOW DO YOU WANT TO TRAVEL?
              </h3>
              <div className="rental-options-row">
                <button type="button" className="btn-rental-context-pill active" style={{ cursor: 'default' }}>
                  ✓ WITH DRIVER (Dedicated Highway Chauffeur)
                </button>
              </div>

              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0A1938', marginTop: 24, marginBottom: 8 }}>
                RENTAL DURATION OPTIONS
              </h3>
              <div className="rental-options-row">
                {vehicle.rentalDurations.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    className={`btn-rental-context-pill ${selectedDuration === dur ? 'active' : ''}`}
                    onClick={() => setSelectedDuration(dur)}
                  >
                    {dur}
                  </button>
                ))}
              </div>

            </article>

            {/* Vehicle Photo Gallery (1 Large + 4 Small Grid) */}
            <article className="vehicledetail-section-block">
              <h2 className="vehicledetail-block-title">
                <Camera size={20} />
                <span>VEHICLE PHOTO GALLERY</span>
              </h2>

              <div className="vehicledetail-gallery-grid">
                <div className="veh-gal-large" onClick={() => setLightboxIndex(0)}>
                  <img src={vehicle.gallery[0]} alt={`${vehicle.name} Angle 1`} className="veh-gal-img" />
                </div>
                {vehicle.gallery.slice(1, 5).map((imgUrl, idx) => (
                  <div key={idx} className="veh-gal-thumb" onClick={() => setLightboxIndex(idx + 1)}>
                    <img src={imgUrl} alt={`${vehicle.name} View ${idx + 2}`} className="veh-gal-img" />
                  </div>
                ))}
              </div>
            </article>

            {/* Bottom CTA Banner */}
            <div className="vehicledetail-section-block" style={{ background: 'linear-gradient(135deg, #F7FAFF 0%, #EBF2FF 100%)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0A1938', marginBottom: 4 }}>
                  READY TO TRAVEL IN BANGALORE?
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Choose your vehicle and let us handle your schedule, route, and on-time pickup.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  className="btn-vehichero-primary"
                  onClick={handleBookingScroll}
                >
                  <span>Enquire For This Vehicle</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  className="btn-vehichero-secondary"
                  onClick={onBackToFleet}
                >
                  Explore Other Vehicles
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: STICKY BOOKING / ENQUIRY CARD (35%) */}
          <aside className="vehicledetail-sticky-col">
            <div id="veh-booking-card" className="veh-booking-card">
              
              <div className="veh-card-head">
                <span className="veh-card-eyebrow">BOOK THIS VEHICLE</span>
                <h3 className="veh-card-title">{vehicle.name}</h3>
                
                <div className="veh-card-pricebox">
                  <span className="veh-price-label">Pricing:</span>
                  <span className="veh-price-val">Get a Custom Quote</span>
                </div>
              </div>

              <form onSubmit={handleEnquireSubmit} className="veh-card-form">
                
                {/* Pre-selected Vehicle Display */}
                <div className="veh-form-group">
                  <label className="veh-form-label">Selected Vehicle</label>
                  <input
                    type="text"
                    value={vehicle.name}
                    readOnly
                    className="veh-card-input"
                    style={{ background: '#F7FAFF', fontWeight: 700, color: 'var(--color-primary)' }}
                  />
                </div>

                {/* Rental Type Context */}
                <div className="veh-form-group">
                  <label className="veh-form-label">Rental Type</label>
                  <select
                    value={selectedRentalType}
                    onChange={(e) => setSelectedRentalType(e.target.value)}
                    className="veh-card-select"
                  >
                    {vehicle.rentalTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Date Fields */}
                <div className="veh-form-row">
                  <div className="veh-form-group">
                    <label className="veh-form-label">Travel Date *</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="veh-card-input"
                      required
                    />
                  </div>
                  <div className="veh-form-group">
                    <label className="veh-form-label">Return Date</label>
                    <input
                      type="date"
                      min={travelDate || todayStr}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="veh-card-input"
                    />
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="veh-form-group">
                  <label className="veh-form-label">Pickup Location (Bangalore) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Airport / Indiranagar / Whitefield"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="veh-card-input"
                    required
                  />
                </div>

                {/* Destination */}
                <div className="veh-form-group">
                  <label className="veh-form-label">Destination</label>
                  <input
                    type="text"
                    placeholder="e.g. Mysore / Coorg / City Local"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="veh-card-input"
                  />
                </div>

                {/* Passenger Stepper */}
                <div className="veh-form-group">
                  <label className="veh-form-label">Passengers</label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--color-border-subtle)', borderRadius: 10, padding: '4px 10px' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 800 }}
                      onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                    >
                      −
                    </button>
                    <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>{passengers} Passengers</span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 800 }}
                      onClick={() => setPassengers((p) => Math.min(50, p + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="veh-form-group">
                  <label className="veh-form-label">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="veh-card-input"
                    required
                  />
                </div>

                {/* Submit Action */}
                <button type="submit" className="btn-veh-book">
                  <span>Enquire Now</span>
                  <ArrowRight size={15} />
                </button>

                <div className="veh-trust-reassurance">
                  <ShieldCheck size={14} color="var(--color-primary)" />
                  <span>Transparent Pricing • Chauffeur Included</span>
                </div>

              </form>

            </div>
          </aside>

        </div>
      </main>

      {/* 4. MOBILE STICKY BOTTOM BAR */}
      <div className="veh-mobile-bottom-bar">
        <div>
          <div className="veh-mobile-price-text">{vehicle.name}</div>
          <div className="veh-mobile-price-val">Custom Quote</div>
        </div>

        <button
          className="btn-veh-mobile-trigger"
          onClick={handleBookingScroll}
        >
          <span>Enquire Now</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 5. FULLSCREEN GALLERY LIGHTBOX */}
      {lightboxIndex !== null && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <button
              className="btn-lightbox-nav btn-lightbox-prev"
              onClick={() => setLightboxIndex((prev) => (prev === 0 ? vehicle.gallery.length - 1 : prev - 1))}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="btn-lightbox-nav btn-lightbox-next"
              onClick={() => setLightboxIndex((prev) => (prev === vehicle.gallery.length - 1 ? 0 : prev + 1))}
            >
              <ChevronRight size={24} />
            </button>

            <div className="gallery-lightbox-img-wrapper">
              <img
                src={vehicle.gallery[lightboxIndex]}
                alt={`${vehicle.name} Gallery`}
                className="gallery-lightbox-img"
              />
            </div>
            
            <div className="gallery-lightbox-info">
              <h3 className="gallery-lightbox-title">{vehicle.name}</h3>
              <p className="gallery-lightbox-desc">
                Photo {lightboxIndex + 1} of {vehicle.gallery.length} • Bangalore Rental Fleet
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. GLOBAL FOOTER */}
      <Footer
        onNavClick={onNavigate || onBackToFleet}
        onBookClick={handleBookingScroll}
      />

    </div>
  );
};
