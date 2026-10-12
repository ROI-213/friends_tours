import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { adminApi } from '../lib/api.js';
import { Eye, EyeOff } from 'lucide-react';

// ── Auth Context ──────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const maxWait = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 2500);

    const token = localStorage.getItem('ft_admin_token');
    if (token) {
      adminApi.getMe().then((data) => {
        if (mounted) setAdmin(data);
      }).catch(() => {
        localStorage.removeItem('ft_admin_token');
        if (mounted) setAdmin(null);
      }).finally(() => {
        clearTimeout(maxWait);
        if (mounted) setLoading(false);
      });
    } else {
      clearTimeout(maxWait);
      setLoading(false);
    }

    return () => {
      mounted = false;
      clearTimeout(maxWait);
    };
  }, []);

  const login = async (email, password) => {
    const data = await adminApi.login(email, password);
    localStorage.setItem('ft_admin_token', data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ft_admin_token');
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, login, logout, loading }}>{children}</AuthContext.Provider>;
}

// ── Shared Modal Wrapper ──────────────────────────────────────────────────────
function Modal({ title, onClose, children, maxWidth = 680 }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10, 25, 56, 0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#fff', borderRadius: 18, width: '100%', maxWidth,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        padding: '28px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid #eef2f6', paddingBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0A1938' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db',
  borderRadius: 8, fontSize: '0.875rem', boxSizing: 'border-box', marginTop: 4, outline: 'none'
};

// ── Reusable List / Tag Editor ────────────────────────────────────────────────
function ArrayEditor({ label, items = [], onChange, placeholder = 'Add new item...' }) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem('');
  };

  const handleRemove = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', color: '#475569', marginBottom: 6 }}>
        {label} ({items.length})
      </label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          placeholder={placeholder}
          style={{ ...inputStyle, marginTop: 0 }}
        />
        <button type="button" onClick={handleAdd}
          style={{ padding: '0 16px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', flexShrink: 0 }}>
          + Add
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '6px 10px', borderRadius: 6, fontSize: '0.8125rem' }}>
            <span style={{ color: '#334155' }}>✓ {item}</span>
            <button type="button" onClick={() => handleRemove(idx)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to compress images on client before uploading
function compressImage(file) {
  return new Promise((resolve) => {
    if (!file.type || !file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ dataUrl: e.target.result, blob: file });
      reader.onerror = () => resolve({ dataUrl: '', blob: file });
      reader.readAsDataURL(file);
      return;
    }
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = () => {
        const maxDim = 1280;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        canvas.toBlob((blob) => {
          resolve({ dataUrl, blob: blob || file });
        }, 'image/jpeg', 0.85);
      };
      img.onerror = () => {
        resolve({ dataUrl: e.target.result, blob: file });
      };
    };
    reader.onerror = () => resolve({ dataUrl: '', blob: file });
    reader.readAsDataURL(file);
  });
}

// ── Image Upload Component with File Picker & Preview ─────────────────────────
function ImageUploadInput({ label, value, onChange, placeholder = '/fleet/car.jpg or upload an image', category = 'general' }) {
  const [uploading, setUploading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPreviewError(false);
    try {
      const { dataUrl, blob } = await compressImage(file);
      // Attempt server upload
      try {
        const uploadFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
        const res = await adminApi.uploadImage(uploadFile, { category });
        if (res && res.url) {
          onChange(res.url);
          setUploading(false);
          return;
        }
      } catch (uploadErr) {
        console.warn('Server storage upload fallback to direct data url:', uploadErr.message);
      }
      // If server upload fails or runs on serverless read-only disk, use the compressed dataUrl directly
      if (dataUrl) {
        onChange(dataUrl);
      }
    } catch (err) {
      alert('Error processing image: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); setPreviewError(false); }}
            style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}
          >
            ✕ Remove Image
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {value && !previewError && (
          <div style={{ width: 52, height: 42, borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1', background: '#f8fafc', flexShrink: 0 }}>
            <img
              src={value}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setPreviewError(true)}
            />
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => { onChange(e.target.value); setPreviewError(false); }}
            placeholder={placeholder}
            style={{ ...inputStyle, marginTop: 0, flex: 1, fontSize: '0.8rem' }}
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '0 14px',
              height: 42,
              background: uploading ? '#94a3b8' : 'linear-gradient(135deg, #0A1938 0%, #1e3a8a 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: uploading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {uploading ? (
              <>⏳ Uploading...</>
            ) : (
              <>📁 Choose Image</>
            )}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
        Click &quot;Choose Image&quot; to upload from your phone or PC, or type / paste an image URL.
      </div>
    </div>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────────
function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@friendstours.in');
  const [password, setPassword] = useState('admin@FT2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify server connection and credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1938 0%, #173261 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '2.5rem', width: '100%', maxWidth: 440, boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🚗</div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0A1938' }}>Friends Tours & Travels</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8125rem', color: '#334155' }}>Admin Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} autoComplete="username" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8125rem', color: '#334155' }}>Password</label>
            <div style={{ position: 'relative', marginTop: 4 }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ ...inputStyle, marginTop: 0, paddingRight: 42 }} 
                autoComplete="current-password" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  padding: 6,
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.8125rem', lineHeight: 1.4 }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Authenticating...' : 'Sign In to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    totalEnquiries: 2,
    activeVehicles: 6,
    activePackages: 4,
    totalTestimonials: 4,
    newEnquiries: 1
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    adminApi.getDashboard().then(d => { 
      if (d?.stats) setStats(d.stats); 
      if (d?.recentEnquiries) setRecent(d.recentEnquiries); 
    }).catch(console.error);
  }, []);

  const cards = stats ? [
    { key: 'enquiries', label: 'Total Enquiries', value: stats.totalEnquiries, color: '#2563eb', icon: '📋' },
    { key: 'enquiries', label: 'New Bookings', value: stats.newEnquiries, color: '#dc2626', icon: '🔔' },
    { key: 'vehicles', label: 'Active Fleet', value: stats.activeVehicles, color: '#059669', icon: '🚗' },
    { key: 'packages', label: 'Tour Packages', value: stats.activePackages, color: '#7c3aed', icon: '🗺️' },
    { key: 'services', label: 'Core Services', value: 4, color: '#0284c7', icon: '💼' },
    { key: 'testimonials', label: 'Testimonials', value: stats.totalTestimonials, color: '#d97706', icon: '⭐' },
  ] : [];

  return (
    <div>
      <h2 style={{ margin: '0 0 8px', fontWeight: 800, color: '#0A1938', fontSize: '1.75rem' }}>Admin Dashboard</h2>
      <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '0.9375rem' }}>Maintain every detail of your website directly in PostgreSQL.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <div key={c.label} onClick={() => onNavigate(c.key)}
            style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderTop: `4px solid ${c.color}`, cursor: 'pointer' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600, marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontWeight: 700, color: '#0A1938' }}>Recent Customer Bookings</h3>
          <button onClick={() => onNavigate('enquiries')} style={{ background: '#f1f5f9', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', color: '#0A1938' }}>View All →</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Ref #', 'Name', 'Phone', 'Trip Type', 'Pickup → Destination', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 800, color: '#0A1938' }}>{e.booking_ref}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{e.name}</td>
                  <td style={{ padding: '12px' }}><a href={`tel:${e.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{e.phone}</a></td>
                  <td style={{ padding: '12px' }}>{e.trip_type || '-'}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{e.pickup_location || ''} {e.drop_location ? `→ ${e.drop_location}` : ''}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: e.status === 'new' ? '#fee2e2' : e.status === 'confirmed' ? '#d1fae5' : '#f1f5f9',
                      color: e.status === 'new' ? '#dc2626' : e.status === 'confirmed' ? '#059669' : '#475569',
                      padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700
                    }}>{e.status}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#94a3b8', fontSize: '0.8125rem' }}>{new Date(e.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>No enquiries submitted yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Bookings & Enquiries Manager ──────────────────────────────────────────────
function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [quoted, setQuoted] = useState('');
  const [saving, setSaving] = useState(false);
  const LIMIT = 20;

  const load = (st = statusFilter, pg = page) => {
    setLoading(true);
    const params = { limit: LIMIT, page: pg };
    if (st !== 'all') params.status = st;
    adminApi.getEnquiries(params)
      .then(d => { setEnquiries(d.enquiries || []); setTotal(d.total || 0); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter, page]);

  const openDetail = (e) => {
    setSelected(e);
    setNotes(e.admin_notes || '');
    setQuoted(e.quoted_amount || '');
    // Mark as read
    if (!e.is_read) adminApi.updateEnquiry(e.id, { is_read: true }).catch(() => {});
  };

  const handleStatusChange = async (id, newStatus) => {
    await adminApi.updateEnquiry(id, { status: newStatus }).catch(console.error);
    setSelected(prev => prev ? { ...prev, status: newStatus } : prev);
    load();
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    await adminApi.updateEnquiry(selected.id, { admin_notes: notes, quoted_amount: quoted || null }).catch(console.error);
    setSaving(false);
    setSelected(prev => ({ ...prev, admin_notes: notes, quoted_amount: quoted }));
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    await adminApi.deleteEnquiry(id).catch(console.error);
    setSelected(null);
    load();
  };

  const STATUS_OPTIONS = ['new', 'in-progress', 'confirmed', 'completed', 'cancelled'];
  const STATUS_COLORS = {
    new: { bg: '#fee2e2', color: '#dc2626' },
    'in-progress': { bg: '#fef3c7', color: '#b45309' },
    confirmed: { bg: '#d1fae5', color: '#059669' },
    completed: { bg: '#dbeafe', color: '#1d4ed8' },
    cancelled: { bg: '#f1f5f9', color: '#64748b' },
  };

  const pill = (status) => {
    const s = STATUS_COLORS[status] || STATUS_COLORS['new'];
    return (
      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color }}>
        {status || 'new'}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>📋 Bookings & Enquiries</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>
            {total} total enquiries — manage status, add notes, send quotes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'new', 'in-progress', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              style={{ padding: '7px 14px', borderRadius: 20, border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                background: statusFilter === s ? '#0A1938' : '#f1f5f9',
                color: statusFilter === s ? '#fff' : '#334155' }}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
        {/* Enquiry List Table */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>Loading enquiries...</div>
          ) : enquiries.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
              <div style={{ fontWeight: 700 }}>No enquiries found</div>
              <div style={{ fontSize: '0.875rem', marginTop: 4 }}>
                {statusFilter !== 'all' ? `No "${statusFilter}" enquiries yet.` : 'Customers haven\'t submitted any enquiries yet.'}
              </div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Ref #', 'Name', 'Phone', 'Trip Type', 'Route', 'Status', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: '11px 12px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e, i) => {
                  const isActive = selected?.id === e.id;
                  return (
                    <tr key={e.id}
                      onClick={() => openDetail(e)}
                      style={{ borderBottom: '1px solid #f1f5f9', background: isActive ? '#eff6ff' : (i % 2 === 0 ? '#fff' : '#fafbfc'), cursor: 'pointer', transition: 'background 0.1s' }}>
                      <td style={{ padding: '11px 12px', fontWeight: 800, color: '#0A1938', whiteSpace: 'nowrap' }}>
                        {!e.is_read && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#dc2626', marginRight: 6, verticalAlign: 'middle' }} />}
                        {e.booking_ref || e.id?.slice(0, 8)}
                      </td>
                      <td style={{ padding: '11px 12px', fontWeight: 600 }}>{e.name}</td>
                      <td style={{ padding: '11px 12px' }}>
                        <a href={`tel:${e.phone}`} style={{ color: '#1d4ed8', textDecoration: 'none', fontWeight: 600 }} onClick={ev => ev.stopPropagation()}>{e.phone}</a>
                      </td>
                      <td style={{ padding: '11px 12px', color: '#334155' }}>{e.trip_type || '-'}</td>
                      <td style={{ padding: '11px 12px', color: '#64748b', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {[e.pickup_location, e.drop_location].filter(Boolean).join(' → ') || '-'}
                      </td>
                      <td style={{ padding: '11px 12px' }}>{pill(e.status)}</td>
                      <td style={{ padding: '11px 12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN') : '-'}</td>
                      <td style={{ padding: '11px 12px' }}>
                        <button onClick={ev => { ev.stopPropagation(); openDetail(e); }}
                          style={{ padding: '4px 10px', background: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: 5, fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}>
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {total > LIMIT && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '16px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                ← Prev
              </button>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Page {page} of {Math.ceil(total / LIMIT)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / LIMIT)}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: page >= Math.ceil(total / LIMIT) ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: 20, height: 'fit-content', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0A1938' }}>{selected.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>{selected.booking_ref || selected.id?.slice(0, 8)}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            {/* Contact Info */}
            <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`tel:${selected.phone}`}
                  style={{ flex: 1, padding: '9px 12px', background: '#0A1938', color: '#fff', borderRadius: 8, textAlign: 'center', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 700 }}>
                  📞 Call {selected.phone}
                </a>
                <a href={`https://wa.me/${(selected.phone || '').replace(/[\s+\-()]/g, '')}?text=${encodeURIComponent(`Hi ${selected.name}, Thank you for contacting Friends Tours & Travels. Regarding your enquiry (Ref: ${selected.booking_ref}), we would like to assist you.`)}`}
                  target="_blank" rel="noreferrer"
                  style={{ flex: 1, padding: '9px 12px', background: '#25d366', color: '#fff', borderRadius: 8, textAlign: 'center', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 700 }}>
                  💬 WhatsApp
                </a>
              </div>
              {selected.email && (
                <a href={`mailto:${selected.email}`}
                  style={{ padding: '7px 12px', background: '#f8fafc', color: '#0A1938', borderRadius: 8, textAlign: 'center', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600, border: '1px solid #e2e8f0' }}>
                  ✉️ {selected.email}
                </a>
              )}
            </div>

            {/* Trip Details */}
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 14, display: 'grid', gap: 8, fontSize: '0.8125rem' }}>
              <div style={{ fontWeight: 800, color: '#0A1938', marginBottom: 4 }}>Trip Details</div>
              {[
                ['Trip Type', selected.trip_type],
                ['Vehicle Pref.', selected.vehicle_preference],
                ['Pickup', selected.pickup_location],
                ['Drop', selected.drop_location],
                ['Travel Date', selected.travel_date ? new Date(selected.travel_date).toLocaleDateString('en-IN') : null],
                ['Return Date', selected.return_date ? new Date(selected.return_date).toLocaleDateString('en-IN') : null],
                ['Passengers', selected.passengers],
                ['No. of Hrs', selected.num_hours],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{label}:</span>
                  <span style={{ fontWeight: 700, color: '#334155', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
              {selected.message && (
                <div style={{ marginTop: 6, borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                  <div style={{ color: '#64748b', fontWeight: 600, marginBottom: 4 }}>Message:</div>
                  <div style={{ color: '#334155', lineHeight: 1.5 }}>{selected.message}</div>
                </div>
              )}
            </div>

            {/* Status Changer */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: 6 }}>UPDATE STATUS</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {STATUS_OPTIONS.map(s => {
                  const sc = STATUS_COLORS[s];
                  const isActive = selected.status === s;
                  return (
                    <button key={s} onClick={() => handleStatusChange(selected.id, s)}
                      style={{ padding: '5px 12px', borderRadius: 20, border: isActive ? '2px solid currentColor' : '2px solid transparent', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer',
                        background: isActive ? sc.bg : '#f1f5f9', color: isActive ? sc.color : '#64748b' }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quoted Amount */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: 4 }}>QUOTED AMOUNT (₹)</label>
              <input type="number" value={quoted} onChange={e => setQuoted(e.target.value)}
                style={{ ...inputStyle, marginTop: 0 }} placeholder="Enter quote amount..." />
            </div>

            {/* Admin Notes */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569', display: 'block', marginBottom: 4 }}>ADMIN NOTES</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                style={{ ...inputStyle, resize: 'vertical', marginTop: 0 }} placeholder="Add internal notes..." />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSaveNotes} disabled={saving}
                style={{ flex: 1, padding: '10px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                {saving ? 'Saving...' : '💾 Save Notes & Quote'}
              </button>
              <button onClick={() => handleDelete(selected.id)}
                style={{ padding: '10px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                🗑️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Core Services Manager & Full In-Detail Editor ─────────────────────────────
function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const emptyService = {
    id: '', slug: '', title: '', badge: '', category: 'Corporate Mobility',
    short_desc: '', full_desc: '', features: [], image: '',
    target_route: '/services/corporate-travel', sort_order: 1, enabled: true
  };

  const load = () => {
    setLoading(true);
    adminApi.getServices().then(setServices).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleEdit = (s) => {
    const feat = Array.isArray(s.features) ? s.features : (typeof s.features === 'string' ? JSON.parse(s.features || '[]') : []);
    setEditingService({ ...s, features: feat });
    setIsNew(false);
  };

  const handleCreateNew = () => {
    setEditingService({ ...emptyService, id: `srv-${Date.now()}` });
    setIsNew(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingService.title) return alert('Service Title is required');
    if (isNew) {
      if (!editingService.slug) editingService.slug = editingService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await adminApi.createService(editingService);
    } else {
      await adminApi.updateService(editingService.id, editingService);
    }
    setEditingService(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    await adminApi.deleteService(id);
    load();
  };

  const handleToggle = async (s) => {
    await adminApi.updateService(s.id, { ...s, enabled: !s.enabled });
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>Core Services ({services.length})</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>Edit titles, checklists, descriptions, badges, and landing page links.</p>
        </div>
        <button onClick={handleCreateNew} style={{ padding: '10px 20px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
          + Add New Service
        </button>
      </div>

      {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading services...</div> : (
        <div style={{ display: 'grid', gap: 16 }}>
          {services.map(s => {
            const featList = Array.isArray(s.features) ? s.features : (typeof s.features === 'string' ? JSON.parse(s.features || '[]') : []);
            return (
              <div key={s.id} style={{ background: '#fff', borderRadius: 14, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <img src={s.image} alt={s.title} style={{ width: 130, height: 90, objectFit: 'cover', borderRadius: 10, background: '#f8fafc' }} onError={e => e.target.style.display = 'none'} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ background: '#f1f5f9', color: '#0A1938', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800 }}>{s.badge || 'SERVICE'}</span>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0A1938' }}>{s.title}</h4>
                  </div>
                  <p style={{ margin: '6px 0 10px', fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>{s.short_desc || s.full_desc}</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {featList.slice(0, 4).map((f, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>✓ {f}</span>
                    ))}
                    {featList.length > 4 && <span style={{ fontSize: '0.75rem', color: '#64748b' }}>+{featList.length - 4} more</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
                  <button onClick={() => handleToggle(s)}
                    style={{ padding: '5px 12px', borderRadius: 6, border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', background: s.enabled ? '#d1fae5' : '#fee2e2', color: s.enabled ? '#059669' : '#dc2626' }}>
                    {s.enabled ? 'Active' : 'Disabled'}
                  </button>
                  <button onClick={() => handleEdit(s)}
                    style={{ padding: '6px 14px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                    ✏️ Edit Service
                  </button>
                  <button onClick={() => handleDelete(s.id)}
                    style={{ padding: '6px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Service Edit Modal */}
      {editingService && (
        <Modal title={isNew ? 'Create New Service' : `Edit Service: ${editingService.title}`} onClose={() => setEditingService(null)} maxWidth={700}>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>SERVICE TITLE *</label>
              <input type="text" value={editingService.title} onChange={e => setEditingService({ ...editingService, title: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>BADGE / TAGLINE</label>
              <input type="text" value={editingService.badge || ''} onChange={e => setEditingService({ ...editingService, badge: e.target.value })} placeholder="e.g. SERVICE 01 • CORPORATE MOBILITY" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>CATEGORY</label>
              <input type="text" value={editingService.category || ''} onChange={e => setEditingService({ ...editingService, category: e.target.value })} placeholder="e.g. Corporate Mobility / Airport" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>TARGET PAGE ROUTE</label>
              <input type="text" value={editingService.target_route || ''} onChange={e => setEditingService({ ...editingService, target_route: e.target.value })} placeholder="e.g. /services/corporate-travel" style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ImageUploadInput
                label="SERVICE IMAGE"
                value={editingService.image || ''}
                onChange={val => setEditingService({ ...editingService, image: val })}
                placeholder="/services/employee-transport.jpg"
                category="services"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>SHORT DESCRIPTION</label>
              <input type="text" value={editingService.short_desc || ''} onChange={e => setEditingService({ ...editingService, short_desc: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>FULL IN-DEPTH DESCRIPTION</label>
              <textarea value={editingService.full_desc || ''} onChange={e => setEditingService({ ...editingService, full_desc: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ArrayEditor
                label="CHECKLIST FEATURES"
                items={editingService.features || []}
                onChange={items => setEditingService({ ...editingService, features: items })}
                placeholder="e.g. Scheduled Shift Pickups"
              />
            </div>

            <div style={{ display: 'flex', gap: 20, gridColumn: '1 / -1', alignItems: 'center', marginTop: 6 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={editingService.enabled} onChange={e => setEditingService({ ...editingService, enabled: e.target.checked })} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Active & Visible on Services Page</span>
              </label>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                💾 Save Service to PostgreSQL
              </button>
              <button type="button" onClick={() => setEditingService(null)} style={{ padding: '12px 24px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Fleet Vehicles Manager & Full In-Detail Editor ────────────────────────────
function VehiclesManager() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const emptyVehicle = {
    id: '', slug: '', name: '', category: 'Compact Sedan', type_category: 'SEDAN',
    badge: '', color: 'White', passenger_capacity: '4 Passengers', passenger_count: 4,
    luggage_capacity: '2 Bags', air_conditioning: 'AC', best_suited_for: '',
    image: '/fleet/dzire-white.jpg', description: '', features: [],
    package_4hr_40km: 900, package_8hr_80km: 1700, extra_km: 12, extra_hour: 150,
    night_bata: 100, outstation_rate_per_km: 12, outstation_min_per_day: 3600,
    pricing_type: 'Local & Outstation Packages', price_note: '',
    featured: false, enabled: true, sort_order: 1
  };

  const load = () => {
    setLoading(true);
    adminApi.getVehicles().then(setVehicles).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleEdit = (v) => {
    const feat = Array.isArray(v.features) ? v.features : (typeof v.features === 'string' ? JSON.parse(v.features || '[]') : []);
    setEditingVehicle({ ...v, features: feat });
    setIsNew(false);
  };

  const handleCreateNew = () => {
    setEditingVehicle({ ...emptyVehicle, id: `v-${Date.now()}` });
    setIsNew(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingVehicle.name) return alert('Name is required');
    if (isNew) {
      if (!editingVehicle.slug) editingVehicle.slug = editingVehicle.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await adminApi.createVehicle(editingVehicle);
    } else {
      await adminApi.updateVehicle(editingVehicle.id, editingVehicle);
    }
    setEditingVehicle(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle from the fleet?')) return;
    await adminApi.deleteVehicle(id);
    load();
  };

  const handleToggle = async (v) => {
    await adminApi.updateVehicle(v.id, { ...v, enabled: !v.enabled });
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>Fleet Vehicles ({vehicles.length})</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>Edit vehicle specs, checklist features, local packages, and outstation tariffs.</p>
        </div>
        <button onClick={handleCreateNew} style={{ padding: '10px 20px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
          + Add New Vehicle
        </button>
      </div>

      {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading fleet...</div> : (
        <div style={{ display: 'grid', gap: 14 }}>
          {vehicles.map(v => (
            <div key={v.id} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 20 }}>
              <img src={v.image} alt={v.name} style={{ width: 110, height: 75, objectFit: 'contain', borderRadius: 8, background: '#f8fafc' }} onError={e => e.target.style.display = 'none'} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0A1938' }}>{v.name}</h4>
                  {v.badge && <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800 }}>{v.badge}</span>}
                  <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>{v.type_category}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: 4 }}>
                  {v.category} · {v.passenger_capacity} · {v.luggage_capacity} · {v.air_conditioning}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                  Local: 4hr/40km ₹{v.package_4hr_40km || '-'} | 8hr/80km ₹{v.package_8hr_80km || '-'} | Outstation: {v.outstation_rate_per_km ? `₹${v.outstation_rate_per_km}/km` : 'Custom'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => handleToggle(v)}
                  style={{ padding: '6px 14px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', background: v.enabled ? '#d1fae5' : '#fee2e2', color: v.enabled ? '#059669' : '#dc2626' }}>
                  {v.enabled ? 'Enabled' : 'Disabled'}
                </button>
                <button onClick={() => handleEdit(v)}
                  style={{ padding: '6px 14px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(v.id)}
                  style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vehicle In-Detail Edit Modal */}
      {editingVehicle && (
        <Modal title={isNew ? 'Create New Vehicle' : `Edit Vehicle: ${editingVehicle.name}`} onClose={() => setEditingVehicle(null)} maxWidth={740}>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>VEHICLE DISPLAY NAME *</label>
              <input type="text" value={editingVehicle.name} onChange={e => setEditingVehicle({ ...editingVehicle, name: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>CATEGORY</label>
              <input type="text" value={editingVehicle.category} onChange={e => setEditingVehicle({ ...editingVehicle, category: e.target.value })} placeholder="e.g. Compact Sedan" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>TYPE CATEGORY</label>
              <select value={editingVehicle.type_category} onChange={e => setEditingVehicle({ ...editingVehicle, type_category: e.target.value })} style={inputStyle}>
                <option value="SEDAN">SEDAN</option>
                <option value="MPV">MPV</option>
                <option value="LUXURY">LUXURY</option>
                <option value="TEMPO TRAVELLER">TEMPO TRAVELLER</option>
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>BADGE / TAG</label>
              <input type="text" value={editingVehicle.badge || ''} onChange={e => setEditingVehicle({ ...editingVehicle, badge: e.target.value })} placeholder="e.g. BEST VALUE / MOST POPULAR" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>COLOR</label>
              <input type="text" value={editingVehicle.color || ''} onChange={e => setEditingVehicle({ ...editingVehicle, color: e.target.value })} placeholder="e.g. White" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>PASSENGER CAPACITY</label>
              <input type="text" value={editingVehicle.passenger_capacity || ''} onChange={e => setEditingVehicle({ ...editingVehicle, passenger_capacity: e.target.value })} placeholder="e.g. 4 Passengers" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>LUGGAGE CAPACITY</label>
              <input type="text" value={editingVehicle.luggage_capacity || ''} onChange={e => setEditingVehicle({ ...editingVehicle, luggage_capacity: e.target.value })} placeholder="e.g. 2 Bags" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>AIR CONDITIONING</label>
              <input type="text" value={editingVehicle.air_conditioning || ''} onChange={e => setEditingVehicle({ ...editingVehicle, air_conditioning: e.target.value })} placeholder="e.g. Dual AC Climate" style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ImageUploadInput
                label="VEHICLE IMAGE"
                value={editingVehicle.image || ''}
                onChange={val => setEditingVehicle({ ...editingVehicle, image: val })}
                placeholder="/fleet/dzire-white.jpg"
                category="fleet"
              />
            </div>

            <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: 14, borderRadius: 10 }}>
              <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#0A1938', marginBottom: 10 }}>BANGALORE LOCAL TARIFF (₹)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>4HR / 40KM (₹)</label>
                  <input type="number" value={editingVehicle.package_4hr_40km || ''} onChange={e => setEditingVehicle({ ...editingVehicle, package_4hr_40km: parseInt(e.target.value) || null })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>8HR / 80KM (₹)</label>
                  <input type="number" value={editingVehicle.package_8hr_80km || ''} onChange={e => setEditingVehicle({ ...editingVehicle, package_8hr_80km: parseInt(e.target.value) || null })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>EXTRA HR (₹)</label>
                  <input type="number" value={editingVehicle.extra_hour || ''} onChange={e => setEditingVehicle({ ...editingVehicle, extra_hour: parseInt(e.target.value) || null })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>EXTRA KM (₹)</label>
                  <input type="number" value={editingVehicle.extra_km || ''} onChange={e => setEditingVehicle({ ...editingVehicle, extra_km: parseInt(e.target.value) || null })} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: 14, borderRadius: 10 }}>
              <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#0A1938', marginBottom: 10 }}>OUTSTATION HIGHWAY TARIFF (MIN 300KM/DAY)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>MIN PER DAY (₹)</label>
                  <input type="number" value={editingVehicle.outstation_min_per_day || ''} onChange={e => setEditingVehicle({ ...editingVehicle, outstation_min_per_day: parseInt(e.target.value) || null })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>RATE PER KM (₹)</label>
                  <input type="number" value={editingVehicle.outstation_rate_per_km || ''} onChange={e => setEditingVehicle({ ...editingVehicle, outstation_rate_per_km: parseInt(e.target.value) || null })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>NIGHT BATA (₹)</label>
                  <input type="number" value={editingVehicle.night_bata || ''} onChange={e => setEditingVehicle({ ...editingVehicle, night_bata: parseInt(e.target.value) || null })} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>PRICE NOTE / SUMMARY</label>
              <input type="text" value={editingVehicle.price_note || ''} onChange={e => setEditingVehicle({ ...editingVehicle, price_note: e.target.value })} placeholder="Local 8hr/80km from ₹1,700 | Outstation from ₹3,600/day" style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ArrayEditor
                label="VEHICLE FEATURES CHECKLIST"
                items={editingVehicle.features || []}
                onChange={items => setEditingVehicle({ ...editingVehicle, features: items })}
                placeholder="e.g. Clean, air-conditioned compact sedan with yellow board"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>LONG DESCRIPTION</label>
              <textarea value={editingVehicle.description || ''} onChange={e => setEditingVehicle({ ...editingVehicle, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 20, gridColumn: '1 / -1', alignItems: 'center' }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={editingVehicle.enabled} onChange={e => setEditingVehicle({ ...editingVehicle, enabled: e.target.checked })} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Active & Visible on Website</span>
              </label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={editingVehicle.featured} onChange={e => setEditingVehicle({ ...editingVehicle, featured: e.target.checked })} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Featured Vehicle</span>
              </label>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                💾 Save Vehicle to PostgreSQL
              </button>
              <button type="button" onClick={() => setEditingVehicle(null)} style={{ padding: '12px 24px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Tour Packages Manager & In-Detail Editor ───────────────────────────────────
function PackagesManager() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const emptyPackage = {
    id: '', slug: '', name: '', destination: '', state: 'Karnataka', country: 'India',
    hero_image: '/destinations/nandi-hills-sunrise.jpg', badge: 'POPULAR',
    duration: '1 Day', nights: 'Same Day Return', travel_type: 'Scenic Road Trip',
    price_starting: '₹2,499', short_description: '', overview: '',
    highlights: [], inclusions: [], exclusions: [],
    featured: false, enabled: true, sort_order: 1
  };

  const load = () => {
    setLoading(true);
    adminApi.getPackages().then(setPackages).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleEdit = (p) => {
    const hl = Array.isArray(p.highlights) ? p.highlights : (typeof p.highlights === 'string' ? JSON.parse(p.highlights || '[]') : []);
    const inc = Array.isArray(p.inclusions) ? p.inclusions : (typeof p.inclusions === 'string' ? JSON.parse(p.inclusions || '[]') : []);
    const exc = Array.isArray(p.exclusions) ? p.exclusions : (typeof p.exclusions === 'string' ? JSON.parse(p.exclusions || '[]') : []);
    setEditingPackage({ ...p, highlights: hl, inclusions: inc, exclusions: exc });
    setIsNew(false);
  };

  const handleCreateNew = () => {
    setEditingPackage({ ...emptyPackage, id: `pkg-${Date.now()}` });
    setIsNew(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingPackage.name) return alert('Name is required');
    if (isNew) {
      if (!editingPackage.slug) editingPackage.slug = editingPackage.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await adminApi.createPackage(editingPackage);
    } else {
      await adminApi.updatePackage(editingPackage.id, editingPackage);
    }
    setEditingPackage(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    await adminApi.deletePackage(id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>Tour Packages ({packages.length})</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>Edit destinations, highlights, inclusions, exclusions, and itineraries.</p>
        </div>
        <button onClick={handleCreateNew} style={{ padding: '10px 20px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
          + Add Tour Package
        </button>
      </div>

      {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading packages...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {packages.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 160, position: 'relative', background: '#f1f5f9' }}>
                <img src={p.hero_image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                {p.badge && <span style={{ position: 'absolute', top: 10, left: 10, background: '#0A1938', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800 }}>{p.badge}</span>}
              </div>
              <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 800, color: '#0A1938' }}>{p.name}</h4>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{p.destination}, {p.state} · {p.duration}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', margin: '10px 0' }}>From {p.price_starting}</div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                  <button onClick={() => handleEdit(p)} style={{ flex: 1, padding: '7px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                    ✏️ Edit Package
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ padding: '7px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package In-Detail Edit Modal */}
      {editingPackage && (
        <Modal title={isNew ? 'Create New Package' : `Edit Package: ${editingPackage.name}`} onClose={() => setEditingPackage(null)} maxWidth={740}>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>PACKAGE NAME *</label>
              <input type="text" value={editingPackage.name} onChange={e => setEditingPackage({ ...editingPackage, name: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DESTINATION</label>
              <input type="text" value={editingPackage.destination || ''} onChange={e => setEditingPackage({ ...editingPackage, destination: e.target.value })} placeholder="e.g. Mysore / Coorg" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>STATE</label>
              <input type="text" value={editingPackage.state || ''} onChange={e => setEditingPackage({ ...editingPackage, state: e.target.value })} placeholder="e.g. Karnataka" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DURATION</label>
              <input type="text" value={editingPackage.duration || ''} onChange={e => setEditingPackage({ ...editingPackage, duration: e.target.value })} placeholder="e.g. 1 Day / 2 Days" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>STARTING PRICE</label>
              <input type="text" value={editingPackage.price_starting || ''} onChange={e => setEditingPackage({ ...editingPackage, price_starting: e.target.value })} placeholder="e.g. ₹3,499" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>BADGE</label>
              <input type="text" value={editingPackage.badge || ''} onChange={e => setEditingPackage({ ...editingPackage, badge: e.target.value })} placeholder="e.g. BEST SELLER" style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ImageUploadInput
                label="HERO PACKAGE IMAGE"
                value={editingPackage.hero_image || ''}
                onChange={val => setEditingPackage({ ...editingPackage, hero_image: val })}
                placeholder="/destinations/mysore-palace.jpg"
                category="packages"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>SHORT DESCRIPTION</label>
              <input type="text" value={editingPackage.short_description || ''} onChange={e => setEditingPackage({ ...editingPackage, short_description: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ArrayEditor
                label="PACKAGE HIGHLIGHTS"
                items={editingPackage.highlights || []}
                onChange={items => setEditingPackage({ ...editingPackage, highlights: items })}
                placeholder="e.g. Fast travel via 10-lane Bangalore-Mysore Expressway"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ArrayEditor
                label="INCLUSIONS"
                items={editingPackage.inclusions || []}
                onChange={items => setEditingPackage({ ...editingPackage, inclusions: items })}
                placeholder="e.g. Private air-conditioned vehicle for the entire round trip"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ArrayEditor
                label="EXCLUSIONS"
                items={editingPackage.exclusions || []}
                onChange={items => setEditingPackage({ ...editingPackage, exclusions: items })}
                placeholder="e.g. Palace entrance tickets, meals and beverages"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>OVERVIEW / ITINERARY SUMMARY</label>
              <textarea value={editingPackage.overview || ''} onChange={e => setEditingPackage({ ...editingPackage, overview: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 20, gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={editingPackage.enabled} onChange={e => setEditingPackage({ ...editingPackage, enabled: e.target.checked })} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Active & Visible on Website</span>
              </label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={editingPackage.featured} onChange={e => setEditingPackage({ ...editingPackage, featured: e.target.checked })} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Featured Package</span>
              </label>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                💾 Save Package to PostgreSQL
              </button>
              <button type="button" onClick={() => setEditingPackage(null)} style={{ padding: '12px 24px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Official Tariff Card Manager & Editor ─────────────────────────────────────
function TariffManager() {
  const [tab, setTab] = useState('local');
  const [localList, setLocalList] = useState([]);
  const [outstationList, setOutstationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [l, o] = await Promise.all([adminApi.getLocalTariffs(), adminApi.getOutstationTariffs()]);
      setLocalList(l);
      setOutstationList(o);
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleEditLocal = (item) => {
    setEditingItem({ ...item, _type: 'local' });
    setIsNew(false);
  };

  const handleEditOutstation = (item) => {
    setEditingItem({ ...item, _type: 'outstation' });
    setIsNew(false);
  };

  const handleCreateNewLocal = () => {
    setEditingItem({ _type: 'local', vehicle_name: '', category: '', package_4hr_40km: 1000, package_8hr_80km: 2000, extra_hour: 200, extra_km: 15, night_bata: 200, sort_order: localList.length + 1, enabled: true });
    setIsNew(true);
  };

  const handleCreateNewOutstation = () => {
    setEditingItem({ _type: 'outstation', vehicle_name: '', category: '', min_amount_per_day: 4000, extra_per_km: 14, driver_bata_day: 350, night_bata_extra: 350, sort_order: outstationList.length + 1, enabled: true });
    setIsNew(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingItem._type === 'local') {
      if (isNew) await adminApi.createLocalTariff(editingItem);
      else await adminApi.updateLocalTariff(editingItem.id, editingItem);
    } else {
      if (isNew) await adminApi.createOutstationTariff(editingItem);
      else await adminApi.updateOutstationTariff(editingItem.id, editingItem);
    }
    setEditingItem(null);
    load();
  };

  const handleDelete = async (item, type) => {
    if (!confirm(`Delete tariff entry for ${item.vehicle_name}?`)) return;
    if (type === 'local') await adminApi.deleteLocalTariff(item.id);
    else await adminApi.deleteOutstationTariff(item.id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>Tariff Rate Cards (Local & Outstation)</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>Directly maintain the price list shown across the website.</p>
        </div>
        <button onClick={tab === 'local' ? handleCreateNewLocal : handleCreateNewOutstation}
          style={{ padding: '10px 20px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
          + Add {tab === 'local' ? 'Local' : 'Outstation'} Vehicle Rate
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab('local')}
          style={{ padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', background: tab === 'local' ? '#0A1938' : '#f1f5f9', color: tab === 'local' ? '#fff' : '#475569' }}>
          Bangalore Local Tariff ({localList.length})
        </button>
        <button onClick={() => setTab('outstation')}
          style={{ padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', background: tab === 'outstation' ? '#0A1938' : '#f1f5f9', color: tab === 'outstation' ? '#fff' : '#475569' }}>
          Outstation Tariff ({outstationList.length})
        </button>
      </div>

      {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading tariffs...</div> : (
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          {tab === 'local' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Vehicle', 'Category', '4hr / 40km', '8hr / 80km', 'Extra Hr', 'Extra Km', 'Night Bata', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {localList.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0A1938' }}>{item.vehicle_name}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{item.category}</td>
                    <td style={{ padding: '12px 14px' }}>{item.package_4hr_40km ? `₹${item.package_4hr_40km}` : 'N/A'}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#059669' }}>₹{item.package_8hr_80km}</td>
                    <td style={{ padding: '12px 14px' }}>₹{item.extra_hour}</td>
                    <td style={{ padding: '12px 14px' }}>₹{item.extra_km}</td>
                    <td style={{ padding: '12px 14px' }}>₹{item.night_bata}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => handleEditLocal(item)} style={{ padding: '4px 10px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', marginRight: 6 }}>Edit</button>
                      <button onClick={() => handleDelete(item, 'local')} style={{ padding: '4px 8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Vehicle', 'Category', 'Min Day (300km)', 'Extra / Km', 'Driver Bata', 'Night Bata', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {outstationList.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0A1938' }}>{item.vehicle_name}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{item.category}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#059669' }}>₹{item.min_amount_per_day}</td>
                    <td style={{ padding: '12px 14px' }}>₹{item.extra_per_km}</td>
                    <td style={{ padding: '12px 14px' }}>₹{item.driver_bata_day}</td>
                    <td style={{ padding: '12px 14px' }}>₹{item.night_bata_extra}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => handleEditOutstation(item)} style={{ padding: '4px 10px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', marginRight: 6 }}>Edit</button>
                      <button onClick={() => handleDelete(item, 'outstation')} style={{ padding: '4px 8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tariff Edit Modal */}
      {editingItem && (
        <Modal title={`Edit ${editingItem._type === 'local' ? 'Local' : 'Outstation'} Tariff`} onClose={() => setEditingItem(null)} maxWidth={500}>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: 12 }}>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>VEHICLE NAME *</label>
              <input type="text" value={editingItem.vehicle_name} onChange={e => setEditingItem({ ...editingItem, vehicle_name: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>CATEGORY</label>
              <input type="text" value={editingItem.category || ''} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })} style={inputStyle} />
            </div>

            {editingItem._type === 'local' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>4HR / 40KM (₹)</label>
                    <input type="number" value={editingItem.package_4hr_40km || ''} onChange={e => setEditingItem({ ...editingItem, package_4hr_40km: parseInt(e.target.value) || null })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>8HR / 80KM (₹) *</label>
                    <input type="number" value={editingItem.package_8hr_80km || ''} onChange={e => setEditingItem({ ...editingItem, package_8hr_80km: parseInt(e.target.value) || null })} required style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>EXTRA HR (₹)</label>
                    <input type="number" value={editingItem.extra_hour || ''} onChange={e => setEditingItem({ ...editingItem, extra_hour: parseInt(e.target.value) || null })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>EXTRA KM (₹)</label>
                    <input type="number" value={editingItem.extra_km || ''} onChange={e => setEditingItem({ ...editingItem, extra_km: parseInt(e.target.value) || null })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>NIGHT BATA (₹)</label>
                    <input type="number" value={editingItem.night_bata || ''} onChange={e => setEditingItem({ ...editingItem, night_bata: parseInt(e.target.value) || null })} style={inputStyle} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>MIN DAY (₹) *</label>
                    <input type="number" value={editingItem.min_amount_per_day || ''} onChange={e => setEditingItem({ ...editingItem, min_amount_per_day: parseInt(e.target.value) || null })} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>EXTRA / KM (₹) *</label>
                    <input type="number" value={editingItem.extra_per_km || ''} onChange={e => setEditingItem({ ...editingItem, extra_per_km: parseInt(e.target.value) || null })} required style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DRIVER BATA (₹)</label>
                    <input type="number" value={editingItem.driver_bata_day || ''} onChange={e => setEditingItem({ ...editingItem, driver_bata_day: parseInt(e.target.value) || null })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>NIGHT BATA (₹)</label>
                    <input type="number" value={editingItem.night_bata_extra || ''} onChange={e => setEditingItem({ ...editingItem, night_bata_extra: parseInt(e.target.value) || null })} style={inputStyle} />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                Save Tariff
              </button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Testimonials Manager & Editor ─────────────────────────────────────────────
function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const emptyTestimonial = { customer_name: '', designation: '', location: 'Bangalore', rating: 5, review: '', trip_type: 'Outstation', vehicle_used: '', travel_date: '2026', is_featured: false, is_approved: true };

  const load = () => {
    setLoading(true);
    adminApi.getTestimonials().then(setTestimonials).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleEdit = (t) => {
    setEditingItem({ ...t });
    setIsNew(false);
  };

  const handleCreateNew = () => {
    setEditingItem({ ...emptyTestimonial });
    setIsNew(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isNew) await adminApi.createTestimonial(editingItem);
    else await adminApi.updateTestimonial(editingItem.id, editingItem);
    setEditingItem(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    await adminApi.deleteTestimonial(id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>Customer Testimonials ({testimonials.length})</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>Edit reviews, manage approvals, and feature top feedback.</p>
        </div>
        <button onClick={handleCreateNew} style={{ padding: '10px 20px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
          + Add Testimonial
        </button>
      </div>

      {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading testimonials...</div> : (
        <div style={{ display: 'grid', gap: 14 }}>
          {testimonials.map(t => (
            <div key={t.id} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h4 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>{t.customer_name}</h4>
                  <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>{'★'.repeat(t.rating)}</span>
                  {t.is_featured && <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800 }}>Featured</span>}
                  <span style={{ background: t.is_approved ? '#d1fae5' : '#fee2e2', color: t.is_approved ? '#059669' : '#dc2626', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>
                    {t.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 8px' }}>
                  {t.designation} · {t.location} · {t.trip_type} ({t.vehicle_used || 'Cab'})
                </div>
                <div style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, background: '#f8fafc', padding: '10px 14px', borderRadius: 8 }}>
                  "{t.review}"
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(t)} style={{ padding: '6px 12px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>✏️ Edit</button>
                <button onClick={() => handleDelete(t.id)} style={{ padding: '6px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonial Edit Modal */}
      {editingItem && (
        <Modal title={isNew ? 'Create Testimonial' : `Edit Testimonial: ${editingItem.customer_name}`} onClose={() => setEditingItem(null)}>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>CUSTOMER NAME *</label>
              <input type="text" value={editingItem.customer_name} onChange={e => setEditingItem({ ...editingItem, customer_name: e.target.value })} required style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DESIGNATION</label>
              <input type="text" value={editingItem.designation || ''} onChange={e => setEditingItem({ ...editingItem, designation: e.target.value })} style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>LOCATION</label>
              <input type="text" value={editingItem.location || ''} onChange={e => setEditingItem({ ...editingItem, location: e.target.value })} style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>RATING (1-5)</label>
              <input type="number" min={1} max={5} value={editingItem.rating} onChange={e => setEditingItem({ ...editingItem, rating: parseInt(e.target.value) })} style={inputStyle} />
            </div>

            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>TRIP TYPE</label>
              <input type="text" value={editingItem.trip_type || ''} onChange={e => setEditingItem({ ...editingItem, trip_type: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>REVIEW CONTENT *</label>
              <textarea value={editingItem.review} onChange={e => setEditingItem({ ...editingItem, review: e.target.value })} rows={4} required style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 20, gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={editingItem.is_approved} onChange={e => setEditingItem({ ...editingItem, is_approved: e.target.checked })} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Approved for Public Display</span>
              </label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={editingItem.is_featured} onChange={e => setEditingItem({ ...editingItem, is_featured: e.target.checked })} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Featured Review</span>
              </label>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, marginTop: 10 }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Save Testimonial</button>
              <button type="button" onClick={() => setEditingItem(null)} style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Media & Image Uploader ───────────────────────────────────────────────────
function MediaManager() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('fleet');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const fileInputRef = useRef(null);

  const load = () => {
    setLoading(true);
    adminApi.getGallery().then(setGallery).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { dataUrl, blob } = await compressImage(file);
      setPreviewDataUrl(dataUrl);
      const uploadTitle = title.trim() || file.name.replace(/\.[^.]+$/, '');

      // 1. Try server storage upload
      try {
        const uploadFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
        const res = await adminApi.uploadImage(uploadFile, {
          title: uploadTitle,
          caption: caption.trim(),
          category,
          save_to_gallery: true,
        });
        if (res && (res.success || res.url)) {
          alert('Image uploaded successfully and added to Gallery!');
          setTitle(''); setCaption(''); setPreviewDataUrl('');
          load();
          return;
        }
      } catch (uploadErr) {
        console.warn('Server upload fallback to direct database insert:', uploadErr.message);
      }

      // 2. Direct PostgreSQL fallback (guaranteed to work across all platforms, including Vercel)
      if (dataUrl) {
        await adminApi.addGalleryItem({
          title: uploadTitle,
          caption: caption.trim(),
          category,
          image_url: dataUrl,
        });
        alert('Image saved successfully to Gallery!');
        setTitle(''); setCaption(''); setPreviewDataUrl('');
        load();
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddByUrl = async (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    setUploading(true);
    try {
      await adminApi.addGalleryItem({
        title: title.trim() || 'Gallery Image',
        caption: caption.trim(),
        category,
        image_url: imageUrlInput.trim(),
      });
      alert('Image URL added successfully to Gallery!');
      setTitle(''); setCaption(''); setImageUrlInput('');
      load();
    } catch (err) {
      alert(`Failed to add image: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove image from gallery?')) return;
    try {
      await adminApi.deleteGalleryItem(id);
      load();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredGallery = selectedFilter === 'all'
    ? gallery
    : gallery.filter(g => (g.category || '').toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>Media & Gallery Manager</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>
          Upload vehicle, tour, and service photos directly to server storage and PostgreSQL.
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: '#0A1938', fontSize: '1rem' }}>Upload or Add New Image</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>IMAGE TITLE</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Innova Crysta at Mysore"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>CATEGORY</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              <option value="fleet">Fleet Vehicles</option>
              <option value="outstation">Outstation Tours</option>
              <option value="airport">Airport Transfers</option>
              <option value="general">General / General Travel</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>CAPTION / ALT TEXT</label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Short photo description"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Upload methods: File picker or URL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          {/* Method 1: Upload from computer/device */}
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#0A1938', marginBottom: 6 }}>
              OPTION 1: UPLOAD FROM DEVICE
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '0.75rem', color: '#64748b' }}>
              Choose any photo from your phone or PC. Automatically optimized and saved.
            </p>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '11px 22px',
                background: uploading ? '#94a3b8' : 'linear-gradient(135deg, #0A1938 0%, #1e3a8a 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
              }}
            >
              {uploading ? '⏳ Uploading & Saving...' : '📁 Choose Image File to Upload'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </div>

          {/* Method 2: Add by URL */}
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#0A1938', marginBottom: 6 }}>
              OPTION 2: ADD BY IMAGE URL
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '0.75rem', color: '#64748b' }}>
              Paste an existing web URL (e.g. Unsplash, Wikipedia, or /fleet/car.jpg).
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... or /fleet/car.jpg"
                style={{ ...inputStyle, marginTop: 0, flex: 1, fontSize: '0.8rem' }}
              />
              <button
                type="button"
                disabled={uploading || !imageUrlInput.trim()}
                onClick={handleAddByUrl}
                style={{
                  padding: '0 16px',
                  background: !imageUrlInput.trim() ? '#cbd5e1' : '#0A1938',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: !imageUrlInput.trim() ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                + Add URL
              </button>
            </div>
          </div>
        </div>

        {previewDataUrl && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
            <img src={previewDataUrl} alt="Preview" style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 6 }} />
            <div style={{ fontSize: '0.8125rem', color: '#166534', fontWeight: 600 }}>Image ready and saving to PostgreSQL gallery...</div>
          </div>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ margin: 0, fontWeight: 800, color: '#0A1938', fontSize: '1rem' }}>
            Gallery Images ({filteredGallery.length}{selectedFilter !== 'all' ? ` of ${gallery.length}` : ''})
          </h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'fleet', 'outstation', 'airport', 'general'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: selectedFilter === cat ? 'none' : '1px solid #e2e8f0',
                  background: selectedFilter === cat ? '#0A1938' : '#f8fafc',
                  color: selectedFilter === cat ? '#fff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {cat === 'all' ? 'All Images' : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>Loading gallery...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {filteredGallery.map(img => (
              <div key={img.id} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 130, background: '#e2e8f0', overflow: 'hidden' }}>
                  <img
                    src={img.image_url}
                    alt={img.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0A1938', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {img.title || 'Untitled'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize', marginTop: 2 }}>
                      {img.category || 'general'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(img.image_url);
                        alert('Image URL copied to clipboard!');
                      }}
                      style={{ padding: '4px 10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Copy URL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      style={{ padding: '4px 10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, fontSize: '0.7rem', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredGallery.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                No gallery images found in this category. Upload one above!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── In-Detail Website Sections & Content Editor ───────────────────────────────
function ContentManager() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.getSettings().then(setSettings).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getVal = (key, fallback = '') => {
    const item = settings.find(s => s.key === key);
    return item ? (item.value || '') : fallback;
  };

  const setVal = (key, value) => {
    setSettings(prev => {
      const exists = prev.some(s => s.key === key);
      if (exists) return prev.map(s => s.key === key ? { ...s, value } : s);
      return [...prev, { key, value }];
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await adminApi.updateSettings(settings.map(s => ({ key: s.key, value: s.value }))).catch(console.error);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading website content...</div>;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>Website Sections & Content Editor</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>Edit headings, story paragraphs, safety standards, and stats shown across the website.</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gap: 24, maxWidth: 800 }}>
        {/* HERO SECTION */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: '#0A1938', fontSize: '1.05rem', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
            🌟 Hero Section (Homepage Banner)
          </h3>
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>HERO EYEBROW BANNER TEXT</label>
              <input type="text" value={getVal('hero_eyebrow')} onChange={e => setVal('hero_eyebrow', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>MAIN HEADLINE (H1)</label>
              <input type="text" value={getVal('hero_title')} onChange={e => setVal('hero_title', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>SUBTITLE / DESCRIPTION</label>
              <textarea value={getVal('hero_subtitle')} onChange={e => setVal('hero_subtitle', e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: '#0A1938', fontSize: '1.05rem', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
            🏛️ About Friends Tours Section
          </h3>
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>ABOUT TITLE / SLOGAN</label>
              <input type="text" value={getVal('about_title')} onChange={e => setVal('about_title', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>OUR STORY / OVERVIEW PARAGRAPH</label>
              <textarea value={getVal('about_story')} onChange={e => setVal('about_story', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>YEARS EXP.</label>
                <input type="text" value={getVal('stat_years_exp', '15+')} onChange={e => setVal('stat_years_exp', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>TRIPS COMPLETED</label>
                <input type="text" value={getVal('stat_trips_completed', '50,000+')} onChange={e => setVal('stat_trips_completed', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>STAR RATING</label>
                <input type="text" value={getVal('stat_client_rating', '4.9 / 5')} onChange={e => setVal('stat_client_rating', e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* SAFETY & RESPONSIBILITIES */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: '#0A1938', fontSize: '1.05rem', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
            🛡️ Safety & Responsibilities
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>SAFETY COMMITMENT 1</label>
              <input type="text" value={getVal('safety_gps')} onChange={e => setVal('safety_gps', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>SAFETY COMMITMENT 2</label>
              <input type="text" value={getVal('safety_police')} onChange={e => setVal('safety_police', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>SAFETY COMMITMENT 3</label>
              <input type="text" value={getVal('safety_sanitized')} onChange={e => setVal('safety_sanitized', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>SAFETY COMMITMENT 4</label>
              <input type="text" value={getVal('safety_billing')} onChange={e => setVal('safety_billing', e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          style={{ padding: '14px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
          {saving ? 'Saving Content to PostgreSQL...' : saved ? '✅ Website Content Updated Successfully!' : '💾 Save All Section Content'}
        </button>
      </form>
    </div>
  );
}

// ── Global Site Settings Manager ──────────────────────────────────────────────
function SettingsManager() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.getSettings().then(setSettings).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings(s => s.map(item => item.key === key ? { ...item, value } : item));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await adminApi.updateSettings(settings.map(s => ({ key: s.key, value: s.value }))).catch(console.error);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading settings...</div>;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>Global Contact & Site Settings</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>Update phone numbers, WhatsApp links, business address, and site metadata.</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', maxWidth: 680 }}>
        <form onSubmit={handleSave}>
          {settings.map(s => (
            <div key={s.key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.75rem', color: '#475569', marginBottom: 4, textTransform: 'uppercase' }}>
                {s.label || s.key}
              </label>
              <input
                type={s.type === 'email' ? 'email' : s.type === 'url' ? 'url' : 'text'}
                value={s.value || ''}
                onChange={e => handleChange(s.key, e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
          <button type="submit" disabled={saving}
            style={{ padding: '12px 28px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem' }}>
            {saving ? 'Saving to PostgreSQL...' : saved ? '✅ Settings Updated Successfully!' : 'Save All Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Airport Fare Zones Manager ─────────────────────────────────────────────────
function AirportAreasManager() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data: {} }
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  const load = () => {
    setLoading(true);
    adminApi.getAirportAreas().then(setAreas).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setForm({ name: '', distance_km: '', estimated_time: '', city_to_airport: '', airport_to_city: '', active: true });
    setModal({ mode: 'create' });
  };
  const openEdit = (area) => {
    setForm({ ...area });
    setModal({ mode: 'edit', id: area.id });
  };
  const closeModal = () => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === 'create') {
        await adminApi.createAirportArea(form);
      } else {
        await adminApi.updateAirportArea(modal.id, form);
      }
      load();
      closeModal();
    } catch (err) {
      alert('Error saving: ' + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await adminApi.deleteAirportArea(id).catch(console.error);
    load();
  };

  const fv = (k) => form[k] ?? '';
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading airport zones...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>✈️ Airport Fare Zones</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>
            Manage Bangalore locality → KIA airport fare calculator zones. Changes apply to the Airport Transfer page instantly.
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: '10px 20px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
          + Add Zone
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Locality / Area', 'Distance (km)', 'Est. Time', 'City→Airport (₹)', 'Airport→City (₹)', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {areas.map((a, i) => (
              <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0A1938' }}>{a.name}</td>
                <td style={{ padding: '12px 14px', color: '#334155' }}>{a.distance_km} km</td>
                <td style={{ padding: '12px 14px', color: '#334155' }}>{a.estimated_time}</td>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#166534' }}>₹{a.city_to_airport}</td>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#166534' }}>₹{a.airport_to_city}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: a.active ? '#dcfce7' : '#fef2f2', color: a.active ? '#166534' : '#dc2626' }}>
                    {a.active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(a)} style={{ padding: '5px 12px', background: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                    <button onClick={() => handleDelete(a.id, a.name)} style={{ padding: '5px 12px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {areas.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No zones found. Add your first airport zone.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === 'create' ? '+ Add Airport Zone' : '✏️ Edit Airport Zone'} onClose={closeModal} maxWidth={580}>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>LOCALITY / AREA NAME *</label>
              <input value={fv('name')} onChange={e => sf('name', e.target.value)} required style={inputStyle} placeholder="e.g. Koramangala" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DISTANCE (KM) *</label>
                <input type="number" step="0.1" value={fv('distance_km')} onChange={e => sf('distance_km', e.target.value)} required style={inputStyle} placeholder="e.g. 40" />
              </div>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>ESTIMATED TIME</label>
                <input value={fv('estimated_time')} onChange={e => sf('estimated_time', e.target.value)} style={inputStyle} placeholder="e.g. 60-75 mins" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>CITY → AIRPORT SEDAN FARE (₹) *</label>
                <input type="number" value={fv('city_to_airport')} onChange={e => sf('city_to_airport', e.target.value)} required style={inputStyle} placeholder="e.g. 1100" />
              </div>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>AIRPORT → CITY SEDAN FARE (₹) *</label>
                <input type="number" value={fv('airport_to_city')} onChange={e => sf('airport_to_city', e.target.value)} required style={inputStyle} placeholder="e.g. 1100" />
              </div>
            </div>
            <div style={{ background: '#fffbeb', borderRadius: 8, padding: '10px 14px', fontSize: '0.8125rem', color: '#92400e' }}>
              💡 <strong>Note:</strong> SUV fare = base × 1.75, Premium = base × 2.05 (auto-calculated in calculator)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="areaActive" checked={!!form.active} onChange={e => sf('active', e.target.checked)} style={{ width: 16, height: 16 }} />
              <label htmlFor="areaActive" style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0A1938' }}>Active (show in calculator)</label>
            </div>
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '11px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Saving...' : modal.mode === 'create' ? '+ Add Zone' : '💾 Update Zone'}
              </button>
              <button type="button" onClick={closeModal} style={{ padding: '11px 20px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Outstation Destinations Manager ───────────────────────────────────────────
function OutstationDestinationsManager() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  const load = () => {
    setLoading(true);
    adminApi.getOutstationDestinations().then(setDestinations).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setForm({ name: '', state: '', distance_km: '', est_drive_time: '', starting_price: '', badge: '', image_url: '', active: true });
    setModal({ mode: 'create' });
  };
  const openEdit = (d) => {
    setForm({ ...d });
    setModal({ mode: 'edit', id: d.id });
  };
  const closeModal = () => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === 'create') {
        await adminApi.createOutstationDestination(form);
      } else {
        await adminApi.updateOutstationDestination(modal.id, form);
      }
      load();
      closeModal();
    } catch (err) {
      alert('Error saving: ' + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await adminApi.deleteOutstationDestination(id).catch(console.error);
    load();
  };

  const fv = (k) => form[k] ?? '';
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading destinations...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800, color: '#0A1938' }}>🗺️ Outstation Destinations</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.875rem' }}>
            Manage popular outstation trip destinations shown on the Outstation service page.
          </p>
        </div>
        <button onClick={openCreate} style={{ padding: '10px 20px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
          + Add Destination
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
        {destinations.map(d => (
          <div key={d.id} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            {d.image_url && (
              <div style={{ height: 140, background: `url(${d.image_url}) center/cover`, position: 'relative' }}>
                {d.badge && (
                  <span style={{ position: 'absolute', top: 10, right: 10, background: '#f59e0b', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                    {d.badge}
                  </span>
                )}
              </div>
            )}
            {!d.image_url && d.badge && (
              <div style={{ padding: '10px 14px 0' }}>
                <span style={{ background: '#f59e0b', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{d.badge}</span>
              </div>
            )}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontWeight: 800, color: '#0A1938', fontSize: '1rem' }}>{d.name}</div>
              <div style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: 2 }}>{d.state}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: '6px 10px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>DISTANCE</div>
                  <div style={{ fontWeight: 700, color: '#334155' }}>{d.distance_km} km</div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: '6px 10px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>DRIVE TIME</div>
                  <div style={{ fontWeight: 700, color: '#334155' }}>{d.est_drive_time}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontWeight: 800, color: '#166534', fontSize: '1rem' }}>
                From ₹{d.starting_price?.toLocaleString?.() ?? d.starting_price}
              </div>
              <div style={{ marginTop: 4 }}>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: d.active ? '#dcfce7' : '#fef2f2', color: d.active ? '#166534' : '#dc2626' }}>
                  {d.active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => openEdit(d)} style={{ flex: 1, padding: '7px', background: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: 7, fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                <button onClick={() => handleDelete(d.id, d.name)} style={{ flex: 1, padding: '7px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 7, fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {destinations.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: 60, textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: 14 }}>
            No destinations yet. Add your first outstation destination.
          </div>
        )}
      </div>

      {modal && (
        <Modal title={modal.mode === 'create' ? '+ Add Destination' : '✏️ Edit Destination'} onClose={closeModal} maxWidth={620}>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DESTINATION NAME *</label>
                <input value={fv('name')} onChange={e => sf('name', e.target.value)} required style={inputStyle} placeholder="e.g. Coorg" />
              </div>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>STATE</label>
                <input value={fv('state')} onChange={e => sf('state', e.target.value)} style={inputStyle} placeholder="e.g. Karnataka" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>DISTANCE (KM) *</label>
                <input type="number" step="1" value={fv('distance_km')} onChange={e => sf('distance_km', e.target.value)} required style={inputStyle} placeholder="e.g. 250" />
              </div>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>EST. DRIVE TIME</label>
                <input value={fv('est_drive_time')} onChange={e => sf('est_drive_time', e.target.value)} style={inputStyle} placeholder="e.g. 5-6 hrs" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>STARTING PRICE (₹) *</label>
                <input type="number" value={fv('starting_price')} onChange={e => sf('starting_price', e.target.value)} required style={inputStyle} placeholder="e.g. 3500" />
              </div>
              <div>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>BADGE / TAG</label>
                <input value={fv('badge')} onChange={e => sf('badge', e.target.value)} style={inputStyle} placeholder="e.g. Most Popular, New" />
              </div>
            </div>
            <div>
              <ImageUploadInput
                label="DESTINATION IMAGE"
                value={form.image_url || ''}
                onChange={val => sf('image_url', val)}
                placeholder="https://... or /uploads/coorg.jpg"
                category="destinations"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="destActive" checked={!!form.active} onChange={e => sf('active', e.target.checked)} style={{ width: 16, height: 16 }} />
              <label htmlFor="destActive" style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0A1938' }}>Active (show on website)</label>
            </div>
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '11px', background: '#0A1938', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Saving...' : modal.mode === 'create' ? '+ Add Destination' : '💾 Update Destination'}
              </button>
              <button type="button" onClick={closeModal} style={{ padding: '11px 20px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Main Admin Navigation & Layout ────────────────────────────────────────────
const SECTIONS = [
  { key: 'dashboard', label: '📊 Dashboard' },
  { key: 'enquiries', label: '📋 Bookings & Enquiries' },
  { key: 'services', label: '💼 Core Services' },
  { key: 'vehicles', label: '🚗 Fleet Vehicles' },
  { key: 'packages', label: '🗺️ Tour Packages' },
  { key: 'tariffs', label: '💳 Tariff Rate Cards' },
  { key: 'airport', label: '✈️ Airport Fare Zones' },
  { key: 'outstation-dest', label: '📍 Outstation Destinations' },
  { key: 'testimonials', label: '⭐ Testimonials' },
  { key: 'content', label: '📝 Website Content' },
  { key: 'media', label: '🖼️ Media & Uploads' },
  { key: 'settings', label: '⚙️ Site Settings' },
];

function AdminApp() {
  const { admin, logout } = useAuth();
  const [section, setSection] = useState('dashboard');

  const renderSection = () => {
    switch (section) {
      case 'dashboard': return <Dashboard onNavigate={setSection} />;
      case 'enquiries': return <EnquiriesManager />;
      case 'services': return <ServicesManager />;
      case 'vehicles': return <VehiclesManager />;
      case 'packages': return <PackagesManager />;
      case 'tariffs': return <TariffManager />;
      case 'airport': return <AirportAreasManager />;
      case 'outstation-dest': return <OutstationDestinationsManager />;
      case 'testimonials': return <TestimonialsManager />;
      case 'content': return <ContentManager />;
      case 'media': return <MediaManager />;
      case 'settings': return <SettingsManager />;
      default: return <Dashboard onNavigate={setSection} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: '#0A1938', color: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>🚗 Friends Tours</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>PostgreSQL Admin Suite</div>
        </div>

        <nav style={{ padding: '16px 10px', flex: 1, overflowY: 'auto' }}>
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)}
              style={{
                display: 'block', width: '100%', padding: '11px 16px', textAlign: 'left',
                background: section === s.key ? 'rgba(255,255,255,0.12)' : 'transparent',
                border: 'none', color: section === s.key ? '#fff' : '#cbd5e1',
                fontSize: '0.875rem', fontWeight: section === s.key ? 700 : 500,
                borderRadius: 8, cursor: 'pointer', marginBottom: 4, transition: 'background 0.15s'
              }}>
              {s.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.8125rem', color: '#e2e8f0', fontWeight: 700 }}>{admin?.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 12 }}>{admin?.email}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/" target="_blank" rel="noreferrer"
              style={{ flex: 1, padding: '7px', background: 'rgba(255,255,255,0.08)', color: '#fff', textAlign: 'center', borderRadius: 6, textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
              View Website ↗
            </a>
            <button onClick={logout}
              style={{ padding: '7px 12px', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto', minWidth: 0 }}>
        {renderSection()}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <AuthProvider>
      <AdminPanelContent />
    </AuthProvider>
  );
}

function AdminPanelContent() {
  const { admin, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0A1938', color: '#fff', fontSize: '1.25rem', fontWeight: 600 }}>
        Connecting to PostgreSQL...
      </div>
    );
  }
  return admin ? <AdminApp /> : <LoginPage />;
}
