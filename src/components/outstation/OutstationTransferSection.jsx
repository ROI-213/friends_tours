import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Car, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Calculator,
  Info,
  Clock,
  ChevronUp,
  ChevronDown,
  ArrowLeftRight
} from 'lucide-react';
import { 
  OUTSTATION_CONFIG, 
  OUTSTATION_VEHICLE_RATES, 
  POPULAR_OUTSTATION_ROUTES, 
  calculateOutstationFare,
  OUTSTATION_FAQS
} from '../../data/outstationCorporateData';
import { api } from '../../lib/api.js';
import { useDataSync } from '../../hooks/useDataSync';
import '../../styles/outstation-corporate.css';

export const OutstationTransferSection = ({ onBookOutstation }) => {
  const [vehicleRates, setVehicleRates] = useState(OUTSTATION_VEHICLE_RATES);
  // Dynamic Calculator State
  const [calcVehicleId, setCalcVehicleId] = useState('innova-crysta-hybrid');
  const [calcTotalKm, setCalcTotalKm] = useState(300);
  const [calcTotalDays, setCalcTotalDays] = useState(1);

  const [popularRoutes, setPopularRoutes] = useState(POPULAR_OUTSTATION_ROUTES);

  const fetchRates = React.useCallback(() => {
    api.getOutstationTariffs().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const dynamic = data.map(v => ({
          ...v,
          vehicleId: v.id || v.vehicleId || (v.vehicle_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          vehicleName: v.vehicle_name || v.vehicleName || '',
          category: v.category || '',
          capacity: v.capacity || '4–7 Seats',
          minAmountPerDay: v.min_amount_per_day ?? v.minAmountPerDay ?? 0,
          extraPerKm: v.extra_per_km ?? v.extraPerKm ?? 0,
          driverBataDay: v.driver_bata_day ?? v.driverBataDay ?? 0,
          nightBataExtra: v.night_bata_extra ?? v.nightBataExtra ?? 0,
          tag: v.tag || ''
        }));
        setVehicleRates(dynamic);
      }
    }).catch(() => {});
  }, []);

  const fetchDestinations = React.useCallback(() => {
    api.getOutstationDestinations().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const dynamic = data.map((d) => ({
          id: d.id,
          name: d.name + (d.state ? ` (${d.state})` : ''),
          distanceOneWay: Number(d.distance_km) || 250,
          estDriveTime: d.est_drive_time || '4.0 Hours',
          popularVehicle: 'Sedan / Innova Crysta',
          sedanDayRate: Number(d.starting_price) || 3500,
          tag: d.tag || d.badge || 'POPULAR'
        }));
        setPopularRoutes(dynamic);
      }
    }).catch(() => {});
  }, []);

  React.useEffect(() => {
    fetchRates();
    fetchDestinations();
  }, [fetchRates, fetchDestinations]);

  useDataSync('tariffs', fetchRates);
  useDataSync('outstation-destinations', fetchDestinations);

  // Active Vehicle for calculator
  const calcVehicle = useMemo(() => {
    return vehicleRates.find(v => v.vehicleId === calcVehicleId) || vehicleRates[0] || OUTSTATION_VEHICLE_RATES[0];
  }, [vehicleRates, calcVehicleId]);

  // Dynamic Fare Calculation
  const fareResult = useMemo(() => {
    return calculateOutstationFare(calcVehicle, 'roundTrip', calcTotalKm, calcTotalDays);
  }, [calcVehicle, calcTotalKm, calcTotalDays]);

  const handleProceedBooking = (vehicleItem, customData = null) => {
    const estFare = customData ? customData.totalFare : (vehicleItem.minAmountPerDay + vehicleItem.driverBataDay);

    if (onBookOutstation) {
      onBookOutstation({
        type: 'outstation',
        title: `Outstation Cab — ${vehicleItem.vehicleName}`,
        pickupLocation: 'Bangalore Doorstep Pickup',
        destination: customData ? `Outstation Destination (${customData.billableKm} KM / ${customData.days} Days)` : 'Karnataka Outstation Trip',
        travelType: 'Local And Outstation Rentals',
        vehiclePreference: vehicleItem.vehicleName,
        estimatedFare: estFare,
        badge: `₹${vehicleItem.minAmountPerDay}/Day (300 km min)`,
        description: `Outstation Min Amount: ₹${vehicleItem.minAmountPerDay}/day (300 km min) | Extra KM: ₹${vehicleItem.extraPerKm}/km | Driver Bata: ₹${vehicleItem.driverBataDay}/day | Night Bata: ₹${vehicleItem.nightBataExtra}`
      });
    }
  };

  return (
    <section id="outstation-pricing" className="outstation-section" aria-label="Bangalore Outstation Cab Rates & Highway Tariff">
      <div className="outstation-container">
        
        {/* Header */}
        <div className="outstation-header">
          <div className="outstation-eyebrow">
            <Compass size={13} />
            <span>OFFICIAL HIGHWAY TARIFF ({OUTSTATION_CONFIG.effectiveDate} RATES)</span>
          </div>
          <h2 className="outstation-title">
            Outstation Cab Rates &amp; Highway Tariff (Min 300 Km / Day)
          </h2>
          <p className="outstation-subtitle">
            Comfortable, sanitized outstation highway cabs from Bangalore to Mysore, Coorg, Ooty, Chikmagalur, Wayanad, and South India. Minimum 300 KM per day with fixed transparent tariffs.
          </p>
        </div>

        {/* TARIFF CARDS GRID */}
        <div className="outstation-grid">
          {vehicleRates.map((v) => {
            return (
              <article key={v.vehicleId} className="outstation-card">

                <div className="outstation-card-header">
                  {/* Badge now inside header, ABOVE the vehicle name — no overlap */}
                  {v.tag && <span className="outstation-card-badge">{v.tag}</span>}
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#0A1938', marginBottom: 2, marginTop: 0 }}>
                    {v.vehicleName}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#777', fontWeight: 600 }}>{v.category} • {v.capacity}</span>
                </div>

                <div className="outstation-card-body">
                  <div>
                    <div className="outstation-rate-box">
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <span className="outstation-rate-val">₹{v.minAmountPerDay.toLocaleString('en-IN')}<span style={{ fontSize: '0.85rem', fontWeight: 700 }}>/day</span></span>
                        <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                          300 KM INCLUDED
                        </span>
                      </div>
                      <div className="outstation-rate-meta">
                        <span>Extra Km: ₹{v.extraPerKm}/km</span>
                        <span>Day Bata: ₹{v.driverBataDay}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#777', marginTop: 4 }}>
                        After 10.00pm Driver Bata: <strong>₹{v.nightBataExtra}</strong>
                      </div>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px 0', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.775rem', color: '#555' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={14} color="var(--color-primary)" />
                        <span>Clean yellow-board commercial tourist permit</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={14} color="var(--color-primary)" />
                        <span>Highway certified experienced chauffeur</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={14} color="var(--color-primary)" />
                        <span>Parking &amp; interstate toll tickets at actuals</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="btn-outstation-book"
                    onClick={() => handleProceedBooking(v)}
                  >
                    <span>BOOK {v.vehicleName.toUpperCase()}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* DYNAMIC TRIP FARE CALCULATOR */}
        <div style={{ background: 'linear-gradient(145deg, #071746 0%, #3D0E32 100%)', borderRadius: 28, padding: 'clamp(24px, 4vw, 40px)', color: '#FFFFFF', marginBottom: 48, boxShadow: '0 20px 48px rgba(61,14,50,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Calculator size={22} color="#FFFFFF" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              Outstation Cost Estimator (300 KM/Day Rule)
            </h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', marginBottom: 24 }}>
            Enter your total estimated trip distance and calendar days to calculate your transparent outstation tariff.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.85)' }}>
                Vehicle Type
              </label>
              <select
                style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontWeight: 600, outline: 'none' }}
                value={calcVehicleId}
                onChange={(e) => setCalcVehicleId(e.target.value)}
              >
                {vehicleRates.map(v => (
                  <option key={v.vehicleId} value={v.vehicleId} style={{ background: '#3D0E32', color: '#FFF' }}>
                    {v.vehicleName} (₹{v.minAmountPerDay}/day min)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.85)' }}>
                Est. Total Distance (KM)
              </label>
              <input
                type="number"
                min="100"
                max="3000"
                style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontWeight: 600, outline: 'none' }}
                value={calcTotalKm}
                onChange={(e) => setCalcTotalKm(Number(e.target.value))}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.85)' }}>
                Trip Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="15"
                style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontWeight: 600, outline: 'none' }}
                value={calcTotalDays}
                onChange={(e) => setCalcTotalDays(Number(e.target.value))}
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 18, padding: '14px 18px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', display: 'block' }}>Est. Total Fare</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF' }}>₹{fareResult.totalFare.toLocaleString('en-IN')}</span>
              </div>
              <button
                type="button"
                className="btn-outstation-book"
                style={{ background: '#FFFFFF', color: 'var(--color-primary)', width: 'auto', padding: '10px 18px' }}
                onClick={() => handleProceedBooking(calcVehicle, fareResult)}
              >
                <span>Book →</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span>Min Allowance ({fareResult.days} Days × 300 KM = {fareResult.minKmAllowed} KM): ₹{fareResult.baseDayAmount}</span>
            <span>• Day Driver Bata ({fareResult.days} Days × ₹{calcVehicle.driverBataDay}): ₹{fareResult.totalDayBata}</span>
            {fareResult.extraKm > 0 && <span>• Extra KM ({fareResult.extraKm} km × ₹{calcVehicle.extraPerKm}): +₹{fareResult.extraKmFare}</span>}
          </div>
        </div>

        {/* POPULAR ROUTE BENCHMARKS */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#0A1938', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={20} color="var(--color-primary)" />
            <span>Popular Outstation Destinations</span>
          </h3>

          <div className="outstation-routes-grid">
            {popularRoutes.map((route) => (
              <div key={route.id} className="outstation-route-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: '#0A1938' }}>{route.name}</span>
                  <span style={{ fontSize: '0.675rem', fontWeight: 700, color: 'var(--color-primary)', background: 'var(--color-pink-soft)', padding: '3px 8px', borderRadius: 999 }}>{route.tag}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: 12 }}>
                  <span>{route.distanceOneWay} km one-way</span> • <span>{route.estDriveTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--color-border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#777', display: 'block' }}>Starting Rate</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{Number(route.sedanDayRate || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    type="button"
                    style={{ background: 'var(--color-pink-soft)', color: 'var(--color-primary)', border: '1px solid rgba(13, 37, 108,0.2)', padding: '6px 12px', borderRadius: 999, fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => {
                      setCalcTotalKm(route.distanceOneWay * 2);
                      const el = document.getElementById('outstation-pricing');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Calculate →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DISCLAIMER BOX */}
        <div style={{ background: '#F7FAFF', padding: '16px 20px', borderRadius: 16, border: '1px solid var(--color-border-subtle)', marginBottom: 0, fontSize: '0.8rem', color: '#666', lineHeight: 1.5, display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 24 }}>
          <Info size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Outstation Tariff Disclaimer:</strong> {OUTSTATION_CONFIG.disclaimerText} Base rates include vehicle rental and driver allowance for the 300 km daily minimum. Toll tickets, parking fees, and interstate permits are extra as per actual printed receipts.
          </div>
        </div>

      </div>
    </section>
  );
};
