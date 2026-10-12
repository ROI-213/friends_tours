import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Car, 
  ShieldCheck, 
  Search 
} from 'lucide-react';
import { PACKAGES_DATA } from '../data/packagesData';
import { BRAND } from '../constants/branding';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ContactSection } from '../components/home/ContactSection';
import { LocalTransferCalculator } from '../components/local/LocalTransferCalculator';
import { useToast } from '../context/ToastContext';

import { api } from '../lib/api.js';
import { useDataSync } from '../hooks/useDataSync';

const CATEGORIES = ['ALL', 'DAY TRIPS', 'WEEKEND', 'FAMILY', 'NATURE', 'HERITAGE'];

export const LocalPackagesPage = ({ onNavigate, onBookNowClick, onSelectPackage, onOpenBookingModal }) => {
  const { addToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [dbPackages, setDbPackages] = useState([]);
  const [prefilledBooking, setPrefilledBooking] = useState({
    travelType: 'Bangalore Local',
    destination: 'Bangalore City Sightseeing'
  });

  const fetchPackages = React.useCallback(() => {
    api.getPackages({ enabled: true }).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(p => ({
          ...p,
          id: p.id,
          name: p.name,
          slug: p.slug,
          destination: p.destination || 'Karnataka',
          duration: p.duration || '1 Day',
          category: Array.isArray(p.category) ? p.category[0] : (p.category || 'DAY TRIPS'),
          badge: p.badge || 'POPULAR',
          defaultVehicle: p.default_vehicle || 'Sedan / SUV',
          heroImage: p.hero_image || p.image_url || '/destinations/bangalore-city.jpg',
          shortDescription: p.short_description || p.overview || '',
          priceStarting: p.price_starting || '₹1,999'
        }));
        setDbPackages(normalized);
      }
    }).catch((err) => {
      console.warn('Notice: Using default packages on LocalPackagesPage:', err.message);
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Bangalore Local Packages & Hourly Cab Rates | ${BRAND.name}`;
    fetchPackages();
  }, [fetchPackages]);

  useDataSync('packages', fetchPackages);

  const handleBookLocalTransfer = (bookingData) => {
    setPrefilledBooking({
      travelType: 'Local Rental',
      tripType: 'Local Rental',
      pickupLocation: bookingData.pickupLocation || 'J.P. Nagar, Bangalore',
      destination: bookingData.destination || 'Bangalore Local Sightseeing & City Travel',
      vehiclePreference: bookingData.vehiclePreference,
      localPackage: bookingData.localPackage || '8 hrs / 80 km',
      message: `Selected Package: ${bookingData.description}`
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

  const packagesList = dbPackages.length > 0 ? dbPackages : [
    ...PACKAGES_DATA,
    {
      id: 'bangalore-city-tour',
      name: 'Bangalore City Heritage & Gardens Explorer',
      slug: 'bangalore-city-tour',
      destination: 'Bangalore Local',
      duration: 'Full Day (8hr/80km)',
      category: 'HERITAGE',
      badge: 'POPULAR CITY TRIP',
      defaultVehicle: 'Sedan / SUV / Innova',
      heroImage: '/destinations/bangalore-city.jpg',
      shortDescription: 'Visit Lalbagh Botanical Garden, Cubbon Park, Vidhana Soudha, Bangalore Palace, and ISKCON Temple with a dedicated city chauffeur.',
      priceStarting: '₹2,499'
    },
    {
      id: 'ramanagara-adventure',
      name: 'Ramanagara Hill & Adventure Day Trip',
      slug: 'ramanagara-adventure',
      destination: 'Ramanagara',
      duration: '1 Day',
      category: 'NATURE',
      badge: 'WEEKEND ADVENTURE',
      defaultVehicle: 'Sedan / SUV',
      heroImage: '/destinations/ramanagara-hills.jpg',
      shortDescription: 'Explore the iconic Sholay rock boulders, silk cocoon markets, and countryside nature trails just 50km from Bangalore.',
      priceStarting: '₹2,299'
    }
  ];

  const filtered = packagesList.filter((pkg) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'DAY TRIPS') return pkg.duration.includes('1 Day') || pkg.duration.includes('Full Day');
    if (activeCategory === 'WEEKEND') return pkg.duration.includes('2 Days') || pkg.badge.includes('WEEKEND');
    if (activeCategory === 'NATURE') return pkg.destination.includes('Coorg') || pkg.destination.includes('Chikka') || pkg.destination.includes('Ramanagara');
    if (activeCategory === 'HERITAGE') return pkg.destination.includes('Mysore') || pkg.name.includes('Heritage') || pkg.destination.includes('Bangalore');
    if (activeCategory === 'FAMILY') return true;
    return true;
  });

  return (
    <div className="page-container" aria-label="Bangalore Local Packages">
      <Navbar
        activeSection="services"
        onNavClick={onNavigate}
        onBookNowClick={onBookNowClick}
      />

      {/* 1. HERO */}
      <header className="page-hero">
        <img
          src="/destinations/bangalore-city.jpg"
          alt="Bangalore local getaways"
          className="page-hero-bg"
        />
        <div className="page-hero-scrim" />

        <div className="page-hero-content">
          <nav className="page-breadcrumbs" aria-label="Breadcrumb">
            <span className="page-breadcrumb-link" onClick={() => onNavigate('/')}>Home</span>
            <span>/</span>
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Local Packages</span>
          </nav>

          <div className="page-eyebrow">
            <Sparkles size={11} />
            <span>HOURLY CABS &amp; CURATED ESCAPES</span>
          </div>

          <h1 className="page-title">BANGALORE LOCAL CABS &amp; PACKAGES</h1>

          <p className="page-subtitle">
            Transparent 4hr/40km and 8hr/80km local city packages, day sightseeing circuits, and weekend getaways directly from your Bangalore doorstep.
          </p>
        </div>
      </header>

      {/* 2. LOCAL HOURLY TRANSFER CALCULATOR & PRICING */}
      <LocalTransferCalculator onBookLocalPackage={handleBookLocalTransfer} />

      {/* 3. FILTER CONTROLS FOR GETAWAYS */}
      <section className="rentalcars-controls-section">
        <div className="rentalcars-controls-container">
          <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 10 }}>
            EXPLORE DAY TRIPS &amp; GETAWAYS
          </div>
          <div className="rentalcars-filter-row" role="tablist" aria-label="Package categories">
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

      {/* 4. PACKAGES GRID */}
      <main className="rentalcars-grid-section">
        <div className="rentalcars-grid-container">
          {filtered.map((pkg) => (
            <article
              key={pkg.id}
              className="rental-grid-card"
              onClick={() => onNavigate(`/packages/${pkg.slug}`)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(`/packages/${pkg.slug}`);
                }
              }}
            >
              <div className="rental-card-img-wrap">
                <img src={pkg.heroImage} alt={pkg.name} className="rental-card-img" />
                <span className="rental-card-badge">{pkg.badge}</span>
              </div>

              <div className="rental-card-body">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <MapPin size={12} color="var(--color-primary)" />
                    <span className="rental-card-category">{pkg.destination}</span>
                  </div>
                  <h2 className="rental-card-title">{pkg.name}</h2>
                  <p className="rental-card-desc">{pkg.shortDescription}</p>
                </div>

                <div>
                  <div className="rental-card-specs">
                    <span className="rental-spec-chip">
                      <Clock size={12} color="var(--color-primary)" />
                      <span>{pkg.duration}</span>
                    </span>
                    <span className="rental-spec-chip">
                      <Car size={12} color="var(--color-primary)" />
                      <span>{pkg.defaultVehicle}</span>
                    </span>
                  </div>

                  <div className="rental-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn-card-view-details"
                      onClick={() => onNavigate(`/packages/${pkg.slug}`)}
                    >
                      <span>View Package</span>
                      <ArrowRight size={13} />
                    </button>

                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {pkg.priceStarting ? `From ${pkg.priceStarting}` : 'Custom Quote'}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <ContactSection
        prefilledData={prefilledBooking}
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
