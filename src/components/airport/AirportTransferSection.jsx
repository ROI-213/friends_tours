import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Plane, 
  MapPin, 
  Car, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeftRight,
  Info,
  Sparkles,
  UserCheck,
  Luggage
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useDataSync } from '../../hooks/useDataSync';
import { 
  AIRPORT_TRANSFER_CONFIG, 
  BENGALURU_AIRPORT_AREAS, 
  POPULAR_AIRPORT_ROUTES, 
  AIRPORT_FAQS,
  roundToNearest50
} from '../../data/airportTransferData';
import '../../styles/airport.css';

export const AirportTransferSection = ({ onBookTransfer }) => {
  const [airportAreas, setAirportAreas] = useState(BENGALURU_AIRPORT_AREAS);
  // State
  const [direction, setDirection] = useState('cityToAirport'); // 'cityToAirport' | 'airportToCity'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState(BENGALURU_AIRPORT_AREAS[8]); // Default: Whitefield / ITPL
  const [selectedVehicle, setSelectedVehicle] = useState('sedan'); // 'sedan' | 'suv' | 'premium'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchAirportAreas = useCallback(() => {
    api.getAirportAreas().then((data) => {
      if (Array.isArray(data)) {
        const dynamic = data.map(a => ({
          id: a.id,
          name: a.name,
          aliases: [(a.name || '').toLowerCase()],
          distanceKm: a.distance_km || 30,
          estTime: a.est_time || '45-60 mins',
          cityToAirportFare: a.city_to_airport_fare || 1000,
          airportToCityFare: a.airport_to_city_fare || 1000,
          isPopular: a.sort_order <= 3,
        }));
        setAirportAreas(dynamic);
        setSelectedArea(prev => {
          if (!prev) return dynamic[0] || null;
          const found = dynamic.find(d => d.id === prev.id);
          return found || dynamic[0] || null;
        });
      }
    }).catch((err) => {
      console.warn('Notice: Using default airport areas, API fallback active:', err.message);
    });
  }, []);

  useEffect(() => {
    fetchAirportAreas();
  }, [fetchAirportAreas]);

  useDataSync('airport-areas', fetchAirportAreas);
  
  // Custom unlisted area fallback
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customDistance, setCustomDistance] = useState(35);
  const [customAreaName, setCustomAreaName] = useState('');

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Filtered dropdown options matching search query or aliases
  const filteredAreas = useMemo(() => {
    if (!searchQuery.trim()) return airportAreas;
    const query = searchQuery.toLowerCase().trim();
    return airportAreas.filter((area) => {
      const nameMatch = area.name.toLowerCase().includes(query);
      const aliasMatch = (area.aliases || []).some(alias => alias.toLowerCase().includes(query));
      return nameMatch || aliasMatch;
    });
  }, [searchQuery, airportAreas]);

  // Calculate current fare based on selected direction, area, vehicle multiplier, and rounding rules
  const currentFare = useMemo(() => {
    const vehicleObj = AIRPORT_TRANSFER_CONFIG.vehiclePricing[selectedVehicle];
    const multiplier = vehicleObj ? vehicleObj.multiplier : 1.0;

    if (isCustomMode) {
      const calculated = (customDistance * AIRPORT_TRANSFER_CONFIG.fallbackRatePerKm + AIRPORT_TRANSFER_CONFIG.fallbackBaseCharge) * multiplier;
      return roundToNearest50(calculated);
    }

    if (!selectedArea) return 1000;

    const baseFare = direction === 'cityToAirport' 
      ? selectedArea.cityToAirportFare 
      : selectedArea.airportToCityFare;

    return roundToNearest50(baseFare * multiplier);
  }, [direction, selectedArea, selectedVehicle, isCustomMode, customDistance]);

  // Handle selecting an area from dropdown
  const handleSelectArea = (area) => {
    setSelectedArea(area);
    setSearchQuery(area.name);
    setIsDropdownOpen(false);
    setIsCustomMode(false);
  };

  // Handle selecting a popular route card
  const handleSelectPopularRoute = (areaId) => {
    const area = airportAreas.find(a => a.id === areaId) || BENGALURU_AIRPORT_AREAS.find(a => a.id === areaId);
    if (area) {
      setSelectedArea(area);
      setSearchQuery(area.name);
      setIsCustomMode(false);
      // Smooth scroll up to calculator if below
      const calcEl = document.getElementById('airport-calculator');
      if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trigger Booking Flow with prefilled details
  const handleProceedBooking = () => {
    const vehicleObj = AIRPORT_TRANSFER_CONFIG.vehiclePricing[selectedVehicle];
    const pickup = direction === 'cityToAirport' 
      ? (isCustomMode ? (customAreaName || 'Bengaluru Pickup') : selectedArea.name)
      : 'Kempegowda International Airport (BLR)';
      
    const destination = direction === 'cityToAirport'
      ? 'Kempegowda International Airport (BLR)'
      : (isCustomMode ? (customAreaName || 'Bengaluru Destination') : selectedArea.name);

    if (onBookTransfer) {
      onBookTransfer({
        type: 'airport-transfer',
        title: `BLR Airport Transfer (${vehicleObj.name})`,
        pickupLocation: pickup,
        destination: destination,
        travelType: 'Airport Transfer',
        vehiclePreference: vehicleObj.example,
        estimatedFare: currentFare,
        badge: `Estimated Fare: ₹${currentFare.toLocaleString('en-IN')}`,
        description: `Route: ${pickup} → ${destination} | Vehicle: ${vehicleObj.name} (${vehicleObj.example}) | Distance: ${isCustomMode ? customDistance + ' km' : selectedArea.distanceKm + ' km'} | Est. Time: ${isCustomMode ? '45-60 mins' : selectedArea.estTime}`
      });
    }
  };

  return (
    <section id="airport-calculator" className="airport-transfer-section" aria-label="Bengaluru Airport Transfer Pricing Calculator">
      <div className="airport-container">
        
        {/* Section Header */}
        <div className="airport-header">
          <div className="airport-eyebrow">
            <Plane size={13} />
            <span>KEMPEGOWDA INTERNATIONAL AIRPORT (BLR) FARES</span>
          </div>
          <h2 className="airport-title">
            Airport Transfers from Bengaluru to BLR Airport
          </h2>
          <p className="airport-subtitle">
            Fixed-price private airport transfers from major Bengaluru localities to Kempegowda International Airport. Choose your pickup area and vehicle to view your estimated fare.
          </p>
        </div>

        {/* CALCULATOR MAIN CONTAINER */}
        <div className="airport-calc-wrapper">
          <div className="airport-calc-grid">
            
            {/* LEFT COLUMN: Controls & Area Selection */}
            <div className="airport-inputs-col">
              
              {/* Direction Switcher */}
              <div className="airport-form-group">
                <label className="airport-label">
                  <span>TRANSFER DIRECTION</span>
                  <ArrowLeftRight size={14} color="var(--color-primary)" />
                </label>
                <div className="airport-direction-toggle">
                  <button
                    type="button"
                    className={`btn-direction-tab ${direction === 'cityToAirport' ? 'active' : ''}`}
                    onClick={() => setDirection('cityToAirport')}
                  >
                    <span>Bengaluru → BLR Airport</span>
                  </button>
                  <button
                    type="button"
                    className={`btn-direction-tab ${direction === 'airportToCity' ? 'active' : ''}`}
                    onClick={() => setDirection('airportToCity')}
                  >
                    <span>BLR Airport → Bengaluru</span>
                  </button>
                </div>
              </div>

              {/* Area Search / Dropdown Autocomplete */}
              <div className="airport-form-group">
                <label className="airport-label">
                  <span>{direction === 'cityToAirport' ? 'SELECT YOUR BENGALURU PICKUP AREA' : 'SELECT YOUR BENGALURU DROP LOCALITY'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    17+ Areas Supported
                  </span>
                </label>

                <div className="airport-search-wrap">
                  <MapPin size={18} className="airport-input-icon" />
                  <input
                    type="text"
                    placeholder="Search area (e.g., Whitefield, HSR, ITPL, E-City, Hebbal...)"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="airport-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="airport-clear-btn"
                      onClick={() => {
                        setSearchQuery('');
                        setIsDropdownOpen(true);
                      }}
                      aria-label="Clear area search"
                    >
                      <X size={16} />
                    </button>
                  )}

                  {/* Autocomplete Dropdown */}
                  {isDropdownOpen && (
                    <div className="airport-dropdown-menu">
                      {filteredAreas.length > 0 ? (
                        filteredAreas.map((area) => (
                          <div
                            key={area.id}
                            className={`airport-dropdown-option ${selectedArea?.id === area.id && !isCustomMode ? 'selected' : ''}`}
                            onClick={() => handleSelectArea(area)}
                          >
                            <div className="airport-option-name">{area.name}</div>
                            <div className="airport-option-meta">
                              <span>{area.distanceKm} km</span>
                              <span>•</span>
                              <span>Starting ₹{area.cityToAirportFare}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '12px 14px', fontSize: '0.85rem', color: '#666' }}>
                          No exact area match found. 
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomMode(true);
                              setCustomAreaName(searchQuery);
                              setIsDropdownOpen(false);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-primary)',
                              fontWeight: 800,
                              cursor: 'pointer',
                              marginLeft: '6px'
                            }}
                          >
                            Use custom fare estimator →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Area Distance Fallback Slider if activated */}
              {isCustomMode && (
                <div style={{ background: '#F7FAFF', padding: 14, borderRadius: 16, border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>Custom Locality: {customAreaName || 'Unlisted Area'}</span>
                    <span style={{ color: 'var(--color-primary)' }}>{customDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={customDistance}
                    onChange={(e) => setCustomDistance(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    style={{ fontSize: '0.75rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6 }}
                  >
                    ← Back to standard Bengaluru areas
                  </button>
                </div>
              )}

              {/* Vehicle Selection Tabs */}
              <div className="airport-form-group">
                <label className="airport-label">
                  <span>SELECT VEHICLE CATEGORY</span>
                </label>
                <div className="airport-vehicle-selector">
                  {Object.values(AIRPORT_TRANSFER_CONFIG.vehiclePricing).map((v) => (
                    <div
                      key={v.id}
                      className={`airport-vehicle-card ${selectedVehicle === v.id ? 'active' : ''}`}
                      onClick={() => setSelectedVehicle(v.id)}
                    >
                      <Car size={22} color={selectedVehicle === v.id ? 'var(--color-primary)' : '#666'} />
                      <span className="airport-vehicle-title">{v.name}</span>
                      <span className="airport-vehicle-example">{v.example}</span>
                      <span className="airport-vehicle-capacity">{v.passengers}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Live Interactive Fare Card */}
            <div className="airport-live-card">
              
              <div className="airport-card-header">
                <div>
                  <div className="airport-route-badge">
                    {direction === 'cityToAirport' ? 'CITY TO AIRPORT DROP' : 'AIRPORT PICKUP TO CITY'}
                  </div>
                  <h3 className="airport-route-title">
                    {direction === 'cityToAirport' 
                      ? `${isCustomMode ? (customAreaName || 'Custom Area') : selectedArea.name} → BLR Airport`
                      : `BLR Airport → ${isCustomMode ? (customAreaName || 'Custom Area') : selectedArea.name}`
                    }
                  </h3>
                  <div className="airport-route-meta">
                    <span>
                      <Clock size={13} style={{ display: 'inline', marginRight: 4 }} />
                      {isCustomMode ? '45-60 mins est.' : selectedArea.estTime}
                    </span>
                    <span>•</span>
                    <span>{isCustomMode ? `${customDistance} km` : `${selectedArea.distanceKm} km`}</span>
                  </div>
                </div>
              </div>

              {/* Big Price Display */}
              <div className="airport-price-display">
                <div>
                  <div className="airport-price-label">ESTIMATED FIXED FARE</div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span className="airport-price-val">₹{currentFare.toLocaleString('en-IN')}</span>
                    <span className="airport-price-unit">starting</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', display: 'block' }}>Vehicle Type:</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {AIRPORT_TRANSFER_CONFIG.vehiclePricing[selectedVehicle].name}
                  </span>
                </div>
              </div>

              {/* Inclusions List */}
              <div className="airport-inclusions-list">
                {AIRPORT_TRANSFER_CONFIG.inclusions.map((item, idx) => (
                  <div key={idx} className="airport-inclusion-item">
                    <CheckCircle2 size={16} color="#FFFFFF" style={{ flexShrink: 0 }} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Book Now Button */}
              <button
                type="button"
                className="btn-book-airport"
                onClick={handleProceedBooking}
              >
                <span>BOOK AIRPORT TRANSFER</span>
                <ArrowRight size={16} />
              </button>

            </div>

          </div>
        </div>

        {/* POPULAR ROUTE CARDS GRID */}
        <div>
          <h3 className="airport-popular-title">
            <Sparkles size={20} color="var(--color-primary)" />
            <span>Popular Bengaluru Airport Transfer Routes</span>
          </h3>

          <div className="airport-popular-grid">
            {POPULAR_AIRPORT_ROUTES.map((routeItem) => {
              const area = BENGALURU_AIRPORT_AREAS.find(a => a.id === routeItem.areaId);
              if (!area) return null;
              return (
                <div key={area.id} className="airport-popular-card">
                  <div>
                    <div className="airport-card-top">
                      <span className="airport-card-area">{area.name}</span>
                      <span className="airport-card-tag">{routeItem.tag}</span>
                    </div>
                    <div className="airport-card-details">
                      <span>Approx {area.distanceKm} km</span>
                      <span>•</span>
                      <span>{area.estTime}</span>
                    </div>
                  </div>

                  <div className="airport-card-price-row">
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#777', display: 'block' }}>Sedan fare</span>
                      <span className="airport-card-price">Starting ₹{area.cityToAirportFare}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-card-select"
                      onClick={() => handleSelectPopularRoute(area.id)}
                    >
                      View Fare →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DISCLAIMER BOX */}
        <div className="airport-disclaimer-box" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Info size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Fare Transparency Disclaimer:</strong> {AIRPORT_TRANSFER_CONFIG.disclaimerText} Base fares include driver allowance and applicable GST. Expressway toll charges and terminal parking fees are charged extra as per actual receipts.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
