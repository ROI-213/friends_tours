import React from 'react';
import { Building2, ShieldCheck, Award, Sparkles, ArrowRight } from 'lucide-react';
import { CORPORATE_CLIENTS, BRAND } from '../../constants/branding';

export const CorporateClientsSection = ({ onContactClick }) => {
  // Filter clients with logos and duplicate for seamless infinite loop
  const logoClients = CORPORATE_CLIENTS.filter(c => c.logo);
  const marqueeList = [...logoClients, ...logoClients];

  return (
    <section className="corporate-clients-section" style={{
      padding: 'clamp(50px, 6vw, 80px) 0',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F8FF 50%, #FFFFFF 100%)',
      borderTop: '1px solid var(--color-border-subtle)',
      borderBottom: '1px solid var(--color-border-subtle)',
      position: 'relative',
      overflow: 'hidden'
    }} aria-label="Our Esteemed Corporate Clients">
      
      <div style={{
        maxWidth: 'var(--container-max, 1720px)',
        margin: '0 auto',
        padding: '0 clamp(18px, 3.5vw, 48px)'
      }}>
        
        {/* Section Header */}
        <div className="reveal-on-scroll" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto clamp(28px, 3.5vw, 44px)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            background: 'var(--color-primary, #0D256C)',
            padding: '5px 16px',
            borderRadius: 999,
            marginBottom: 12
          }}>
            <Building2 size={13} />
            <span>TRUSTED BY INDUSTRY LEADERS</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
            fontWeight: 800,
            color: '#0A1938',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            margin: '0 0 10px 0'
          }}>
            OUR ESTEEMED CLIENTS &amp; CORPORATE PARTNERS
          </h2>

          <p style={{
            fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)',
            color: 'var(--color-text-muted, #6B7B95)',
            lineHeight: 1.6,
            margin: 0
          }}>
            Friends Tours &amp; Travels is proud to power employee transportation, VIP airport transfers, executive mobility, and dedicated corporate fleets for leading multinational organizations across Bangalore.
          </p>
        </div>

        {/* Continuous Scrolling Logos Marquee Box */}
        <div className="reveal-scale" style={{
          background: '#FFFFFF',
          borderRadius: 24,
          padding: '24px 0',
          border: '1px solid var(--color-border-subtle, #E2ECF8)',
          boxShadow: '0 8px 32px rgba(13, 37, 108, 0.05)',
          marginBottom: 36,
          position: 'relative'
        }}>
          <div className="marquee-container">
            <div className="marquee-track">
              {marqueeList.map((client, idx) => (
                <div
                  key={`marquee-${client.id}-${idx}`}
                  className="marquee-logo-item"
                  title={`${client.name} — ${client.category}`}
                >
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Corporate Trust Strip */}
        <div className="reveal-scale stagger-2" style={{
          background: 'linear-gradient(135deg, #071746 0%, #0D256C 100%)',
          borderRadius: 20,
          padding: '22px 30px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          boxShadow: '0 12px 32px rgba(7, 23, 70, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: 'rgba(250, 70, 22, 0.2)',
              border: '1.5px solid #FA4616',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FA4616'
            }}>
              <Award size={24} />
            </div>
            <div>
              <strong style={{ fontSize: '1.05rem', display: 'block' }}>Looking for Dedicated Corporate Employee Mobility?</strong>
              <span style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                Itemized GST billing, SLA compliance, 24/7 dedicated dispatch manager &amp; automated trip tracking.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onContactClick}
            style={{
              padding: '12px 24px',
              borderRadius: 999,
              background: 'var(--color-orange, #FA4616)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(250, 70, 22, 0.4)',
              transition: 'all 200ms ease'
            }}
          >
            <span>Partner With Us</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </section>
  );
};
