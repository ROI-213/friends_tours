import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { BRAND } from '../../constants/branding';
import { api } from '../../lib/api.js';
import { useDataSync } from '../../hooks/useDataSync';
import { LOCAL_VEHICLE_PRICING } from '../../data/localTransferData';
import { OUTSTATION_VEHICLE_RATES } from '../../data/outstationCorporateData';
import '../../styles/tariff.css';

// Pre-normalize official static rates as instantaneous defaults
const staticLocalTariffs = (LOCAL_VEHICLE_PRICING || []).map((v) => ({
  ...v,
  vehicleId: v.vehicleId || v.id || v.vehicleName,
  vehicleName: v.vehicleName || v.vehicle_name || '',
  category: v.category || '',
  package4hr40km: v.package4hr40km ?? v.package_4hr_40km ?? null,
  package8hr80km: v.package8hr80km ?? v.package_8hr_80km ?? 0,
  extraHour: v.extraHour ?? v.extra_hour ?? 0,
  extraKm: v.extraKm ?? v.extra_km ?? 0,
  nightBata: v.nightBata ?? v.night_bata ?? 0,
}));

const staticOutstationTariffs = (OUTSTATION_VEHICLE_RATES || []).map((v) => ({
  ...v,
  vehicleId: v.vehicleId || v.id || v.vehicleName,
  vehicleName: v.vehicleName || v.vehicle_name || '',
  category: v.category || '',
  minAmountPerDay: v.minAmountPerDay ?? v.min_amount_per_day ?? 0,
  extraPerKm: v.extraPerKm ?? v.extra_per_km ?? 0,
  driverBataDay: v.driverBataDay ?? v.driver_bata_day ?? 0,
  nightBataExtra: v.nightBataExtra ?? v.night_bata_extra ?? 0,
}));

export const OfficialTariffSection = ({ onBookVehicle }) => {
  const [activeTab, setActiveTab] = useState('local'); // 'local' | 'outstation'
  const [mobileView, setMobileView] = useState('cards'); // 'cards' | 'table'
  const [localTariffs, setLocalTariffs] = useState(staticLocalTariffs);
  const [outstationTariffs, setOutstationTariffs] = useState(staticOutstationTariffs);
  const [loading, setLoading] = useState(false);

  const fetchTariffs = useCallback(() => {
    Promise.allSettled([
      api.getLocalTariffs(),
      api.getOutstationTariffs(),
    ]).then(([localRes, outstationRes]) => {
      // Normalize local tariffs if returned with data
      if (localRes.status === 'fulfilled' && Array.isArray(localRes.value) && localRes.value.length > 0) {
        setLocalTariffs(localRes.value.map(v => ({
          ...v,
          vehicleId: v.id || v.vehicleId || v.vehicle_name,
          vehicleName: v.vehicle_name || v.vehicleName || '',
          category: v.category || '',
          package4hr40km: v.package_4hr_40km ?? v.package4hr40km ?? null,
          package8hr80km: v.package_8hr_80km ?? v.package8hr80km ?? 0,
          extraHour: v.extra_hour ?? v.extraHour ?? 0,
          extraKm: v.extra_km ?? v.extraKm ?? 0,
          nightBata: v.night_bata ?? v.nightBata ?? 0,
        })));
      }
      // Normalize outstation tariffs if returned with data
      if (outstationRes.status === 'fulfilled' && Array.isArray(outstationRes.value) && outstationRes.value.length > 0) {
        setOutstationTariffs(outstationRes.value.map(v => ({
          ...v,
          vehicleId: v.id || v.vehicleId || v.vehicle_name,
          vehicleName: v.vehicle_name || v.vehicleName || '',
          category: v.category || '',
          minAmountPerDay: v.min_amount_per_day ?? v.minAmountPerDay ?? 0,
          extraPerKm: v.extra_per_km ?? v.extraPerKm ?? 0,
          driverBataDay: v.driver_bata_day ?? v.driverBataDay ?? 0,
          nightBataExtra: v.night_bata_extra ?? v.nightBataExtra ?? 0,
        })));
      }
    }).catch(err => {
      console.warn('Tariffs API load note:', err);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTariffs();
  }, [fetchTariffs]);

  useDataSync('tariffs', fetchTariffs);

  const handleBook = (vehicle, type) => {
    if (onBookVehicle) {
      onBookVehicle({
        type: type === 'local' ? 'local-transfer' : 'outstation',
        title: `${vehicle.vehicleName} (${type === 'local' ? 'Bangalore Local' : 'Outstation'})`,
        travelType: type === 'local' ? 'Bangalore Local' : 'Outstation',
        vehiclePreference: vehicle.vehicleName,
        badge: type === 'local' ? `8hr/80km ₹${vehicle.package8hr80km}` : `300km/day ₹${vehicle.minAmountPerDay}`,
        description: type === 'local' 
          ? `Local 8hr/80km: ₹${vehicle.package8hr80km} | Extra Km: ₹${vehicle.extraKm} | Extra Hr: ₹${vehicle.extraHour}`
          : `Outstation Min 300km/day: ₹${vehicle.minAmountPerDay} | Extra Km: ₹${vehicle.extraPerKm} | Driver Bata: ₹${vehicle.driverBataDay}`
      });
    } else {
      window.open(`https://wa.me/${BRAND.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi Friends Tours, I would like to book ${vehicle.vehicleName} for ${type === 'local' ? 'Bangalore Local' : 'Outstation'}.`)}`, '_blank');
    }
  };

  const displayedLocalTariffs = (localTariffs && localTariffs.length > 0) ? localTariffs : staticLocalTariffs;
  const displayedOutstationTariffs = (outstationTariffs && outstationTariffs.length > 0) ? outstationTariffs : staticOutstationTariffs;

  return (
    <section id="official-price-list" className="tariff-section page-main-section" aria-label="Official Price List & Tariff Card">
      <div className="page-max-width">
        
        {/* Section Header */}
        <div className="tariff-header reveal-on-scroll">
          <div className="tariff-badge">
            <Sparkles size={13} />
            <span>OFFICIAL PRICE LIST (EFFECTIVE {BRAND.ratesEffectiveDate})</span>
          </div>

          <h2 className="tariff-title">
            FRIENDS TOURS &amp; TRAVELS TARIFF CARD
          </h2>

          <p className="tariff-subtitle">
            Transparent fixed pricing for Local Bangalore City rentals and Karnataka Outstation journeys. Zero hidden fees.
          </p>

          {/* Tab Selector */}
          <div className="tariff-tabs-wrap" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'local'}
              className={`tariff-tab-btn ${activeTab === 'local' ? 'active' : ''}`}
              onClick={() => setActiveTab('local')}
            >
              <span className="tab-desktop-text">LOCAL PRICE LIST</span>
              <span className="tab-mobile-text">LOCAL (CITY)</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'outstation'}
              className={`tariff-tab-btn ${activeTab === 'outstation' ? 'active' : ''}`}
              onClick={() => setActiveTab('outstation')}
            >
              <span className="tab-desktop-text">OUTSTATION PRICE LIST (Min 300 Km/Day)</span>
              <span className="tab-mobile-text">OUTSTATION (300 KM)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tariff Card */}
        {activeTab === 'local' ? (
          <div className={`tariff-main-card reveal-scale ${mobileView === 'cards' ? 'tariff-view-cards' : 'tariff-view-table'}`}>
            
            <div className="tariff-card-topbar">
              <div>
                <h3 className="tariff-card-heading">
                  LOCAL TARIFF (BANGALORE CITY)
                </h3>
                <span className="tariff-card-subheading">
                  4Hr / 40Km &amp; 8Hr / 80Km Package Matrix
                </span>
              </div>

              <div className="tariff-contact-btns">
                <a
                  href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
                  className="tariff-contact-btn phone"
                >
                  <Phone size={13} />
                  <span>Call {BRAND.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${BRAND.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Friends Tours, I would like to book a local cab package.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tariff-contact-btn whatsapp"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp Booking</span>
                </a>
              </div>
            </div>

            {/* Mobile View Toggle Switcher */}
            <div className="tariff-view-mode-bar">
              <button
                type="button"
                className={`tariff-view-btn ${mobileView === 'cards' ? 'active' : ''}`}
                onClick={() => setMobileView('cards')}
                aria-label="Switch to Card View"
              >
                <LayoutGrid size={13} />
                <span>Card View (Recommended)</span>
              </button>
              <button
                type="button"
                className={`tariff-view-btn ${mobileView === 'table' ? 'active' : ''}`}
                onClick={() => setMobileView('table')}
                aria-label="Switch to Table View"
              >
                <TableIcon size={13} />
                <span>Full Sheet Table</span>
              </button>
            </div>

            {/* 1. Mobile Cards View (Clean, Visible & No Cutoffs) */}
            <div className="tariff-mobile-cards-wrap">
              {displayedLocalTariffs.map((v) => (
                <div key={v.vehicleId} className="tariff-m-card">
                  <div className="tariff-m-card-header">
                    <div>
                      <div className="tariff-m-vehicle-title">{v.vehicleName}</div>
                      <div className="tariff-m-vehicle-cat">{v.category}</div>
                    </div>
                    <span className="tariff-m-badge">{v.category.split(' ')[0] || 'Sedan'}</span>
                  </div>

                  <div className="tariff-m-packages-grid">
                    <div className="tariff-m-pkg-box">
                      <span className="tariff-m-pkg-label">4 Hr / 40 Km</span>
                      <span className="tariff-m-pkg-price">
                        {v.package4hr40km ? `₹${v.package4hr40km.toLocaleString('en-IN')}` : 'N/A'}
                      </span>
                      <span className="tariff-m-pkg-sub">City Half Day</span>
                    </div>

                    <div className="tariff-m-pkg-box featured">
                      <span className="tariff-m-pkg-label">8 Hr / 80 Km</span>
                      <span className="tariff-m-pkg-price">
                        ₹{v.package8hr80km.toLocaleString('en-IN')}
                      </span>
                      <span className="tariff-m-pkg-sub">City Full Day</span>
                    </div>
                  </div>

                  <div className="tariff-m-extras-grid">
                    <div className="tariff-m-extra-chip">
                      <span className="tariff-m-extra-label">Extra Hr</span>
                      <span className="tariff-m-extra-val">₹{v.extraHour}</span>
                    </div>
                    <div className="tariff-m-extra-chip">
                      <span className="tariff-m-extra-label">Extra Km</span>
                      <span className="tariff-m-extra-val">₹{v.extraKm}</span>
                    </div>
                    <div className="tariff-m-extra-chip">
                      <span className="tariff-m-extra-label">Night Bata</span>
                      <span className="tariff-m-extra-val">₹{v.nightBata}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-tariff-m-reserve"
                    onClick={() => handleBook(v, 'local')}
                    aria-label={`Reserve ${v.vehicleName}`}
                  >
                    <span>Reserve {v.vehicleName.split('/')[0].trim()}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table / Mobile Table Sheet */}
            <div className="tariff-desktop-table-wrapper">
              <div className="tariff-scroll-hint">
                <ArrowRight size={12} style={{ transform: 'rotate(180deg)' }} />
                <span>Swipe table horizontally to see extra km, hr &amp; bata rates</span>
                <ArrowRight size={12} />
              </div>

              <table className="tariff-table">
                <thead>
                  <tr>
                    <th>Type of Car</th>
                    <th>Amount for 4 Hr 40 Km</th>
                    <th>Amount for 8 Hr 80 Km</th>
                    <th>Extra Per Hr Rs.</th>
                    <th>Extra Per Km Rs.</th>
                    <th>After 10.00pm/Before 6:00am D. Bata</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedLocalTariffs.map((v) => (
                    <tr key={v.vehicleId}>
                      <td>
                        <div className="tariff-vehicle-cell-name">{v.vehicleName}</div>
                        <div className="tariff-vehicle-cell-cat">{v.category}</div>
                      </td>
                      <td style={{ fontWeight: 700, color: v.package4hr40km ? '#0D256C' : '#999' }}>
                        {v.package4hr40km ? `₹${v.package4hr40km.toLocaleString('en-IN')}.00` : 'N/A'}
                      </td>
                      <td>
                        <span className="tariff-price-accent">
                          ₹{v.package8hr80km.toLocaleString('en-IN')}.00
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#333333' }}>₹{v.extraHour}.00</td>
                      <td style={{ fontWeight: 600, color: '#333333' }}>₹{v.extraKm}.00</td>
                      <td style={{ fontWeight: 700, color: '#0D256C' }}>₹{v.nightBata}.00</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-tariff-book"
                          onClick={() => handleBook(v, 'local')}
                          aria-label={`Reserve ${v.vehicleName}`}
                        >
                          <span>Reserve</span>
                          <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          <div className={`tariff-main-card reveal-scale ${mobileView === 'cards' ? 'tariff-view-cards' : 'tariff-view-table'}`}>
            
            <div className="tariff-card-topbar">
              <div>
                <h3 className="tariff-card-heading">
                  OUTSTATION TARIFF (MINIMUM 300 KM PER DAY)
                </h3>
                <span className="tariff-card-subheading">
                  Karnataka &amp; South India Highway Tariff Card
                </span>
              </div>

              <div className="tariff-contact-btns">
                <a
                  href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
                  className="tariff-contact-btn phone"
                >
                  <Phone size={13} />
                  <span>Call {BRAND.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${BRAND.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Friends Tours, I would like to book an outstation trip.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tariff-contact-btn whatsapp"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp Booking</span>
                </a>
              </div>
            </div>

            {/* Mobile View Toggle Switcher */}
            <div className="tariff-view-mode-bar">
              <button
                type="button"
                className={`tariff-view-btn ${mobileView === 'cards' ? 'active' : ''}`}
                onClick={() => setMobileView('cards')}
                aria-label="Switch to Card View"
              >
                <LayoutGrid size={13} />
                <span>Card View (Recommended)</span>
              </button>
              <button
                type="button"
                className={`tariff-view-btn ${mobileView === 'table' ? 'active' : ''}`}
                onClick={() => setMobileView('table')}
                aria-label="Switch to Table View"
              >
                <TableIcon size={13} />
                <span>Full Sheet Table</span>
              </button>
            </div>

            {/* 1. Mobile Cards View for Outstation (Clean & Readable) */}
            <div className="tariff-mobile-cards-wrap">
              {displayedOutstationTariffs.map((v) => (
                <div key={v.vehicleId} className="tariff-m-card">
                  <div className="tariff-m-card-header">
                    <div>
                      <div className="tariff-m-vehicle-title">{v.vehicleName}</div>
                      <div className="tariff-m-vehicle-cat">{v.category}</div>
                    </div>
                    <span className="tariff-m-badge">Outstation</span>
                  </div>

                  <div className="tariff-m-hero-pkg-box">
                    <div>
                      <span className="tariff-m-hero-label">Min 300 Km / Day</span>
                      <div className="tariff-m-hero-price">
                        ₹{v.minAmountPerDay.toLocaleString('en-IN')}<span style={{ fontSize: '0.75rem', fontWeight: 600 }}>/day</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="tariff-m-hero-label">Extra Km</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0A1938' }}>₹{v.extraPerKm}/km</div>
                    </div>
                  </div>

                  <div className="tariff-m-extras-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className="tariff-m-extra-chip">
                      <span className="tariff-m-extra-label">Driver Bata (Day)</span>
                      <span className="tariff-m-extra-val">₹{v.driverBataDay}</span>
                    </div>
                    <div className="tariff-m-extra-chip">
                      <span className="tariff-m-extra-label">Night Bata (10pm-6am)</span>
                      <span className="tariff-m-extra-val">₹{v.nightBataExtra}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-tariff-m-reserve"
                    onClick={() => handleBook(v, 'outstation')}
                    aria-label={`Reserve ${v.vehicleName}`}
                  >
                    <span>Reserve {v.vehicleName.split('/')[0].trim()}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table / Mobile Table Sheet */}
            <div className="tariff-desktop-table-wrapper">
              <div className="tariff-scroll-hint">
                <ArrowRight size={12} style={{ transform: 'rotate(180deg)' }} />
                <span>Swipe table horizontally to see extra km &amp; bata rates</span>
                <ArrowRight size={12} />
              </div>

              <table className="tariff-table">
                <thead>
                  <tr>
                    <th>Type of Car</th>
                    <th>Minimum Amount Per Day (300 KM)</th>
                    <th>Extra Per Km Rs.</th>
                    <th>D.Bata Day</th>
                    <th>After 10.00pm D.Bata Extra</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOutstationTariffs.map((v) => (
                    <tr key={v.vehicleId}>
                      <td>
                        <div className="tariff-vehicle-cell-name">{v.vehicleName}</div>
                        <div className="tariff-vehicle-cell-cat">{v.category}</div>
                      </td>
                      <td>
                        <span className="tariff-price-accent">
                          ₹{v.minAmountPerDay.toLocaleString('en-IN')}.00
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#333333' }}>₹{v.extraPerKm}.00</td>
                      <td style={{ fontWeight: 600, color: '#333333' }}>₹{v.driverBataDay}.00</td>
                      <td style={{ fontWeight: 700, color: '#0D256C' }}>₹{v.nightBataExtra}.00</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-tariff-book"
                          onClick={() => handleBook(v, 'outstation')}
                          aria-label={`Reserve ${v.vehicleName}`}
                        >
                          <span>Reserve</span>
                          <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
