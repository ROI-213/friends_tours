import React, { useState } from 'react';
import { 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Clock, 
  Car, 
  Award,
  Sparkles
} from 'lucide-react';
import { CORPORATE_RATES } from '../../data/outstationCorporateData';
import '../../styles/outstation-corporate.css';

export const CorporatePricingSection = ({ onRequestQuote }) => {
  const [activePkg, setActivePkg] = useState('8hr80km'); // '4hr40km' | '8hr80km'

  const handleCorporateAction = (planName, vehicleName) => {
    if (onRequestQuote) {
      onRequestQuote({
        type: 'corporate',
        title: `Corporate Mobility Account — ${planName}`,
        pickupLocation: 'Bangalore Tech Park / Office',
        destination: 'Corporate Mobility Service',
        travelType: 'Corporate Travel',
        vehiclePreference: vehicleName || 'Executive Fleet',
        badge: 'ENTERPRISE SLA',
        description: `Corporate Plan: ${planName} | Preferred Vehicle: ${vehicleName || 'Executive Fleet'} | Account Type: Monthly / Retainer Contract`
      });
    }
  };

  return (
    <section id="corporate-pricing" className="corporate-section" aria-label="Bangalore Corporate Travel Rates & Monthly Mobility Contracts">
      <div className="corporate-container">
        
        {/* Section Header */}
        <div className="corporate-header">
          <div className="corporate-eyebrow">
            <Briefcase size={13} />
            <span>ENTERPRISE MOBILITY SOLUTIONS (2026 BENCHMARK)</span>
          </div>
          <h2 className="corporate-title">
            Corporate Cab Rates &amp; Monthly Retainer Contracts
          </h2>
          <p className="corporate-subtitle">
            Dedicated chauffeur mobility for Bangalore IT parks, executive client travel, daily employee commute, and airport transfers with centralized monthly invoicing and SLA guarantees.
          </p>
        </div>

        {/* 1. DAILY CORPORATE RENTAL TARIFF */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0A1938', margin: 0 }}>
                Corporate Daily Rental Packages
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: '4px 0 0' }}>
                On-demand corporate cab packages for meetings and executive city travel.
              </p>
            </div>

            {/* Toggle */}
            <div style={{ display: 'inline-flex', background: 'var(--color-pink-soft)', padding: 4, borderRadius: 999, border: '1px solid var(--color-border-subtle)' }}>
              <button
                type="button"
                className={`btn-triptype-tab ${activePkg === '4hr40km' ? 'active' : ''}`}
                onClick={() => setActivePkg('4hr40km')}
                style={{ padding: '8px 18px', fontSize: '0.8rem' }}
              >
                4 Hours / 40 KM
              </button>
              <button
                type="button"
                className={`btn-triptype-tab ${activePkg === '8hr80km' ? 'active' : ''}`}
                onClick={() => setActivePkg('8hr80km')}
                style={{ padding: '8px 18px', fontSize: '0.8rem' }}
              >
                8 Hours / 80 KM
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {CORPORATE_RATES.dailyPackages.map((item) => {
              const rate = activePkg === '4hr40km' ? item.rate4hr40km : item.rate8hr80km;
              return (
                <div key={item.vehicleId} style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid var(--color-border-subtle)', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 14px rgba(13, 37, 108,0.04)' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: '#0A1938', marginBottom: 6 }}>{item.vehicleName}</h4>
                    <div style={{ background: 'var(--color-pink-soft)', padding: '12px 14px', borderRadius: 14, marginBottom: 14, border: '1px solid rgba(13, 37, 108,0.15)' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-primary)', display: 'block' }}>₹{rate.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: '0.725rem', color: '#555', fontWeight: 600 }}>Extra KM: ₹{item.extraKm}/km • Extra Hr: ₹{item.extraHour}/hr</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-outstation-book"
                    style={{ padding: '10px 16px', fontSize: '0.8rem' }}
                    onClick={() => handleCorporateAction(`Daily ${activePkg} Rental`, item.vehicleName)}
                  >
                    <span>Request Rate →</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. MONTHLY CORPORATE RETAINER PLANS */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#0A1938', textAlign: 'center', marginBottom: 28 }}>
            Monthly Corporate Retainer Contracts
          </h3>

          <div className="corporate-plans-grid">
            {CORPORATE_RATES.monthlyPlans.map((plan) => (
              <div key={plan.planId} className="corporate-plan-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{plan.planName}</span>
                    <Award size={18} color="var(--color-primary)" />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#0A1938', marginBottom: 14 }}>{plan.vehicle}</h4>
                  
                  <div style={{ marginBottom: 20 }}>
                    <span className="corporate-plan-price">₹{plan.monthlyPrice.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: '0.8rem', color: '#777', fontWeight: 600, marginLeft: 6 }}>/ month</span>
                    <p style={{ fontSize: '0.775rem', color: '#555', margin: '4px 0 0', fontWeight: 600 }}>Includes {plan.monthlyKm} KM &amp; {plan.monthlyHours} Hours</p>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem', color: '#444' }}>
                    {plan.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <CheckCircle2 size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="btn-outstation-book"
                  onClick={() => handleCorporateAction(plan.planName, plan.vehicle)}
                >
                  <span>REQUEST CORPORATE QUOTE</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
