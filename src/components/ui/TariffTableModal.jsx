import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Download, 
  Printer, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles,
  Info,
  MapPin,
  Clock,
  Car
} from 'lucide-react';
import { BRAND } from '../../constants/branding';
import { LOCAL_VEHICLE_PRICING, LOCAL_TRANSFER_CONFIG } from '../../data/localTransferData';
import { OUTSTATION_VEHICLE_RATES, OUTSTATION_CONFIG } from '../../data/outstationCorporateData';
import { api } from '../../lib/api.js';

export const TariffTableModal = ({ isOpen, onClose, defaultTab = 'local' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [localRates, setLocalRates] = useState(LOCAL_VEHICLE_PRICING);
  const [outstationRates, setOutstationRates] = useState(OUTSTATION_VEHICLE_RATES);

  React.useEffect(() => {
    if (!isOpen) return;
    Promise.allSettled([
      api.getLocalTariffs(),
      api.getOutstationTariffs(),
    ]).then(([localRes, outstationRes]) => {
      if (localRes.status === 'fulfilled' && Array.isArray(localRes.value) && localRes.value.length > 0) {
        setLocalRates(localRes.value.map(v => ({
          ...v,
          vehicleName: v.vehicle_name || v.vehicleName,
          package4hr40km: v.package_4hr_40km ?? v.package4hr40km,
          package8hr80km: v.package_8hr_80km ?? v.package8hr80km,
          extraHour: v.extra_hour ?? v.extraHour,
          extraKm: v.extra_km ?? v.extraKm,
          nightBata: v.night_bata ?? v.nightBata
        })));
      }
      if (outstationRes.status === 'fulfilled' && Array.isArray(outstationRes.value) && outstationRes.value.length > 0) {
        setOutstationRates(outstationRes.value.map(v => ({
          ...v,
          vehicleName: v.vehicle_name || v.vehicleName,
          minAmountPerDay: v.min_amount_per_day ?? v.minAmountPerDay,
          extraPerKm: v.extra_per_km ?? v.extraPerKm,
          driverBataDay: v.driver_bata_day ?? v.driverBataDay,
          nightBataExtra: v.night_bata_extra ?? v.nightBataExtra
        })));
      }
    }).catch(console.error);
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppQuote = (type) => {
    const text = `Hi Friends Tours & Travels, I am looking at your official ${type === 'local' ? 'Local' : 'Outstation'} Price List and would like to get a quote.`;
    window.open(`https://wa.me/${BRAND.whatsapp.replace('+', '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(31, 23, 30, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(12px, 3vw, 24px)',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: 24,
          maxWidth: 1080,
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          background: 'linear-gradient(135deg, #0A1938 0%, #3D0E32 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-magenta" style={{ background: '#0D256C', color: '#FFF', fontSize: '0.6875rem' }}>
                OFFICIAL PRICE LIST
              </span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                Effective {BRAND.ratesEffectiveDate}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 900, margin: 0 }}>
              {BRAND.name.toUpperCase()} — TARIFF CARD
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>
              {BRAND.address} • Mob: {BRAND.phonesDisplay}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFF',
                padding: '8px 14px',
                borderRadius: 10,
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
              title="Print Price List"
            >
              <Printer size={14} />
              <span style={{ display: 'none', smDisplay: 'inline' }}>Print</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#FFF',
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '14px 28px',
          background: '#FDF7FB',
          borderBottom: '1px solid var(--color-border-subtle, #E2ECF8)'
        }}>
          <button
            type="button"
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              fontSize: '0.875rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: activeTab === 'local' ? 'none' : '1px solid #DCE8FA',
              background: activeTab === 'local' ? 'var(--color-primary, #0D256C)' : '#FFFFFF',
              color: activeTab === 'local' ? '#FFFFFF' : '#444'
            }}
            onClick={() => setActiveTab('local')}
          >
            LOCAL TARIFF (4Hr / 8Hr)
          </button>

          <button
            type="button"
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              fontSize: '0.875rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: activeTab === 'outstation' ? 'none' : '1px solid #DCE8FA',
              background: activeTab === 'outstation' ? 'var(--color-primary, #0D256C)' : '#FFFFFF',
              color: activeTab === 'outstation' ? '#FFFFFF' : '#444'
            }}
            onClick={() => setActiveTab('outstation')}
          >
            OUTSTATION TARIFF (Min 300 Km / Day)
          </button>
        </div>

        {/* Scrollable Table Area */}
        <div style={{ padding: '20px 28px', overflowY: 'auto', flex: 1 }}>
          
          {activeTab === 'local' ? (
            <div>
              <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#0A1938', margin: 0 }}>
                    LOCAL PRICE LIST (BANGALORE CITY)
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#666', margin: '2px 0 0' }}>
                    Hourly rental packages for city sightseeing, errands, executive meetings, and airport connections.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px', textDecoration: 'none' }}
                  >
                    <Phone size={13} />
                    <span>Call Desk</span>
                  </a>
                  <button
                    onClick={() => handleWhatsAppQuote('local')}
                    className="btn btn-whatsapp"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    <MessageCircle size={13} />
                    <span>Book on WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Local Tariff Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #E2ECF8', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: '#0D256C', borderBottom: '3px solid #FA4616', color: '#FFFFFF' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>Type of Car</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>4 Hr 40 Km</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>8 Hr 80 Km</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>Extra / Hr</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>Extra / Km</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>After 10pm / Before 6am Bata</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localRates.map((v, idx) => (
                      <tr 
                        key={v.id || v.vehicleId || idx} 
                        style={{ 
                          borderBottom: '1px solid #EBF2FF',
                          background: idx % 2 === 0 ? '#FFFFFF' : '#F9FBFF'
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0A1938' }}>
                          <div>{v.vehicleName}</div>
                          <span style={{ fontSize: '0.75rem', color: '#6B7B95', fontWeight: 500 }}>{v.category}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: v.package4hr40km ? '#0D256C' : '#999' }}>
                          {v.package4hr40km ? `₹${v.package4hr40km.toLocaleString('en-IN')}.00` : 'N/A'}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 900, color: '#FA4616' }}>
                          ₹{v.package8hr80km.toLocaleString('en-IN')}.00
                        </td>
                        <td style={{ padding: '12px 16px' }}>₹{v.extraHour}.00</td>
                        <td style={{ padding: '12px 16px' }}>₹{v.extraKm}.00</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0D256C' }}>₹{v.nightBata}.00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>



            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#0A1938', margin: 0 }}>
                    OUTSTATION PRICE LIST (MINIMUM 300 KM PER DAY)
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#666', margin: '2px 0 0' }}>
                    Highway tariffs for Mysore, Coorg, Chikkamagaluru, Ooty, Hampi, Wayanad and South India getaways.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px', textDecoration: 'none' }}
                  >
                    <Phone size={13} />
                    <span>Call Desk</span>
                  </a>
                  <button
                    onClick={() => handleWhatsAppQuote('outstation')}
                    className="btn btn-whatsapp"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    <MessageCircle size={13} />
                    <span>Book on WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Outstation Tariff Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #E2ECF8', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: '#0D256C', borderBottom: '3px solid #FA4616', color: '#FFFFFF' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>Type of Car</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>Minimum Amount Per Day (300 KM)</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>Extra Per Km</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>D.Bata Day</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#FFFFFF' }}>After 10.00pm D.Bata Extra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outstationRates.map((v, idx) => (
                      <tr 
                        key={v.id || v.vehicleId || idx} 
                        style={{ 
                          borderBottom: '1px solid #EBF2FF',
                          background: idx % 2 === 0 ? '#FFFFFF' : '#F9FBFF'
                        }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0A1938' }}>
                          <div>{v.vehicleName}</div>
                          <span style={{ fontSize: '0.75rem', color: '#6B7B95', fontWeight: 500 }}>{v.category || 'AC / Pushback'}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 900, color: '#FA4616' }}>
                          ₹{Number(v.minAmountPerDay || 0).toLocaleString('en-IN')}.00
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>₹{v.extraPerKm}.00</td>
                        <td style={{ padding: '12px 16px' }}>₹{v.driverBataDay}.00</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0D256C' }}>₹{v.nightBataExtra}.00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>



            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 28px',
          background: '#FDF7FB',
          borderTop: '1px solid var(--color-border-subtle, #E2ECF8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ fontSize: '0.8125rem', color: '#666' }}>
            <span>Office: <strong>{BRAND.address}</strong></span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={`tel:${BRAND.phone.replace(/\s+/g, '')}`}
              className="btn btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              <Phone size={15} />
              <span>Call: {BRAND.phone}</span>
            </a>

            <a
              href={`https://wa.me/${BRAND.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Friends Tours, I would like to book a cab from your price list.')}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
              style={{ textDecoration: 'none' }}
            >
              <MessageCircle size={15} />
              <span>WhatsApp Booking</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
