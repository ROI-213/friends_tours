import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  MapPin, 
  Users, 
  Plane, 
  Clock, 
  Building2, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  Compass, 
  Briefcase
} from 'lucide-react';
import { BRAND } from '../../constants/branding';

export const ServiceFlipCard = ({ service, isFeatured = false, onViewDetails, onFlipChange }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const cardRef = useRef(null);
  const backFaceRef = useRef(null);

  // Smooth subtle tilt
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickup: '',
    destination: '',
    serviceType: service.title,
    date: '',
    time: '',
    flightNo: '',
    passengers: '1-4 Passengers',
    packageType: '8Hr / 80Km Local',
    vehiclePref: 'Sedan (Dzire/Etios)',
    company: '',
    shiftCount: '',
    headcount: '',
    notes: ''
  });

  // Dedicated wheel listener: scrolls the inner card content without moving the outer page
  useEffect(() => {
    const el = backFaceRef.current;
    if (!el || !isFlipped) return;

    const onWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return;

      const delta = e.deltaY;
      const scrollingDown = delta > 0;
      const scrollingUp = delta < 0;

      const canScrollDown = scrollingDown && scrollTop < maxScroll - 1;
      const canScrollUp = scrollingUp && scrollTop > 1;

      // Always prevent outer page scroll while hovering over the open form
      e.preventDefault();
      e.stopPropagation();

      if (canScrollDown || canScrollUp) {
        el.scrollTop += delta;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [isFlipped]);

  // Handle escape key to close flip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFlipped) {
        setIsFlipped(false);
        onFlipChange?.(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, onFlipChange]);

  // Subtle Smooth Tilt (Max ±4 degrees for ultra-classy feel)
  const handleMouseMove = useCallback((e) => {
    if (isFlipped || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    
    const rx = ((y - cy) / cy) * -4;
    const ry = ((x - cx) / cx) * 4;

    setTilt({ rx: Number(rx.toFixed(2)), ry: Number(ry.toFixed(2)), active: true });
  }, [isFlipped]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, active: false });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFlipToBack = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsFlipped(true);
    setTilt({ rx: 0, ry: 0, active: false });
    onFlipChange?.(true);
  };

  const handleFlipToFront = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsFlipped(false);
    onFlipChange?.(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'Enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const message = `*SPECIAL MOBILITY ENQUIRY - ${service.title.toUpperCase()}*\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      (formData.email ? `📧 *Email:* ${formData.email}\n` : '') +
      (formData.company ? `🏢 *Company:* ${formData.company}\n` : '') +
      (formData.pickup ? `📍 *Pickup:* ${formData.pickup}\n` : '') +
      (formData.destination ? `🏁 *Destination:* ${formData.destination}\n` : '') +
      (formData.flightNo ? `✈️ *Flight Details:* ${formData.flightNo}\n` : '') +
      (formData.date ? `📅 *Date:* ${formData.date}\n` : '') +
      (formData.passengers ? `👥 *Passengers:* ${formData.passengers}\n` : '') +
      (formData.packageType ? `📦 *Package:* ${formData.packageType}\n` : '') +
      (formData.vehiclePref ? `🚗 *Vehicle Preference:* ${formData.vehiclePref}\n` : '') +
      (formData.notes ? `📝 *Requirements:* ${formData.notes}\n` : '');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      const waUrl = `https://wa.me/918277393089?text=${encodeURIComponent(message)}`;
      try {
        const win = window.open(waUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.location.href = waUrl;
        }
      } catch (err) {
        window.location.href = waUrl;
      }
    }, 500);
  };

  const handleReset = (e) => {
    if (e) e.stopPropagation();
    setIsSubmitted(false);
    setIsFlipped(false);
  };

  const IconComp = service.icon || Briefcase;

  return (
    <div 
      ref={cardRef} 
      className={`service-card-3d-wrapper ${isFeatured ? 'featured-wrapper' : 'standard-wrapper'} ${isFlipped ? 'is-card-flipped' : ''}`}
      aria-expanded={isFlipped}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`service-card-3d-inner ${isFlipped ? 'is-flipped' : ''}`}
        style={!isFlipped && tilt.active ? {
          transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-4px)`
        } : undefined}
      >
        
        {/* ====================================================================
            FRONT FACE: CLEAN EXECUTIVE SERVICE CARD
            ==================================================================== */}
        <article 
          className={`service-card-face service-card-front ${isFeatured ? 'service-card-featured' : 'service-card-standard'}`}
          aria-label={`${service.title} - ${service.category}`}
        >
          {isFeatured ? (
            /* FEATURED CARD CONTENT */
            <>
              <img
                src={service.image || '/services/employee-transport.jpg'}
                alt={service.title}
                className="service-featured-img"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="service-featured-scrim" />

              <span className="service-featured-badge">
                {service.badge}
              </span>

              <div className="service-featured-content">
                <span className="service-featured-cat-tag">
                  {service.category}
                </span>

                <h3 className="service-featured-title">{service.title}</h3>
                <p className="service-featured-desc">{service.description}</p>

                <div className="service-featured-actions">
                  <button
                    type="button"
                    className="btn-decent-enquire featured-action"
                    onClick={handleFlipToBack}
                    aria-label={`Open Special Enquiry for ${service.title}`}
                  >
                    <span>Enquire Now</span>
                    <span className="decent-arrow-icon">
                      <ArrowRight size={15} />
                    </span>
                  </button>

                  {onViewDetails && (
                    <button
                      type="button"
                      className="btn-service-details"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(service);
                      }}
                    >
                      <span>View Details</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* STANDARD GRID CARD CONTENT */
            <>
              <div>
                <div className="standard-card-header">
                  <div className="standard-icon-box">
                    <IconComp size={22} />
                  </div>

                  <span className="standard-badge-pill">
                    {service.badge}
                  </span>
                </div>

                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-desc">{service.description}</p>
              </div>

              <div className="service-card-footer">
                <span className="service-card-cat-label">
                  {service.category}
                </span>
                
                <button
                  type="button"
                  className="btn-decent-enquire standard-action"
                  onClick={handleFlipToBack}
                  aria-label={`Open Special Enquiry for ${service.title}`}
                >
                  <span>Enquire</span>
                  <span className="decent-arrow-icon">
                    <ArrowRight size={14} />
                  </span>
                </button>
              </div>
            </>
          )}
        </article>

        {/* ====================================================================
            BACK FACE: DECENT & ELEGANT SPECIAL ENQUIRY FORM
            ==================================================================== */}
        <div 
          ref={backFaceRef}
          className="service-card-face service-card-back"
          aria-label={`Special Enquiry Form for ${service.title}`}
        >
          {/* Header */}
          <div className="flip-back-header">
            <div>
              <span className="flip-back-tag">
                <Sparkles size={11} />
                <span>SPECIAL ENQUIRY</span>
              </span>
              <h3 className="flip-back-heading">{service.title}</h3>
              <p className="flip-back-subtitle">Tell us what you need for an instant customized quote.</p>
            </div>

            <button
              type="button"
              className="btn-flip-back-decent"
              onClick={handleFlipToFront}
              aria-label="Back to Service Card"
              title="Return to card (Esc)"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>
          </div>

          {/* Form / Success Confirmation */}
          {isSubmitted ? (
            <div className="flip-success-box">
              <div className="success-icon-wrap">
                <CheckCircle2 size={38} color="#10B981" />
              </div>
              <h4 className="success-title">ENQUIRY RECEIVED</h4>
              <p className="success-desc">
                Thank you, <strong>{formData.name}</strong>. Our mobility operations team will contact you shortly with complete vehicle availability and route quotes.
              </p>

              <div className="success-actions">
                <a
                  href={`https://wa.me/${BRAND.whatsapp.replace('+', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp Desk</span>
                </a>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleReset}
                >
                  <span>← Back to Service</span>
                </button>
              </div>
            </div>
          ) : (
            <form className="flip-form-body" onSubmit={handleSubmit} noValidate>
              
              {/* Row 1: Name & Phone */}
              <div className="form-grid-2 stagger-item-1">
                <div className="form-field">
                  <label htmlFor={`name-${service.id}`}>Full Name *</label>
                  <input
                    id={`name-${service.id}`}
                    type="text"
                    name="name"
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`decent-input ${errors.name ? 'error' : ''}`}
                    required
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor={`phone-${service.id}`}>Phone Number *</label>
                  <input
                    id={`phone-${service.id}`}
                    type="tel"
                    name="phone"
                    placeholder="Mobile / WhatsApp"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`decent-input ${errors.phone ? 'error' : ''}`}
                    required
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
              </div>

              {/* Service-Tailored Controls */}
              {service.id === 'srv-airport' && (
                <>
                  <div className="form-grid-2 stagger-item-2">
                    <div className="form-field">
                      <label htmlFor={`pickup-air-${service.id}`}>Transfer Type</label>
                      <select
                        id={`pickup-air-${service.id}`}
                        name="pickup"
                        value={formData.pickup}
                        onChange={handleChange}
                        className="decent-input"
                      >
                        <option value="Pickup from BLR Airport">Pickup from BLR Airport</option>
                        <option value="Drop to BLR Airport">Drop to BLR Airport</option>
                        <option value="Roundtrip Airport Transfer">Roundtrip Airport Transfer</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor={`flight-${service.id}`}>Flight No. &amp; Time</label>
                      <input
                        id={`flight-${service.id}`}
                        type="text"
                        name="flightNo"
                        placeholder="e.g. 6E-542 / 10:30 AM"
                        value={formData.flightNo}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2 stagger-item-3">
                    <div className="form-field">
                      <label htmlFor={`dest-air-${service.id}`}>Bangalore City Area</label>
                      <input
                        id={`dest-air-${service.id}`}
                        type="text"
                        name="destination"
                        placeholder="e.g. Indiranagar, Whitefield"
                        value={formData.destination}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`date-air-${service.id}`}>Travel Date</label>
                      <input
                        id={`date-air-${service.id}`}
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {service.id === 'srv-local-outstation' && (
                <>
                  <div className="form-grid-2 stagger-item-2">
                    <div className="form-field">
                      <label htmlFor={`pkg-rental-${service.id}`}>Rental Package</label>
                      <select
                        id={`pkg-rental-${service.id}`}
                        name="packageType"
                        value={formData.packageType}
                        onChange={handleChange}
                        className="decent-input"
                      >
                        <option value="4Hr / 40Km Local Bangalore">4Hr / 40Km Local (₹900+)</option>
                        <option value="8Hr / 80Km Local Bangalore">8Hr / 80Km Local (₹1,700+)</option>
                        <option value="Outstation Min 300Km/Day">Outstation (Min 300Km/Day)</option>
                        <option value="Multi-Day Sightseeing Tour">Multi-Day Sightseeing Tour</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor={`veh-rental-${service.id}`}>Vehicle Preference</label>
                      <select
                        id={`veh-rental-${service.id}`}
                        name="vehiclePref"
                        value={formData.vehiclePref}
                        onChange={handleChange}
                        className="decent-input"
                      >
                        <option value="Sedan (Dzire / Etios)">Sedan (Dzire / Etios)</option>
                        <option value="Toyota Innova AC">Toyota Innova AC (7-8)</option>
                        <option value="Innova Crysta Premium">Innova Crysta Premium</option>
                        <option value="Tempo Traveller (12-17)">Tempo Traveller (12-17)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2 stagger-item-3">
                    <div className="form-field">
                      <label htmlFor={`dest-rental-${service.id}`}>Pickup &amp; Destination</label>
                      <input
                        id={`dest-rental-${service.id}`}
                        type="text"
                        name="destination"
                        placeholder="e.g. Bangalore Local / Mysore / Coorg"
                        value={formData.destination}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`date-rental-${service.id}`}>Travel Date</label>
                      <input
                        id={`date-rental-${service.id}`}
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {service.id === 'srv-shuttle' && (
                <>
                  <div className="form-grid-2 stagger-item-2">
                    <div className="form-field">
                      <label htmlFor={`org-shuttle-${service.id}`}>Organization / Event</label>
                      <input
                        id={`org-shuttle-${service.id}`}
                        type="text"
                        name="company"
                        placeholder="e.g. Corporate Campus / Wedding Group"
                        value={formData.company}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`pax-shuttle-${service.id}`}>Group Size</label>
                      <select
                        id={`pax-shuttle-${service.id}`}
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleChange}
                        className="decent-input"
                      >
                        <option value="12 Seater Tempo">12 Seater Tempo</option>
                        <option value="17 Seater Tempo">17 Seater Tempo</option>
                        <option value="25-35 Seater Bus">25-35 Seater Bus</option>
                        <option value="50+ Staff Fleet">50+ Staff Fleet</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2 stagger-item-3">
                    <div className="form-field">
                      <label htmlFor={`route-shuttle-${service.id}`}>Pickup &amp; Drop Route</label>
                      <input
                        id={`route-shuttle-${service.id}`}
                        type="text"
                        name="pickup"
                        placeholder="e.g. Silk Board to Ecospace"
                        value={formData.pickup}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`date-shuttle-${service.id}`}>Required Date</label>
                      <input
                        id={`date-shuttle-${service.id}`}
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {service.id === 'srv-corporate' && (
                <>
                  <div className="form-grid-2 stagger-item-2">
                    <div className="form-field">
                      <label htmlFor={`corp-comp-${service.id}`}>Company Name</label>
                      <input
                        id={`corp-comp-${service.id}`}
                        type="text"
                        name="company"
                        placeholder="e.g. Enterprise / MNC"
                        value={formData.company}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`corp-email-${service.id}`}>Corporate Email</label>
                      <input
                        id={`corp-email-${service.id}`}
                        type="email"
                        name="email"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2 stagger-item-3">
                    <div className="form-field">
                      <label htmlFor={`corp-type-${service.id}`}>Mobility Requirement</label>
                      <select
                        id={`corp-type-${service.id}`}
                        name="packageType"
                        value={formData.packageType}
                        onChange={handleChange}
                        className="decent-input"
                      >
                        <option value="Executive Client Travel">Executive Client Travel</option>
                        <option value="Monthly Dedicated Retainer">Monthly Dedicated Retainer</option>
                        <option value="VIP Delegation Fleet">VIP Delegation Fleet</option>
                        <option value="Conference & Event Logistics">Conference &amp; Event Logistics</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label htmlFor={`corp-date-${service.id}`}>Starting Date</label>
                      <input
                        id={`corp-date-${service.id}`}
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {service.id === 'srv-employee' && (
                <>
                  <div className="form-grid-2 stagger-item-2">
                    <div className="form-field">
                      <label htmlFor={`emp-comp-${service.id}`}>Company / Organization *</label>
                      <input
                        id={`emp-comp-${service.id}`}
                        type="text"
                        name="company"
                        placeholder="e.g. Tech Park Enterprise"
                        value={formData.company}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`emp-email-${service.id}`}>Official Work Email</label>
                      <input
                        id={`emp-email-${service.id}`}
                        type="email"
                        name="email"
                        placeholder="admin@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2 stagger-item-3">
                    <div className="form-field">
                      <label htmlFor={`emp-loc-${service.id}`}>Tech Park / Campus Area</label>
                      <input
                        id={`emp-loc-${service.id}`}
                        type="text"
                        name="pickup"
                        placeholder="e.g. Electronic City / Manyata / ORR"
                        value={formData.pickup}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`emp-pax-${service.id}`}>Estimated Staff &amp; Shifts</label>
                      <input
                        id={`emp-pax-${service.id}`}
                        type="text"
                        name="passengers"
                        placeholder="e.g. 50+ Staff / 2-3 Shifts"
                        value={formData.passengers}
                        onChange={handleChange}
                        className="decent-input"
                      />
                    </div>
                  </div>

                  <div className="form-field stagger-item-4">
                    <label htmlFor={`emp-notes-${service.id}`}>Specific Route / Fleet Notes</label>
                    <textarea
                      id={`emp-notes-${service.id}`}
                      name="notes"
                      placeholder="Shift timings, vehicle preferences, or custom SLA requirements..."
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      className="decent-input decent-textarea"
                    />
                  </div>
                </>
              )}

              {/* Submit Button Bar */}
              <div className="flip-form-footer stagger-item-5">
                <button
                  type="submit"
                  className="btn-decent-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>SEND SPECIAL ENQUIRY</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
                <div className="privacy-bar">
                  <ShieldCheck size={13} color="#10B981" />
                  <span>24/7 Operations Desk • Zero Spam</span>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
