import React, { useState } from 'react';
import { addMaterial, updateMaterial, deleteMaterial } from '../services/api';

function Materials({ materials, sites, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', sku: '', unit: 'Bags', min_stock: '', unit_price: '', description: ''
  });
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState(null);

  const UNITS = ['Bags', 'Tons', 'Pieces', 'Liters', 'Kg', 'Meters', 'Boxes', 'Rolls', 'Sheets'];

  const showNotify = (msg, type = 'success') => {
    setNotify({ msg, type });
    setTimeout(() => setNotify(null), 3000);
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', sku: '', unit: 'Bags', min_stock: '', unit_price: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (m) => {
    setEditItem(m);
    setForm({ name: m.name, sku: m.sku, unit: m.unit, min_stock: m.min_stock, unit_price: m.unit_price, description: m.description || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!form.name || !form.sku || !form.unit) {
        showNotify('Name, SKU and Unit are required!', 'error');
        return;
      }
      if (editItem) {
        await updateMaterial(editItem.id, form);
        showNotify('Material updated successfully!');
      } else {
        await addMaterial(form);
        showNotify('Material added successfully!');
      }
      setShowForm(false);
      onRefresh();
    } catch (err) {
      showNotify(err.response?.data?.error || 'Something went wrong!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteMaterial(id);
      showNotify('Material deleted!');
      onRefresh();
    } catch (err) {
      showNotify('Delete failed!', 'error');
    }
  };

  const filtered = materials.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.sku.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 style={styles.title}>Materials</h1>
          <p style={styles.sub}>{materials.length} materials in inventory</p>
        </div>
        <button onClick={openAdd} style={styles.addBtn}>+ Add Material</button>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍 Search materials or SKU..."
        style={styles.search}
      />

      {/* Table */}
      <div style={styles.table}>
        <table style={styles.tableEl}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Unit</th>
              <th style={styles.th}>Min Stock</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={styles.tableRow}>
                <td style={styles.td}>
                  <div style={{ fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{m.category_name}</div>
                </td>
                <td style={styles.td}><span style={styles.sku}>{m.sku}</span></td>
                <td style={styles.td}>{m.unit}</td>
                <td style={styles.td}>{m.min_stock}</td>
                <td style={styles.td}>₹{m.unit_price}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(m)} style={styles.editBtn}>✏️ Edit</button>
                    <button onClick={() => handleDelete(m.id, m.name)} style={styles.deleteBtn}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div style={styles.overlay} onClick={() => setShowForm(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editItem ? '✏️ Edit Material' : '➕ Add New Material'}</h2>
              <button onClick={() => setShowForm(false)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Material Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. OPC Cement 53 Grade" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>SKU Code *</label>
                <input value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))}
                  placeholder="e.g. CEM-001" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Unit *</label>
                <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} style={styles.input}>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Min Stock Level</label>
                <input type="number" value={form.min_stock} onChange={e => setForm(p => ({ ...p, min_stock: e.target.value }))}
                  placeholder="500" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Unit Price (₹)</label>
                <input type="number" value={form.unit_price} onChange={e => setForm(p => ({ ...p, unit_price: e.target.value }))}
                  placeholder="380" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Optional description" style={styles.input} />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSave} disabled={loading} style={styles.saveBtn}>
                {loading ? 'Saving...' : editItem ? '✅ Update Material' : '✅ Add Material'}
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
  search: { width: '100%', padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box' },
  table: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  tableEl: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#f9fafb' },
  tableRow: { borderTop: '1px solid #f3f4f6' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280' },
  td: { padding: '12px 16px', fontSize: 13, color: '#374151' },
  sku: { background: '#f3f4f6', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace', fontSize: 12 },
  editBtn: { background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 600 },
  deleteBtn: { background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 6, padding: '5px 8px', fontSize: 12, cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f3f4f6' },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' },
  closeBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 24 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: '#374151' },
  input: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'Arial' },
  modalFooter: { display: 'flex', gap: 12, justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid #f3f4f6' },
  cancelBtn: { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' },
  saveBtn: { background: '#f59e0b', color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
};

export default Materials;