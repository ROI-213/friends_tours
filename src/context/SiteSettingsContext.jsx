import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';
import { useDataSync } from '../hooks/useDataSync';
import { BRAND } from '../constants/branding';

const SiteSettingsContext = createContext({
  settings: {},
  getSetting: (key, fallback = '') => fallback,
  refreshSettings: () => {},
  loading: false,
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(() => {
    setLoading(true);
    api.getSiteSettings()
      .then((data) => {
        if (data && typeof data === 'object') {
          setSettings(data);
        }
      })
      .catch((err) => {
        console.warn('Notice: Using default site settings, API fallback active:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useDataSync('settings', fetchSettings);

  const getSetting = (key, fallback = '') => {
    if (settings && settings[key] !== undefined && settings[key] !== null && settings[key] !== '') {
      return settings[key];
    }
    // Specific built-in BRAND fallbacks
    if (key === 'phone' && BRAND.phone) return BRAND.phone;
    if (key === 'whatsapp' && BRAND.whatsapp) return BRAND.whatsapp;
    if (key === 'email' && BRAND.email) return BRAND.email;
    if (key === 'address' && BRAND.address) return BRAND.address;
    if (key === 'site_name' && BRAND.name) return BRAND.name;
    if (key === 'site_tagline' && BRAND.tagline) return BRAND.tagline;

    return fallback;
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, getSetting, refreshSettings: fetchSettings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export default SiteSettingsContext;
