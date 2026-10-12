import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  Luggage, 
  Wind, 
  ArrowRight, 
  Sparkles, 
  Car, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';
import { VEHICLES_DATA } from '../data/vehiclesData';
import { BRAND } from '../constants/branding';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ContactSection } from '../components/home/ContactSection';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api.js';
import { useDataSync } from '../hooks/useDataSync';
import '../styles/rentalcars.css';

const CATEGORY_FILTERS = ['ALL', 'SEDAN', 'SUV', 'MPV', 'TEMPO TRAVELLER', 'MINI BUS', 'LUXURY'];
const CAPACITY_FILTERS = ['ALL CAPACITIES', '2–4 PASSENGERS', '5–7 PASSENGERS', '12+ PASSENGERS'];

export const RentalCarsPage = ({ 
  onSelectVehicle, 
  onEnquireVehicle, 
  onNavClick, 
  onBookNowClick 
}) => {
  const { addToast } = useToast();
  const [vehiclesList, setVehiclesList] = useState(VEHICLES_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeCapacity, setActiveCapacity] = useState('ALL CAPACITIES');
  const [prefilled, setPrefilled] = useState({ 
    tripType: 'Local Rental',
    travelType: 'Local Rental', 
    vehiclePreference: 'Etios / Swift Dzire / Logan' 
  });

  const fetchVehicles = React.useCallback(() => {
    api.getVehicles({ enabled: true }).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(v => ({
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
          image: v.image || v.image_url || '/fleet/dzire-white.jpg',
          features: Array.isArray(v.features) ? v.features : [],
        }));
        setVehiclesList(normalized);
      }
    }).catch((err) => {
      console.warn('Notice: Using default vehicles on RentalCarsPage:', err.message);
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Rental Cars & Chauffeur Driven Cabs in Bangalore | ${BRAND.name}`;
    fetchVehicles();
  }, [fetchVehicles]);

  useDataSync('vehicles', fetchVehicles);

  const handleEnquireForVehicle = (vehicle) => {
    const pkgText = vehicle.package8hr80km 
      ? `Local 8hr/80km: ₹${vehicle.package8hr80km.toLocaleString('en-IN')}` 
      : 'Custom Tariff';
      
    const extraRates = vehicle.extraKm 
      ? ` | Extra KM: ₹${vehicle.extraKm}/km | Extra Hr: ₹${vehicle.extraHour}/hr | Night Bata: ₹${vehicle.nightBata || 250}` 
      : '';

    setPrefilled({
      tripType: 'Local Rental',
      travelType: 'Local Rental',
      vehiclePreference: vehicle.name,
      localPackage: '8 hrs / 80 km',
      passengers: vehicle.passengerCount || 4,
      pickupLocation: 'J.P. Nagar, Bangalore',
      destination: 'Bangalore Local Sightseeing & City Travel',
      message: `Enquiry for booking ${vehicle.name} (${vehicle.category} • ${vehicle.passengerCapacity} • ${vehicle.airConditioning}). Tariff: ${pkgText}${extraRates}.`
    });

    addToast({
      message: `Enquiring for ${vehicle.name} (${vehicle.category})`,
      type: 'info'
    });

    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const nameInput = el.querySelector('#enquiry-name') || el.querySelector('input');
      if (nameInput) setTimeout(() => nameInput.focus(), 600);
    }
  };

  const filteredVehicles = vehiclesList.filter((v) => {
    // Search matching
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.bestSuitedFor.toLowerCase().includes(searchQuery.toLowerCase());

    // Category matching
    const matchesCat = activeCategory === 'ALL' || v.typeCategory === activeCategory;

    // Capacity matching
    let matchesCap = true;
    if (activeCapacity === '2–4 PASSENGERS') {
      matchesCap = v.passengerCount <= 4;
    } else if (activeCapacity === '5–7 PASSENGERS') {
      matchesCap = v.passengerCount >= 5 && v.passengerCount <= 7;
    } else if (activeCapacity === '12+ PASSENGERS') {
      matchesCap = v.passengerCount >= 12;
    }

    return matchesSearch && matchesCat && matchesCap;
  });

  return (
    <div className="rentalcars-page" aria-label="Bangalore Rental Cars Marketplace">
      
      {/* 1. TOP NAVBAR */}
      <Navbar
        activeSection="services"
        onNavClick={onNavClick}
        onBookNowClick={onBookNowClick}
      />

      {/* 2. CINEMATIC HERO BANNER */}
      <header className="rentalcars-hero">
        <img
          src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80"
          alt="Bangalore rental cars fleet on highway"
          className="rentalcars-hero-bg"
        />
        <div className="rentalcars-hero-scrim" />

        <div className="rentalcars-hero-content">
          <div className="rentalcars-eyebrow">
            <Sparkles size={12} />
            <span>BANGALORE FLEET MARKETPLACE</span>
          </div>

          <h1 className="rentalcars-title">BANGALORE RENTAL CARS</h1>

          <p className="rentalcars-subtitle">
            Rent the right car for your Bangalore journey. Comfortable, reliable vehicles for city travel, airport transfers, corporate delegations and Karnataka outstation trips.
          </p>
        </div>
      </header>

      {/* 3. SEARCH & REAL-TIME FILTERS */}
      <section className="rentalcars-controls-section">
        <div className="rentalcars-controls-container">
          
          {/* Search Row */}
          <div className="rentalcars-search-row">
            <div className="rentalcars-search-box">
              <Search size={18} className="rentalcars-search-icon" />
              <input
                type="text"
                placeholder="Search by vehicle name (e.g. Innova Crysta, Sedan, Fortuner)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rentalcars-search-input"
              />
            </div>
          </div>

          {/* Vehicle Category Filter Pills */}
          <div className="rentalcars-filter-row" role="tablist" aria-label="Vehicle type filters">
            {CATEGORY_FILTERS.map((cat) => (
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

          {/* Passenger Capacity Filter Pills */}
          <div className="rentalcars-filter-row" role="tablist" aria-label="Passenger capacity filters">
            {CAPACITY_FILTERS.map((cap) => (
              <button
                key={cap}
                type="button"
                className={`btn-rental-filter ${activeCapacity === cap ? 'active' : ''}`}
                style={{ fontSize: '0.6875rem' }}
                onClick={() => setActiveCapacity(cap)}
              >
                {cap}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4. VEHICLES MARKETPLACE GRID */}
      <main className="rentalcars-grid-section">
        <div className="rentalcars-grid-container">
          
          {filteredVehicles.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
                No vehicles found matching "{searchQuery}".
              </p>
              <button
                className="btn-rental-filter active"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('ALL');
                  setActiveCapacity('ALL CAPACITIES');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="rental-grid-card"
                onClick={() => onSelectVehicle && onSelectVehicle(vehicle)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectVehicle && onSelectVehicle(vehicle);
                  }
                }}
                aria-label={`${vehicle.name} - ${vehicle.category}`}
              >
                {/* Vehicle Image — Large Cinematic */}
                <div className="rental-card-img-wrap">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="rental-card-img"
                    loading="lazy"
                  />
                  {vehicle.badge && (
                    <span className="rental-card-badge">{vehicle.badge}</span>
                  )}
                  {/* Name overlay at bottom of image */}
                  <div className="rental-card-img-label">
                    <span className="rental-img-label-cat">{vehicle.category}</span>
                    <span className="rental-img-label-name">{vehicle.name}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="rental-card-body">
                  <p className="rental-card-desc">{vehicle.description}</p>

                  {/* Specs Row */}
                  <div className="rental-card-specs">
                    <span className="rental-spec-chip">
                      <Users size={14} color="var(--color-primary)" />
                      <span>{vehicle.passengerCapacity} Seater</span>
                    </span>
                    <span className="rental-spec-chip">
                      <Luggage size={14} color="var(--color-primary)" />
                      <span>{vehicle.luggageCapacity} Bags</span>
                    </span>
                    <span className="rental-spec-chip">
                      <Wind size={14} color="var(--color-primary)" />
                      <span>{vehicle.airConditioning}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="rental-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn-card-view-details"
                      onClick={() => onSelectVehicle && onSelectVehicle(vehicle)}
                      aria-label={`View details for ${vehicle.name}`}
                    >
                      <span>View Details</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      className="btn-card-enquire-sm"
                      onClick={() => handleEnquireForVehicle(vehicle)}
                      aria-label={`Enquire for ${vehicle.name}`}
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}

        </div>
      </main>

      <ContactSection
        key={prefilled.vehiclePreference || 'default'}
        prefilledData={prefilled}
        onSubmitSuccess={(data) => {
          addToast({
            message: `Enquiry sent for ${data.vehiclePreference}! We will call you shortly.`,
            type: 'success',
          });
        }}
      />

      {/* 5. GLOBAL FOOTER */}
      <Footer
        onNavClick={onNavClick}
        onBookClick={onBookNowClick}
      />

    </div>
  );
};
