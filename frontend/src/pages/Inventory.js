import React, { useState } from 'react';
import { addTransaction } from '../services/api';

function Inventory({ transactions, materials, sites, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({
    transaction_type: 'inward',
    material_id: '',
    site_id: '',
    quantity: '',
    unit_price: '',
    note: ''
  });

  const showNotify = (msg, type = 'success') => {
    setNotify({ msg, type });
    setTimeout(() => setNotify(null), 3000);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!form.material_id || !form.site_id || !form.quantity) {
        showNotify('Material, site and quantity are required!', 'error');
        return;
      }
      await addTransaction(form);
      showNotify('Entry saved successfully!');
      setShowForm(false);
      setForm({ transaction_type: 'inward', material_id: '', site_id: '', quantity: '', unit_price: '', note: '' });
      onRefresh();
    } catch (err) {
      showNotify(err.response?.data?.error || 'Something went wrong!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const TX_COLORS = {
    inward: { bg: '#d1fae5', color: '#065f46' },
    outward: { bg: '#dbeafe', color: '#1e40af' },
    damaged: { bg: '#fee2e2', color: '#991b1b' },
    purchase: { bg: '#fef3c7', color: '#92400e' },
    adjustment: { bg: '#f3e8ff', color: '#6b21a8' }
  };

  const filtered = filterType === 'all' ? transactions : transactions.filter(tx => tx.transaction_type === filterType);

  return (
    <div>
      {/* Notification */}
      {notify && (
        <div style={{ ...styles.notify, background: notify.type === 'error' ? '#fee2e2' : '#d1fae5', color: notify.type === 'error' ? '#991b1b' : '#065f46', border: `1px solid ${notify.type === 'error' ? '#fca5a5' : '#6ee7b7'}` }}>
          {notify.type === 'error' ? '⚠️' : '✅'} {notify.msg}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Inventory Log</h1>
          <p style={styles.sub}>{transactions.length} total entries</p>
        </div>
        <button onClick={() => setShowForm(true)} style={styles.addBtn}>+ New Entry</button>
      </div>

      {/* Filter tabs */}
      <div style={styles.tabs}>
        {['all', 'inward', 'outward', 'damaged', 'purchase'].map(t => (
          <button key={t} onClick={() => setFilterType(t)} style={{
            ...styles.tab,
            background: filterType === t ? '#f59e0b' : '#f3f4f6',
            color: filterType === t ? '#000' : '#6b7280',
            fontWeight: filterType === t ? 700 : 400
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(tx => {
          const colors = TX_COLORS[tx.transaction_type] || TX_COLORS.inward;
          return (
            <div key={tx.id} style={styles.txCard}>
              <div style={{ ...styles.txIcon, background: colors.bg, color: colors.color }}>
                {{ inward: '📥', outward: '📤', damaged: '⚠️', purchase: '🛒', adjustment: '🔧' }[tx.transaction_type]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.txName}>{tx.material_name}</div>
                <div style={styles.txSub}>{tx.site_name} {tx.note ? `· ${tx.note}` : ''}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...styles.txQty, color: colors.color }}>
                  {tx.transaction_type === 'outward' || tx.transaction_type === 'damaged' ? '-' : '+'}{tx.quantity} {tx.material_unit}
                </div>
                <div style={styles.txDate}>{tx.transaction_date}</div>
              </div>
              <span style={{ ...styles.badge, background: colors.bg, color: colors.color }}>
                {tx.transaction_type}
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div style={styles.overlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>➕ New Inventory Entry</h2>
              <button onClick={() => setShowForm(false)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Entry Type */}
              <div style={styles.field}>
                <label style={styles.label}>Entry Type *</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { value: 'inward', label: '📥 Inward', color: '#065f46', bg: '#d1fae5' },
                    { value: 'outward', label: '📤 Outward', color: '#1e40af', bg: '#dbeafe' },
                    { value: 'purchase', label: '🛒 Purchase', color: '#92400e', bg: '#fef3c7' },
                    { value: 'damaged', label: '⚠️ Damaged', color: '#991b1b', bg: '#fee2e2' },
                  ].map(t => (
                    <button key={t.value} onClick={() => setForm(p => ({ ...p, transaction_type: t.value }))} style={{
                      flex: 1, minWidth: 100, padding: '8px 12px', borderRadius: 8,
                      border: `2px solid ${form.transaction_type === t.value ? t.color : '#e5e7eb'}`,
                      background: form.transaction_type === t.value ? t.bg : '#fff',
                      color: form.transaction_type === t.value ? t.color : '#6b7280',
                      cursor: 'pointer', fontFamily: 'Arial', fontSize: 13, fontWeight: 600
                    }}>{t.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                <div style={styles.field}>
                  <label style={styles.label}>Material *</label>
                  <select value={form.material_id} onChange={e => setForm(p => ({ ...p, material_id: e.target.value }))} style={styles.input}>
                    <option value="">Select material...</option>
                    {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Site *</label>
                  <select value={form.site_id} onChange={e => setForm(p => ({ ...p, site_id: e.target.value }))} style={styles.input}>
                    <option value="">Select site...</option>
                    {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Quantity *</label>
                  <input type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
                    placeholder="0" style={styles.input} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Unit Price (₹)</label>
                  <input type="number" value={form.unit_price} onChange={e => setForm(p => ({ ...p, unit_price: e.target.value }))}
                    placeholder="0" style={styles.input} />
                </div>
                <div style={{ ...styles.field, gridColumn: 'span 2' }}>
                  <label style={styles.label}>Note</label>
                  <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                    placeholder="Optional remark..." style={styles.input} />
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSave} disabled={loading} style={styles.saveBtn}>
                {loading ? 'Saving...' : '✅ Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  notify: { position: 'fixed', top: 20, right: 20, padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 2000 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 },
  sub: { color: '#6b7280', fontSize: 14, margin: '4px 0 0' },
  addBtn: { background: '#f59e0b', color: '#000', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  tabs: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  tab: { padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'Arial' },
  txCard: { background: '#fff', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  txIcon: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  txName: { fontSize: 14, fontWeight: 600, color: '#111827' },
  txSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  txQty: { fontSize: 15, fontWeight: 700 },
  txDate: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  badge: { padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, flexShrink: 0 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' },
  closeBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6b7280' },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: '#374151' },
  input: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Arial' },
  modalFooter: { display: 'flex', gap: 12, justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid #f3f4f6' },
  cancelBtn: { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' },
  saveBtn: { background: '#f59e0b', color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
};

export default Inventory;