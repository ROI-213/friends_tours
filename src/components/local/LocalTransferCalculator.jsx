import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Car, 
  Users, 
  Luggage, 
  Wind, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { 
  LOCAL_TRANSFER_CONFIG, 
  LOCAL_VEHICLE_PRICING, 
  calculateLocalTransferFare,
  LOCAL_TRANSFER_FAQS
} from '../../data/localTransferData';
import '../../styles/local-transfer.css';

export const LocalTransferCalculator = ({ onBookLocalPackage }) => {
  const [selectedPkg, setSelectedPkg] = useState('8hr80km'); // '4hr40km' | '8hr80km'
  
  // Fare Calculator Widget State
  const [calcVehicleId, setCalcVehicleId] = useState('etios-dzire-logan');
  const [calcEstKm, setCalcEstKm] = useState(80);
  const [calcEstHours, setCalcEstHours] = useState(8);

  // Filter state for vehicle category
  const [vehicleCategoryFilter, setVehicleCategoryFilter] = useState('ALL');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    if (vehicleCategoryFilter === 'ALL') return LOCAL_VEHICLE_PRICING;
    if (vehicleCategoryFilter === 'SEDAN') return LOCAL_VEHICLE_PRICING.filter(v => v.category.includes('Sedan'));
    if (vehicleCategoryFilter === 'MPV') return LOCAL_VEHICLE_PRICING.filter(v => v.category.includes('MPV'));
    if (vehicleCategoryFilter === 'GROUP') return LOCAL_VEHICLE_PRICING.filter(v => v.category.includes('Van') || v.category.includes('Tempo'));
    if (vehicleCategoryFilter === 'LUXURY') return LOCAL_VEHICLE_PRICING.filter(v => v.category.includes('Luxury') || v.category.includes('Flagship'));
    return LOCAL_VEHICLE_PRICING;
  }, [vehicleCategoryFilter]);

  // Get active vehicle object for calculator widget
  const calcVehicle = useMemo(() => {
    return LOCAL_VEHICLE_PRICING.find(v => v.vehicleId === calcVehicleId) || LOCAL_VEHICLE_PRICING[0];
  }, [calcVehicleId]);

  // Calculate live transparent fare
  const fareResult = useMemo(() => {
    return calculateLocalTransferFare(calcVehicle, selectedPkg, calcEstKm, calcEstHours);
  }, [calcVehicle, selectedPkg, calcEstKm, calcEstHours]);

  // Highlight state for the estimator when a vehicle is selected from cards
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Handle clicking "BOOK {vehicle}" card button -> Redirects directly to the Local Trip Fare Estimator section with prefilled data
  const handleSelectVehicleForEstimate = (vehicleItem) => {
    setCalcVehicleId(vehicleItem.vehicleId);

    const is4hrAvailable = vehicleItem.package4hr40km !== null;
    if (selectedPkg === '4hr40km' && is4hrAvailable) {
      setCalcEstKm(40);
      setCalcEstHours(4);
    } else {
      if (selectedPkg === '4hr40km' && !is4hrAvailable) {
        setSelectedPkg('8hr80km');
      }
      setCalcEstKm(80);
      setCalcEstHours(8);
    }

    setIsHighlighted(true);
    setTimeout(() => setIsHighlighted(false), 2000);

    // Smoothly scroll directly to the Local Trip Fare Estimator section
    const estimatorEl = document.getElementById('local-fare-estimator');
    if (estimatorEl) {
      estimatorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Trigger Booking Flow - directly redirects to the booking form
  const handleProceedBooking = (vehicleItem) => {
    const is4hr = selectedPkg === '4hr40km' && vehicleItem.package4hr40km !== null;
    const pkg = is4hr ? LOCAL_TRANSFER_CONFIG.packages['4hr40km'] : LOCAL_TRANSFER_CONFIG.packages['8hr80km'];
    const fare = is4hr ? vehicleItem.package4hr40km : vehicleItem.package8hr80km;
    const packageTag = is4hr ? '4 hrs / 40 km' : '8 hrs / 80 km';

    if (onBookLocalPackage) {
      onBookLocalPackage({
        type: 'local-transfer',
        title: `Bangalore Local Cab — ${vehicleItem.vehicleName} (${pkg.name})`,
        pickupLocation: 'J.P. Nagar, Bangalore',
        destination: 'Bangalore Local Sightseeing & City Travel',
        travelType: 'Local Rental',
        tripType: 'Local Rental',
        localPackage: packageTag,
        packageTag,
        vehiclePreference: vehicleItem.vehicleName,
        estimatedFare: fare,
        badge: `${pkg.name} | ₹${fare.toLocaleString('en-IN')}`,
        description: `Package: ${pkg.name} | Vehicle: ${vehicleItem.vehicleName} | Extra KM: ₹${vehicleItem.extraKm}/km | Extra Hr: ₹${vehicleItem.extraHour}/hr | Night Bata: ₹${vehicleItem.nightBata}`
      });
    }
  };

  return (
    <section id="local-packages" className="local-transfer-section" aria-label="Bangalore Local Cab Booking & Package Rates">
      <div className="local-container">
        
        {/* Section Header */}
        <div className="local-header">
          <div className="local-eyebrow">
            <Sparkles size={13} />
            <span>OFFICIAL BANGALORE LOCAL CAB TARIFF ({LOCAL_TRANSFER_CONFIG.effectiveDate})</span>
          </div>
          <h1 className="local-title">
            Bangalore Local Car Rental &amp; Hourly Cab Packages
          </h1>
          <p className="local-subtitle">
            Transparent fixed pricing for 4hr/40km and 8hr/80km local city packages. Switch between duration tabs below to compare vehicle tariffs.
          </p>
        </div>

        {/* PACKAGE DURATION TOGGLE SWITCH */}
        <div className="local-pkg-toggle-wrap">
          <div className="local-pkg-toggle">
            <button
              type="button"
              className={`btn-pkg-toggle ${selectedPkg === '4hr40km' ? 'active' : ''}`}
              onClick={() => {
                setSelectedPkg('4hr40km');
                setCalcEstKm(40);
                setCalcEstHours(4);
              }}
            >
              <Clock size={16} />
              <span>4 Hours / 40 KM (Half Day)</span>
            </button>
            <button
              type="button"
              className={`btn-pkg-toggle ${selectedPkg === '8hr80km' ? 'active' : ''}`}
              onClick={() => {
                setSelectedPkg('8hr80km');
                setCalcEstKm(80);
                setCalcEstHours(8);
              }}
            >
              <Clock size={16} />
              <span>8 Hours / 80 KM (Full Day)</span>
            </button>
          </div>
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {['ALL', 'SEDAN', 'MPV', 'GROUP', 'LUXURY'].map((cat) => (
            <button
              key={cat}
              type="button"
              style={{
                padding: '6px 16px',
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: vehicleCategoryFilter === cat ? 'none' : '1px solid #DCE8FA',
                background: vehicleCategoryFilter === cat ? 'var(--color-primary, #0D256C)' : '#FFFFFF',
                color: vehicleCategoryFilter === cat ? '#FFFFFF' : '#444'
              }}
              onClick={() => setVehicleCategoryFilter(cat)}
            >
              {cat === 'ALL' ? 'ALL VEHICLES' : cat}
            </button>
          ))}
        </div>

        {/* PRICING CARDS GRID */}
        <div className="local-grid">
          {filteredVehicles.map((v) => {
            const is4hrAvailable = v.package4hr40km !== null;
            const price = selectedPkg === '4hr40km' 
              ? (is4hrAvailable ? v.package4hr40km : v.package8hr80km) 
              : v.package8hr80km;
            const pkgInfo = (selectedPkg === '4hr40km' && is4hrAvailable) 
              ? LOCAL_TRANSFER_CONFIG.packages['4hr40km'] 
              : LOCAL_TRANSFER_CONFIG.packages['8hr80km'];

            return (
              <article key={v.vehicleId} className="local-card">
                <div className="local-card-header">
                  <h3 className="local-vehicle-name">{v.vehicleName}</h3>
                  <span className="local-vehicle-cat">{v.category}</span>
                </div>

                <div className="local-card-body">
                  <div>
                    {/* Specs chips */}
                    <div className="local-specs-row">
                      <span className="local-spec-chip">
                        <Users size={13} color="var(--color-primary)" />
                        <span>{v.passengerCapacity}</span>
                      </span>
                      <span className="local-spec-chip">
                        <Luggage size={13} color="var(--color-primary)" />
                        <span>{v.luggageCapacity}</span>
                      </span>
                      <span className="local-spec-chip">
                        <Wind size={13} color="var(--color-primary)" />
                        <span>{v.acType}</span>
                      </span>
                    </div>

                    {/* Price Box */}
                    <div className="local-price-box">
                      <div className="local-price-main">
                        {selectedPkg === '4hr40km' && !is4hrAvailable ? (
                          <div>
                            <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600, display: 'block' }}>4hr Package: N/A</span>
                            <span className="local-price-val">₹{v.package8hr80km.toLocaleString('en-IN')}</span>
                            <span className="local-price-pkg-lbl" style={{ color: 'var(--color-primary)' }}>8hr/80km Minimum</span>
                          </div>
                        ) : (
                          <>
                            <span className="local-price-val">₹{price.toLocaleString('en-IN')}</span>
                            <span className="local-price-pkg-lbl">{pkgInfo.tag}</span>
                          </>
                        )}
                      </div>
                      <div className="local-rates-row">
                        <span>Extra KM: ₹{v.extraKm}/km</span>
                        <span>Extra Hr: ₹{v.extraHour}/hr</span>
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#777', marginTop: 4 }}>
                        Night Bata (10pm-6am): <strong>₹{v.nightBata}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-local-book"
                    onClick={() => handleSelectVehicleForEstimate(v)}
                  >
                    <span>BOOK {v.vehicleName.toUpperCase()}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* INTERACTIVE LOCAL FARE CALCULATOR WIDGET */}
        <div id="local-fare-estimator" className={`local-calc-box ${isHighlighted ? 'highlighted' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Calculator size={22} color="#FFFFFF" />
            <h3 className="local-calc-title">Local Trip Fare Estimator</h3>
          </div>
          <p className="local-calc-subtitle">
            Planning a custom local trip in Bangalore? Enter your estimated distance and hours for a transparent breakdown according to our 2026 tariff card.
          </p>

          <div className="local-calc-grid">
            
            {/* Vehicle Select */}
            <div className="local-calc-field">
              <label className="local-calc-label">Select Vehicle</label>
              <select
                className="local-calc-select"
                value={calcVehicleId}
                onChange={(e) => setCalcVehicleId(e.target.value)}
              >
                {LOCAL_VEHICLE_PRICING.map(v => (
                  <option key={v.vehicleId} value={v.vehicleId}>{v.vehicleName} ({v.category})</option>
                ))}
              </select>
            </div>

            {/* Estimated KM */}
            <div className="local-calc-field">
              <label className="local-calc-label">Est. Total Distance (KM)</label>
              <input
                type="number"
                min="10"
                max="300"
                className="local-calc-input"
                value={calcEstKm}
                onChange={(e) => setCalcEstKm(Number(e.target.value))}
              />
            </div>

            {/* Estimated Hours */}
            <div className="local-calc-field">
              <label className="local-calc-label">Est. Total Time (Hours)</label>
              <input
                type="number"
                min="1"
                max="24"
                className="local-calc-input"
                value={calcEstHours}
                onChange={(e) => setCalcEstHours(Number(e.target.value))}
              />
            </div>

            {/* Output Fare Card */}
            <div className="local-calc-result-card">
              <div>
                <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', display: 'block' }}>
                  Total Est. Fare
                </span>
                <span className="local-calc-result-val">₹{fareResult.totalFare.toLocaleString('en-IN')}</span>
              </div>
              <button
                type="button"
                className="btn-local-book"
                style={{ background: '#FFFFFF', color: 'var(--color-primary)', width: 'auto', padding: '10px 18px' }}
                onClick={() => handleProceedBooking(calcVehicle)}
              >
                <span>Book →</span>
              </button>
            </div>

          </div>

          {/* Breakdown helper text */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span>Base Package ({fareResult.effectivePkg}): ₹{fareResult.baseFare}</span>
            {fareResult.isAutoUpgraded && <span style={{ color: '#FFD700' }}>• Exceeds 6hr: upgraded to 8hr/80km full day</span>}
            {fareResult.extraKm > 0 && <span>• Extra KM ({fareResult.extraKm} km × ₹{calcVehicle.extraKm}): +₹{fareResult.extraKmFare}</span>}
            {fareResult.extraHours > 0 && <span>• Extra Hours ({fareResult.extraHours} hr × ₹{calcVehicle.extraHour}): +₹{fareResult.extraHourFare}</span>}
          </div>
        </div>

        {/* OFFICIAL TERMS & CONDITIONS BOX */}
        <div style={{ background: '#F7FAFF', padding: '20px 24px', borderRadius: 20, border: '1px solid var(--color-border-subtle)', marginBottom: 0, fontSize: '0.85rem', color: '#555', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#0A1938', fontWeight: 800 }}>
            <Info size={18} color="var(--color-primary)" />
            <span>Official Local Tariff Terms:</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {LOCAL_TRANSFER_CONFIG.termsAndConditions.map((term, i) => (
              <li key={i}>{term}</li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};
