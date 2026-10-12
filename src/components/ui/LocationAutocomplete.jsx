import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapPin, 
  Plane, 
  Train, 
  Building2, 
  Compass, 
  CheckCircle2, 
  X, 
  Search, 
  Loader2,
  Navigation
} from 'lucide-react';
import { searchCuratedLocations, searchOnlineLocations } from '../../data/locationSuggestions';

// Helper to pick category icon and badge color
function getCategoryMeta(category = '') {
  const cat = category.toLowerCase();
  if (cat.includes('airport')) {
    return {
      icon: Plane,
      color: '#0284C7',
      bg: '#E0F2FE',
      label: 'Airport'
    };
  }
  if (cat.includes('railway') || cat.includes('station') || cat.includes('bus')) {
    return {
      icon: Train,
      color: '#7C3AED',
      bg: '#EDE9FE',
      label: 'Station'
    };
  }
  if (cat.includes('tech park') || cat.includes('corporate')) {
    return {
      icon: Building2,
      color: '#059669',
      bg: '#D1FAE5',
      label: 'Tech Park'
    };
  }
  if (cat.includes('outstation')) {
    return {
      icon: Compass,
      color: '#D97706',
      bg: '#FEF3C7',
      label: 'Outstation'
    };
  }
  return {
    icon: MapPin,
    color: '#0D256C',
    bg: '#EAEFFE',
    label: category || 'Locality'
  };
}

export const LocationAutocomplete = ({
  id,
  label,
  placeholder = 'Type location (e.g. Ba for Banashankari, Airport...)',
  value = '',
  onChange,
  required = false,
  error = null,
  icon: CustomIcon = MapPin,
  disabled = false,
  helperText = null,
  onSelectSuggestion = null
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [onlineResults, setOnlineResults] = useState([]);
  const [isVerifiedSelection, setIsVerifiedSelection] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    if (value !== query) {
      setQuery(value);
      // If parent sets an exact string, check if it matches a known item
      const exactCurated = searchCuratedLocations(value, 1);
      if (exactCurated.length > 0 && exactCurated[0].name.toLowerCase() === value.toLowerCase()) {
        setIsVerifiedSelection(true);
      }
    }
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Offline curated matches (0ms latency instant filter)
  const curatedMatches = useMemo(() => {
    if (!query || !query.trim()) {
      // Return top popular hubs when focused with empty query
      return searchCuratedLocations('ba', 5);
    }
    return searchCuratedLocations(query, 7);
  }, [query]);

  // Combine curated matches with any debounced online results
  const allSuggestions = useMemo(() => {
    const combined = [...curatedMatches];
    const seenNames = new Set(curatedMatches.map(c => c.name.toLowerCase()));

    for (const onlineItem of onlineResults) {
      if (!seenNames.has(onlineItem.name.toLowerCase())) {
        combined.push(onlineItem);
        seenNames.add(onlineItem.name.toLowerCase());
      }
    }
    return combined;
  }, [curatedMatches, onlineResults]);

  // Debounced online geocoding if query >= 3 chars
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query || query.trim().length < 3) {
      setOnlineResults([]);
      setIsSearchingOnline(false);
      return;
    }

    // Only query online if fewer than 3 curated matches
    if (curatedMatches.length < 4) {
      setIsSearchingOnline(true);
      debounceTimerRef.current = setTimeout(async () => {
        const results = await searchOnlineLocations(query, 4);
        setOnlineResults(results);
        setIsSearchingOnline(false);
      }, 350);
    } else {
      setOnlineResults([]);
      setIsSearchingOnline(false);
    }

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query, curatedMatches.length]);

  const handleInputChange = (e) => {
    const nextVal = e.target.value;
    setQuery(nextVal);
    setIsVerifiedSelection(false);
    setIsOpen(true);
    setActiveIndex(-1);
    if (onChange) onChange(nextVal, false);
  };

  const handleSelectLocation = (loc) => {
    const chosenName = loc.name;
    setQuery(chosenName);
    setIsVerifiedSelection(true);
    setIsOpen(false);
    setActiveIndex(-1);
    if (onChange) onChange(chosenName, true);
    if (onSelectSuggestion) onSelectSuggestion(loc);
  };

  const handleClear = () => {
    setQuery('');
    setIsVerifiedSelection(false);
    setIsOpen(false);
    setActiveIndex(-1);
    if (onChange) onChange('', false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen || allSuggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < allSuggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : allSuggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < allSuggestions.length) {
          handleSelectLocation(allSuggestions[activeIndex]);
        } else if (allSuggestions.length > 0) {
          handleSelectLocation(allSuggestions[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Highlight query term in string
  const renderHighlightedText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} style={{ color: 'var(--color-primary, #0D256C)', fontWeight: 800, textDecoration: 'underline' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="form-field location-autocomplete-container" ref={containerRef} style={{ position: 'relative' }}>
      {label && (
        <label className="form-label" htmlFor={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {label}
            {required && <span className="form-label-required" style={{ color: '#E11D48', marginLeft: 4 }}>*</span>}
          </span>
          {isVerifiedSelection && (
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 4, 
              fontSize: '0.75rem', 
              color: '#059669', 
              fontWeight: 700 
            }}>
              <CheckCircle2 size={12} />
              <span>Verified Location</span>
            </span>
          )}
        </label>
      )}

      <div className="form-input-wrap" style={{ position: 'relative' }}>
        <CustomIcon size={16} className="form-input-icon" style={{ color: isVerifiedSelection ? '#059669' : 'inherit' }} />
        
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={`form-input ${error ? 'error' : ''} ${isVerifiedSelection ? 'verified-input' : ''}`}
          style={{ paddingRight: query ? 64 : 32 }}
          required={required}
        />

        {/* Clear & Loading Indicator Icons */}
        <div style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          {isSearchingOnline && (
            <Loader2 size={14} className="spin-animation" style={{ color: 'var(--color-text-muted)' }} />
          )}
          {query && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear location"
              style={{
                background: 'transparent',
                border: 'none',
                padding: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#888888',
                borderRadius: '50%'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div 
          className="autocomplete-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md, 8px)',
            boxShadow: '0 12px 32px rgba(13, 37, 108, 0.16), 0 2px 6px rgba(0,0,0,0.06)',
            border: '1px solid var(--color-border-subtle, #E2E8F0)',
            zIndex: 1000,
            maxHeight: 280,
            overflowY: 'auto',
            padding: '6px 0'
          }}
        >
          {/* Header Hint */}
          <div style={{
            padding: '6px 14px',
            fontSize: '0.71875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-text-muted, #64748B)',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Suggested Places in &amp; around Bangalore</span>
            {query && <span style={{ fontSize: '0.6875rem', color: '#0D256C' }}>Type &amp; Select</span>}
          </div>

          {allSuggestions.length > 0 ? (
            allSuggestions.map((item, idx) => {
              const meta = getCategoryMeta(item.category);
              const IconComponent = meta.icon;
              const isSelected = activeIndex === idx;

              return (
                <div
                  key={item.id || idx}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur before click
                    handleSelectLocation(item);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#F0F4FF' : '#FFFFFF',
                    borderLeft: isSelected ? '3px solid var(--color-primary, #0D256C)' : '3px solid transparent',
                    transition: 'background-color 0.12s ease'
                  }}
                >
                  <div style={{
                    marginTop: 2,
                    padding: 5,
                    borderRadius: 6,
                    backgroundColor: meta.bg,
                    color: meta.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComponent size={14} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: isSelected ? '#0D256C' : '#1E293B',
                        lineHeight: 1.3
                      }}>
                        {renderHighlightedText(item.name, query)}
                      </span>
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 4,
                        backgroundColor: meta.bg,
                        color: meta.color
                      }}>
                        {meta.label}
                      </span>
                    </div>

                    {item.area && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748B',
                        marginTop: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.area}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '14px 16px', textAlign: 'center', color: '#64748B', fontSize: '0.8125rem' }}>
              No exact match found for "{query}". You can continue typing your custom address.
            </div>
          )}

          {/* Fallback Option to Use Exact Typed Text */}
          {query.trim().length > 1 && !allSuggestions.some(s => s.name.toLowerCase() === query.trim().toLowerCase()) && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsVerifiedSelection(false);
                setIsOpen(false);
                if (onChange) onChange(query.trim(), false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderTop: '1px dashed #E2E8F0',
                backgroundColor: '#FAFAFA',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                color: '#0D256C',
                fontWeight: 600
              }}
            >
              <Navigation size={13} />
              <span>Use custom location: "<strong>{query.trim()}</strong>"</span>
            </div>
          )}
        </div>
      )}

      {error && <span className="form-error-msg">{error}</span>}
      {helperText && !error && (
        <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 3, display: 'block' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
