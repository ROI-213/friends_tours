import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Compass, 
  Car, 
  Users, 
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
  Camera
} from 'lucide-react';
import { getPackageBySlug, PACKAGES_DATA } from '../data/packagesData';
import { BRAND } from '../constants/branding';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { redirectToWhatsAppEnquiry } from '../lib/whatsapp';
import '../styles/packagedetail.css';

import { api } from '../lib/api.js';
import { useDataSync } from '../hooks/useDataSync';

export const PackageDetailPage = ({ 
  slug, 
  onBackToHome, 
  onOpenBookingConcierge, 
  onSelectAnotherPackage,
  onNavigate,
  onBookNowClick
}) => {
  const initialPkg = getPackageBySlug(slug) || PACKAGES_DATA[0];
  const [pkg, setPkg] = useState(initialPkg);

  const fetchPackage = React.useCallback(() => {
    const local = getPackageBySlug(slug);
    api.getPackage(slug).then((p) => {
      if (p && p.name) {
        setPkg({
          ...p,
          id: p.id,
          slug: p.slug,
          name: p.name,
          destination: p.destination || '',
          state: p.state || 'Karnataka',
          badge: p.badge || 'POPULAR',
          duration: p.duration || '1 Day',
          nights: p.nights || 'Same Day Return',
          travelType: p.travel_type || p.travelType || '',
          defaultVehicle: p.default_vehicle || p.defaultVehicle || 'Sedan / SUV',
          vehicleOptions: Array.isArray(p.vehicle_options) ? p.vehicle_options : (local?.vehicleOptions || ['Sedan', 'SUV']),
          groupSize: p.group_size || p.groupSize || '1–6 Persons',
          bestFor: p.best_for || p.bestFor || '',
          shortDescription: p.short_description || p.shortDescription || '',
          overview: p.overview || '',
          heroImage: p.hero_image || p.heroImage || p.image_url || '/destinations/nandi-hills-sunrise.jpg',
          gallery: Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery : (local?.gallery || ['/destinations/nandi-hills-sunrise.jpg']),
          highlights: Array.isArray(p.highlights) ? p.highlights : (local?.highlights || []),
          itinerary: Array.isArray(p.itinerary) ? p.itinerary : (local?.itinerary || []),
          inclusions: Array.isArray(p.inclusions) ? p.inclusions : (local?.inclusions || []),
          exclusions: Array.isArray(p.exclusions) ? p.exclusions : (local?.exclusions || []),
          travelInformation: (p.travel_information && typeof p.travel_information === 'object') ? p.travel_information : (local?.travelInformation || {}),
          priceStarting: p.price_starting || p.priceStarting || '₹1,999',
        });
      }
    }).catch((err) => {
      console.warn('Notice: Using local package detail fallback:', err.message);
    });
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const local = getPackageBySlug(slug);
    if (local) setPkg(local);
    fetchPackage();
  }, [slug, fetchPackage]);

  useDataSync('packages', fetchPackage);

  // Booking Card state
  const todayStr = new Date().toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(pkg.defaultVehicle || (pkg.vehicleOptions && pkg.vehicleOptions[0]) || 'Sedan');
  const [pickupLocation, setPickupLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Lightbox state for package gallery
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Mobile sheet open state
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Set dynamic SEO title
  useEffect(() => {
    document.title = `${pkg.name} | ${BRAND.name}`;
  }, [pkg.name]);

  // Gallery keyboard navigation & scroll lock
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev === 0 ? pkg.gallery.length - 1 : prev - 1));
        }
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev === pkg.gallery.length - 1 ? 0 : prev + 1));
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [lightboxIndex, pkg.gallery.length]);

  const handleItineraryScroll = () => {
    const el = document.getElementById('pkg-itinerary');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookingScroll = () => {
    if (window.innerWidth <= 640) {
      setIsMobileSheetOpen(true);
    } else {
      const el = document.getElementById('pkg-booking-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    const enquiryDetails = {
      type: 'package',
      title: `${pkg.name} (${pkg.destination})`,
      image: pkg.heroImage,
      badge: pkg.badge,
      duration: pkg.duration,
      travelType: pkg.travelType,
      vehiclePreference: selectedVehicle,
      travelDate: travelDate || 'Flexible / Upcoming',
      returnDate: returnDate || '',
      passengers: adults + children,
      pickupLocation: pickupLocation || 'Doorstep / Airport',
      phone: phone || '',
      email: email || '',
      description: `Package: ${pkg.name} • ${adults} Adults, ${children} Children • Vehicle: ${selectedVehicle} • Dates: ${travelDate || 'TBD'} to ${returnDate || 'TBD'}`
    };

    redirectToWhatsAppEnquiry({
      name: 'Guest',
      phone: phone || '',
      email: email || '',
      tripType: pkg.travelType || 'Tour Package',
      packageName: `${pkg.name} (${pkg.duration})`,
      vehiclePreference: selectedVehicle,
      passengers: adults + children,
      pickupLocation: pickupLocation || 'Doorstep / Airport',
      destination: pkg.destination,
      travelDate: travelDate || 'Flexible / Upcoming',
      returnDate: returnDate || '',
      specialRequests: `Tour Package: ${pkg.name} • Adults: ${adults}, Children: ${children} • Vehicle: ${selectedVehicle}`
    });

    if (onOpenBookingConcierge) {
      onOpenBookingConcierge(enquiryDetails);
    }
  };

  return (
    <div className="pkgdetail-page" aria-label={`${pkg.name} Package Details`}>
      <Navbar
        activeSection="services"
        onNavClick={onNavigate || onBackToHome}
        onBookNowClick={onBookNowClick}
      />
      
      {/* 1. CINEMATIC HERO */}
      <section className="pkgdetail-hero">
        <img
          src={pkg.heroImage}
          alt={pkg.name}
          className="pkgdetail-hero-bg"
        />
        <div className="pkgdetail-hero-scrim" />

        <div className="pkgdetail-hero-container">
          
          {/* Nav & Breadcrumbs Row */}
          <div className="pkgdetail-nav-row">
            <button
              onClick={onBackToHome}
              className="btn-pkgdetail-back"
              aria-label="Back to Homepage"
            >
              <ArrowLeft size={14} />
              <span>Back to Packages</span>
            </button>

            <nav className="pkgdetail-breadcrumbs" aria-label="Breadcrumb">
              <span className="pkgdetail-breadcrumb-link" onClick={onBackToHome}>Home</span>
              <span>/</span>
              <span className="pkgdetail-breadcrumb-link" onClick={onBackToHome}>Packages</span>
              <span>/</span>
              <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{pkg.destination}</span>
            </nav>
          </div>

          {/* Hero Content */}
          <div className="pkgdetail-hero-content">
            <div className="pkgdetail-hero-eyebrow">
              <Sparkles size={11} />
              <span>EXCLUSIVE TRAVEL EXPERIENCE</span>
            </div>

            <h1 className="pkgdetail-hero-title">{pkg.name}</h1>

            <div className="pkgdetail-hero-pills">
              <span className="pkgdetail-hero-pill">
                <Clock size={12} />
                <span>{pkg.duration}</span>
              </span>
              <span className="pkgdetail-hero-pill">
                <MapPin size={12} />
                <span>{pkg.destination}, {pkg.country}</span>
              </span>
              <span className="pkgdetail-hero-pill">
                <Car size={12} />
                <span>{pkg.defaultVehicle}</span>
              </span>
            </div>

            <p className="pkgdetail-hero-desc">
              {pkg.shortDescription}
            </p>

            <div className="pkgdetail-hero-actions">
              <button
                className="btn-pkghero-primary"
                onClick={handleBookingScroll}
              >
                <span>Book This Journey</span>
                <ArrowRight size={15} />
              </button>

              <button
                className="btn-pkghero-secondary"
                onClick={handleItineraryScroll}
              >
                <span>View Itinerary</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. QUICK PACKAGE INFO BAR */}
      <section className="pkgdetail-infobar">
        <div className="pkgdetail-infobar-container">
          <div className="pkg-info-item">
            <span className="pkg-info-label">Duration</span>
            <span className="pkg-info-val">{pkg.duration}</span>
          </div>

          <div className="pkg-info-item">
            <span className="pkg-info-label">Destination</span>
            <span className="pkg-info-val">{pkg.destination}</span>
          </div>

          <div className="pkg-info-item">
            <span className="pkg-info-label">Travel Type</span>
            <span className="pkg-info-val">{pkg.travelType}</span>
          </div>

          <div className="pkg-info-item">
            <span className="pkg-info-label">Vehicle</span>
            <span className="pkg-info-val">{pkg.defaultVehicle}</span>
          </div>

          <div className="pkg-info-item">
            <span className="pkg-info-label">Group Size</span>
            <span className="pkg-info-val">{pkg.groupSize}</span>
          </div>

          <div className="pkg-info-item">
            <span className="pkg-info-label">Best For</span>
            <span className="pkg-info-val">{pkg.bestFor}</span>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT GRID (65% Left / 35% Right) */}
      <main className="pkgdetail-main-wrapper">
        <div className="pkgdetail-grid">
          
          {/* LEFT: Complete Package Information (65%) */}
          <div className="pkgdetail-content-col">
            
            {/* Overview & Highlights */}
            <article className="pkgdetail-section-block">
              <h2 className="pkgdetail-block-title">
                <Compass size={20} />
                <span>ABOUT THIS JOURNEY</span>
              </h2>
              <p className="pkgdetail-overview-text">
                {pkg.overview}
              </p>

              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0A1938', marginBottom: 12 }}>
                TRIP HIGHLIGHTS
              </h3>
              <div className="pkgdetail-highlights-grid">
                {pkg.highlights.map((highlight, idx) => (
                  <div key={idx} className="pkgdetail-highlight-item">
                    <Check size={16} className="pkgdetail-highlight-icon" strokeWidth={2.5} />
                    <span className="pkgdetail-highlight-text">{highlight}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* Itinerary Timeline */}
            <article id="pkg-itinerary" className="pkgdetail-section-block">
              <h2 className="pkgdetail-block-title">
                <Calendar size={20} />
                <span>YOUR JOURNEY ITINERARY</span>
              </h2>

              <div className="pkgdetail-timeline">
                {pkg.itinerary.map((dayItem, idx) => (
                  <div key={idx} className="pkgdetail-timeline-item">
                    <div className="pkgdetail-timeline-dot" />
                    <span className="pkgdetail-day-tag">{dayItem.day}</span>
                    <h3 className="pkgdetail-timeline-title">{dayItem.title}</h3>
                    <p className="pkgdetail-timeline-desc">{dayItem.description}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* Inclusions & Exclusions */}
            <article className="pkgdetail-section-block">
              <div className="pkgdetail-inc-grid">
                {/* Inclusions */}
                <div className="pkgdetail-inc-col">
                  <div className="pkgdetail-inc-head included">
                    <Check size={18} strokeWidth={3} />
                    <span>WHAT'S INCLUDED</span>
                  </div>
                  {pkg.inclusions.map((inc, i) => (
                    <div key={i} className="pkgdetail-inc-item">
                      <Check size={14} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>

                {/* Exclusions */}
                <div className="pkgdetail-inc-col">
                  <div className="pkgdetail-inc-head excluded">
                    <X size={18} strokeWidth={3} />
                    <span>NOT INCLUDED</span>
                  </div>
                  {pkg.exclusions.map((exc, i) => (
                    <div key={i} className="pkgdetail-inc-item">
                      <X size={14} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Travel Information */}
            <article className="pkgdetail-section-block">
              <h2 className="pkgdetail-block-title">
                <ShieldCheck size={20} />
                <span>TRAVEL INFORMATION &amp; POLICIES</span>
              </h2>

              <table className="pkgdetail-table">
                <tbody>
                  <tr>
                    <td>Pickup Location</td>
                    <td>{pkg.travelInformation.pickup}</td>
                  </tr>
                  <tr>
                    <td>Drop Location</td>
                    <td>{pkg.travelInformation.drop}</td>
                  </tr>
                  <tr>
                    <td>Route Distance</td>
                    <td>{pkg.travelInformation.distance}</td>
                  </tr>
                  <tr>
                    <td>Best Time to Travel</td>
                    <td>{pkg.travelInformation.bestTime}</td>
                  </tr>
                  <tr>
                    <td>Expressway Tolls &amp; Parking</td>
                    <td>{pkg.travelInformation.tollIncluded}</td>
                  </tr>
                  <tr>
                    <td>Driver Accommodation</td>
                    <td>{pkg.travelInformation.driverAllowance}</td>
                  </tr>
                  <tr>
                    <td>Vehicle Sanitization</td>
                    <td>{pkg.travelInformation.sanitization}</td>
                  </tr>
                </tbody>
              </table>
            </article>

            {/* Destination Gallery (1 Large + 4 Small Grid) */}
            <article className="pkgdetail-section-block">
              <h2 className="pkgdetail-block-title">
                <Camera size={20} />
                <span>JOURNEY PHOTO GALLERY</span>
              </h2>

              <div className="pkgdetail-gallery-grid">
                <div className="pkg-gal-large" onClick={() => setLightboxIndex(0)}>
                  <img src={pkg.gallery[0]} alt={`${pkg.name} View 1`} className="pkg-gal-img" />
                </div>
                {pkg.gallery.slice(1, 5).map((imgUrl, idx) => (
                  <div key={idx} className="pkg-gal-thumb" onClick={() => setLightboxIndex(idx + 1)}>
                    <img src={imgUrl} alt={`${pkg.name} View ${idx + 2}`} className="pkg-gal-img" />
                  </div>
                ))}
              </div>
            </article>

            {/* Bottom Explore More CTA */}
            <div className="pkgdetail-bottom-cta">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0A1938', marginBottom: 4 }}>
                  READY TO EXPERIENCE THIS JOURNEY?
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Speak directly with our concierge desk to customize your schedule and vehicle allocation.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  className="btn-pkghero-primary"
                  onClick={handleBookingScroll}
                >
                  <span>Book This Journey</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  className="btn-pkg-exploremore"
                  onClick={onBackToHome}
                >
                  Explore More Packages
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: STICKY BOOKING CARD (35%) */}
          <aside className="pkgdetail-sticky-col">
            <div id="pkg-booking-card" className="pkg-booking-card">
              
              <div className="pkg-card-head">
                <span className="pkg-card-eyebrow">RESERVE THIS PACKAGE</span>
                <h3 className="pkg-card-title">{pkg.name}</h3>
                
                <div className="pkg-card-pricebox">
                  <span className="pkg-price-label">Pricing:</span>
                  <span className="pkg-price-val">
                    {pkg.priceStarting ? `Starting ${pkg.priceStarting}` : 'Custom Quote'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleCheckAvailability} className="pkg-card-form">
                
                {/* Date Fields */}
                <div className="pkg-form-row">
                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Travel Date *</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="pkg-card-input"
                      required
                    />
                  </div>
                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Return Date</label>
                    <input
                      type="date"
                      min={travelDate || todayStr}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="pkg-card-input"
                    />
                  </div>
                </div>

                {/* Traveller Selectors (Adults & Children) */}
                <div className="pkg-form-row">
                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Adults (12y+)</label>
                    <div className="pkg-stepper-row">
                      <button
                        type="button"
                        className="btn-pkg-step"
                        onClick={() => setAdults((a) => Math.max(1, a - 1))}
                        disabled={adults <= 1}
                      >
                        −
                      </button>
                      <span style={{ fontWeight: 800, fontSize: '0.8125rem' }}>{adults}</span>
                      <button
                        type="button"
                        className="btn-pkg-step"
                        onClick={() => setAdults((a) => a + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="pkg-form-group">
                    <label className="pkg-form-label">Children (2–11y)</label>
                    <div className="pkg-stepper-row">
                      <button
                        type="button"
                        className="btn-pkg-step"
                        onClick={() => setChildren((c) => Math.max(0, c - 1))}
                        disabled={children <= 0}
                      >
                        −
                      </button>
                      <span style={{ fontWeight: 800, fontSize: '0.8125rem' }}>{children}</span>
                      <button
                        type="button"
                        className="btn-pkg-step"
                        onClick={() => setChildren((c) => c + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vehicle Selection */}
                <div className="pkg-form-group">
                  <label className="pkg-form-label">Vehicle Preference</label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="pkg-card-select"
                  >
                    {pkg.vehicleOptions.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                {/* Pickup Location */}
                <div className="pkg-form-group">
                  <label className="pkg-form-label">Pickup Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Airport / Home / Hotel"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="pkg-card-input"
                  />
                </div>

                {/* Phone Number */}
                <div className="pkg-form-group">
                  <label className="pkg-form-label">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pkg-card-input"
                    required
                  />
                </div>

                {/* Submit Action */}
                <button type="submit" className="btn-pkg-book">
                  <span>Check Availability</span>
                  <ArrowRight size={15} />
                </button>

                <div className="pkg-trust-reassurance">
                  <ShieldCheck size={14} color="var(--color-primary)" />
                  <span>Instant Concierge Handoff • No Advance Fees</span>
                </div>

              </form>

            </div>
          </aside>

        </div>
      </main>

      {/* 4. MOBILE STICKY BOTTOM BOOKING BAR */}
      <div className="pkg-mobile-bottom-bar">
        <div>
          <div className="pkg-mobile-price-text">Estimated Package</div>
          <div className="pkg-mobile-price-val">
            {pkg.priceStarting ? `From ${pkg.priceStarting}` : 'Custom Quote'}
          </div>
        </div>

        <button
          className="btn-pkg-mobile-trigger"
          onClick={() => {
            const el = document.getElementById('pkg-booking-card');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>Book Journey</span>
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
              onClick={() => setLightboxIndex((prev) => (prev === 0 ? pkg.gallery.length - 1 : prev - 1))}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="btn-lightbox-nav btn-lightbox-next"
              onClick={() => setLightboxIndex((prev) => (prev === pkg.gallery.length - 1 ? 0 : prev + 1))}
            >
              <ChevronRight size={24} />
            </button>

            <div className="gallery-lightbox-img-wrapper">
              <img
                src={pkg.gallery[lightboxIndex]}
                alt={`${pkg.name} Gallery`}
                className="gallery-lightbox-img"
              />
            </div>
            
            <div className="gallery-lightbox-info">
              <h3 className="gallery-lightbox-title">{pkg.name}</h3>
              <p className="gallery-lightbox-desc">
                Photo {lightboxIndex + 1} of {pkg.gallery.length} • Curated Tour Journey
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. GLOBAL FOOTER (Preserved) */}
      <Footer
        onNavClick={onNavigate || onBackToHome}
        onBookClick={handleBookingScroll}
      />

    </div>
  );
};
