import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Luggage, 
  Wind, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  ArrowUpRight, 
  FileText,
  Car,
  CheckCircle2,
  Calendar,
  Phone,
  MessageCircle,
  Clock
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useDataSync } from '../../hooks/useDataSync';
import { BRAND } from '../../constants/branding';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { VEHICLES_DATA } from '../../data/vehiclesData.js';
import '../../styles/fleet.css';

const CATEGORIES = [
  { id: 'all', label: 'All Fleet' },
  { id: 'sedan', label: 'Sedans (4 Seater)', filter: (v) => v.type_category === 'SEDAN' || v.typeCategory === 'SEDAN' },
  { id: 'mpv', label: 'Innova & MPVs (6-7 Seater)', filter: (v) => v.type_category === 'MPV' || v.typeCategory === 'MPV' },
  { id: 'tempo', label: 'Tempo Travellers (12-17)', filter: (v) => v.type_category === 'TEMPO TRAVELLER' || v.typeCategory === 'TEMPO TRAVELLER' },
  { id: 'luxury', label: 'VIP Luxury Class', filter: (v) => v.type_category === 'LUXURY' || v.typeCategory === 'LUXURY' },
];

export const FleetSection = ({ onEnquireVehicle, onViewVehicleDetails, onOpenTariffModal }) => {
  const { getSetting } = useSiteSettings();
  const whatsapp = getSetting('whatsapp', BRAND.whatsapp);
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, '');
  const [activeCategory, setActiveCategory] = useState('all');
  const [vehicles, setVehicles] = useState(VEHICLES_DATA);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES_DATA[0] || null);

  const fetchVehicles = React.useCallback(() => {
    api.getVehicles({ enabled: true }).then(data => {
      const items = Array.isArray(data) ? data : data?.vehicles;
      if (Array.isArray(items)) {
        // Normalize API response (snake_case) to match component expectations
        const normalized = items.map(v => ({
          ...v,
          typeCategory: v.type_category || v.typeCategory || 'SEDAN',
          passengerCapacity: v.passenger_capacity || v.passengerCapacity || '',
          luggageCapacity: v.luggage_capacity || v.luggageCapacity || '',
          airConditioning: v.air_conditioning || v.airConditioning || 'Yes',
          bestSuitedFor: v.best_suited_for || v.bestSuitedFor || '',
          package8hr80km: v.package_8hr_80km || v.package8hr80km || null,
          outstationMinPerDay: v.outstation_min_per_day || v.outstationMinPerDay || null,
          features: Array.isArray(v.features) ? v.features : (typeof v.features === 'string' ? (() => { try { const p = JSON.parse(v.features); return Array.isArray(p) ? p : [v.features]; } catch(_) { return [v.features]; } })() : []),
          image: v.image_url || v.image || '',
        }));
        setVehicles(normalized);
        setSelectedVehicle(prev => {
          if (!prev) return normalized[0] || null;
          const found = normalized.find(v => v.id === prev.id);
          return found || normalized[0] || null;
        });
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Real-time synchronization across all tabs and devices
  useDataSync('vehicles', fetchVehicles);

  const filteredVehicles = useMemo(() => {
    if (activeCategory === 'all') return vehicles;
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    return cat && cat.filter ? vehicles.filter(cat.filter) : vehicles;
  }, [activeCategory, vehicles]);

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    const cat = CATEGORIES.find((c) => c.id === catId);
    const list = cat && cat.filter ? vehicles.filter(cat.filter) : vehicles;
    if (list.length > 0) setSelectedVehicle(list[0]);
  };

  const handleReserveWhatsApp = (vehicle) => {
    const text = `Hi Friends Tours, I would like to reserve the *${vehicle.name}* (${vehicle.category}) for travel in Bangalore / Outstation. Please share rates and driver availability.`;
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!selectedVehicle) return null;

  return (
    <section id="fleet" className="fleet-section" aria-label="Bangalore Rental Cars Marketplace">
      <div className="fleet-container">
        
        {/* Section Header */}
        <div className="fleet-header reveal-on-scroll">
          <span className="fleet-eyebrow">
            <Sparkles size={13} />
            <span>OFFICIAL 2026 COMMERCIAL FLEET</span>
          </span>
          <h2 className="fleet-title">BANGALORE RENTAL CARS &amp; SHUTTLES</h2>
          <p className="fleet-subtitle">
            Pristine yellow-board commercial vehicles for employee transportation, airport transfers, city hourly packages, and highway road trips across Karnataka.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="fleet-filter-bar" role="tablist" aria-label="Filter fleet by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`fleet-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleSelectCategory(cat.id)}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Vehicle Showcase Stage Panel */}
        <div className="fleet-showcase-panel reveal-scale">
          
          {/* Left: Clean Vehicle Image Stage */}
          <div className="fleet-image-stage">
            {selectedVehicle.badge && (
              <span className="fleet-badge-overlay">{selectedVehicle.badge}</span>
            )}
            
            <img
              key={selectedVehicle.id}
              src={selectedVehicle.image}
              alt={`${selectedVehicle.name} - ${selectedVehicle.category}`}
              className="fleet-vehicle-img"
              loading="lazy"
            />
          </div>

          {/* Right: Vehicle Details & Specifications */}
          <div className="fleet-info-stage">
            <div className="fleet-info-header">
              <span className="fleet-vehicle-category">{selectedVehicle.category}</span>
              <h3 className="fleet-vehicle-name">{selectedVehicle.name}</h3>
              
              {/* Dual Transparent Pricing Box */}
              <div className="fleet-pricing-dual-box">
                {selectedVehicle.package8hr80km && (
                  <div className="price-item">
                    <span className="price-label">Local 8Hr / 80Km:</span>
                    <strong className="price-val">₹{selectedVehicle.package8hr80km.toLocaleString('en-IN')}</strong>
                  </div>
                )}
                {selectedVehicle.outstationMinPerDay && (
                  <div className="price-item">
                    <span className="price-label">Outstation (Min 300Km):</span>
                    <strong className="price-val outstation">₹{selectedVehicle.outstationMinPerDay.toLocaleString('en-IN')}/day</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Metric Specs Grid */}
            <div className="fleet-specs-grid">
              <div className="fleet-spec-card">
                <span className="fleet-spec-label">
                  <Users size={13} />
                  <span>Passengers</span>
                </span>
                <span className="fleet-spec-value">{selectedVehicle.passengerCapacity}</span>
              </div>

              <div className="fleet-spec-card">
                <span className="fleet-spec-label">
                  <Luggage size={13} />
                  <span>Luggage</span>
                </span>
                <span className="fleet-spec-value">{selectedVehicle.luggageCapacity}</span>
              </div>

              <div className="fleet-spec-card">
                <span className="fleet-spec-label">
                  <Wind size={13} />
                  <span>Air Con</span>
                </span>
                <span className="fleet-spec-value">{selectedVehicle.airConditioning}</span>
              </div>
            </div>

            {/* Best Suited For Box */}
            <div className="fleet-suited-box">
              <Compass size={15} color="var(--color-primary, #0D256C)" />
              <div>
                <span className="fleet-suited-label">Best Suited For: </span>
                <span>{selectedVehicle.bestSuitedFor}</span>
              </div>
            </div>

            {/* Key Service Inclusions */}
            <ul className="fleet-feature-list">
              {selectedVehicle.features.slice(0, 4).map((feat, idx) => (
                <li key={idx} className="fleet-feature-item">
                  <Check size={14} className="fleet-feature-check" strokeWidth={2.5} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons Row */}
            <div className="fleet-actions-group">
              <button
                type="button"
                className="btn-fleet-reserve"
                onClick={() => handleReserveWhatsApp(selectedVehicle)}
                aria-label={`Reserve ${selectedVehicle.name}`}
              >
                <span>Reserve {selectedVehicle.name}</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                className="btn-fleet-view-details"
                onClick={() => onViewVehicleDetails && onViewVehicleDetails(selectedVehicle)}
                aria-label={`View details for ${selectedVehicle.name}`}
              >
                <span>Full Rate Card</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

          </div>

        </div>

        {/* Horizontal Vehicle Selector Thumbnails Carousel */}
        <div className="fleet-selector-wrapper reveal-on-scroll">
          <div className="fleet-selector-scroll" role="tablist" aria-label="Bangalore Vehicle Categories">
            {filteredVehicles.map((vehicle) => {
              const isActive = selectedVehicle.id === vehicle.id;
              return (
                <div
                  key={vehicle.id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  className={`fleet-tile ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedVehicle(vehicle)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedVehicle(vehicle);
                    }
                  }}
                >
                  {isActive && (
                    <span className="fleet-tile-selected-badge">ACTIVE</span>
                  )}
                  
                  <div className="fleet-tile-img-container">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="fleet-tile-thumb"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="fleet-tile-name">{vehicle.name}</div>
                  <div className="fleet-tile-cat">{vehicle.category}</div>
                  
                  {vehicle.package8hr80km && (
                    <div className="fleet-tile-price">
                      From ₹{vehicle.package8hr80km.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
