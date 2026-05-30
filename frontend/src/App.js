import React, { useState, useEffect } from 'react';
import { getMaterials, getSites, getVendors, getTransactions } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [materials, setMaterials] = useState([]);
  const [sites, setSites] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [matsRes, sitesRes, vendorsRes, txRes] = await Promise.all([
        getMaterials(),
        getSites(),
        getVendors(),
        getTransactions()
      ]);
      setMaterials(matsRes.data.data);
      setSites(sitesRes.data.data);
      setVendors(vendorsRes.data.data);
      setTransactions(txRes.data.data);
    } catch (err) {
      console.log('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.loading}>
      <h2>Loading BuildTrack...</h2>
    </div>
  );

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <h2 style={styles.logoText}>🏗️ BuildTrack</h2>
          <p style={styles.logoSub}>Material Management</p>
        </div>
        <nav>
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'materials', label: '📦 Materials' },
            { id: 'inventory', label: '📋 Inventory' },
            { id: 'sites', label: '🏗️ Sites' },
            { id: 'vendors', label: '🏭 Vendors' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navBtn,
                background: activeTab === item.id ? '#f59e0b' : 'transparent',
                color: activeTab === item.id ? '#000' : '#9ca3af',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{materials.length}</div>
                <div style={styles.statLabel}>Total Materials</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{sites.length}</div>
                <div style={styles.statLabel}>Active Sites</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{vendors.length}</div>
                <div style={styles.statLabel}>Vendors</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{transactions.length}</div>
                <div style={styles.statLabel}>Transactions</div>
              </div>
            </div>

            <h2 style={styles.sectionTitle}>Recent Transactions</h2>
            <div style={styles.table}>
              <table style={styles.tableEl}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Material</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Site</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map(tx => (
                    <tr key={tx.id} style={styles.tableRow}>
                      <td style={styles.td}>{tx.material_name}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: tx.transaction_type === 'inward' ? '#d1fae5' :
                            tx.transaction_type === 'outward' ? '#dbeafe' :
                            tx.transaction_type === 'damaged' ? '#fee2e2' : '#fef3c7',
                          color: tx.transaction_type === 'inward' ? '#065f46' :
                            tx.transaction_type === 'outward' ? '#1e40af' :
                            tx.transaction_type === 'damaged' ? '#991b1b' : '#92400e',
                        }}>
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td style={styles.td}>{tx.quantity} {tx.material_unit}</td>
                      <td style={styles.td}>{tx.site_name}</td>
                      <td style={styles.td}>{tx.transaction_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MATERIALS */}
        {activeTab === 'materials' && (
          <div>
            <h1 style={styles.pageTitle}>Materials</h1>
            <div style={styles.table}>
              <table style={styles.tableEl}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>SKU</th>
                    <th style={styles.th}>Unit</th>
                    <th style={styles.th}>Min Stock</th>
                    <th style={styles.th}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map(m => (
                    <tr key={m.id} style={styles.tableRow}>
                      <td style={styles.td}>{m.name}</td>
                      <td style={styles.td}>{m.category_name}</td>
                      <td style={styles.td}>{m.sku}</td>
                      <td style={styles.td}>{m.unit}</td>
                      <td style={styles.td}>{m.min_stock}</td>
                      <td style={styles.td}>₹{m.unit_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY */}
        {activeTab === 'inventory' && (
          <div>
            <h1 style={styles.pageTitle}>Inventory Log</h1>
            <div style={styles.table}>
              <table style={styles.tableEl}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Material</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Site</th>
                    <th style={styles.th}>Vendor</th>
                    <th style={styles.th}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id} style={styles.tableRow}>
                      <td style={styles.td}>{tx.material_name}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: tx.transaction_type === 'inward' ? '#d1fae5' :
                            tx.transaction_type === 'outward' ? '#dbeafe' :
                            tx.transaction_type === 'damaged' ? '#fee2e2' : '#fef3c7',
                          color: tx.transaction_type === 'inward' ? '#065f46' :
                            tx.transaction_type === 'outward' ? '#1e40af' :
                            tx.transaction_type === 'damaged' ? '#991b1b' : '#92400e',
                        }}>
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td style={styles.td}>{tx.quantity} {tx.material_unit}</td>
                      <td style={styles.td}>{tx.site_name}</td>
                      <td style={styles.td}>{tx.vendor_name || '-'}</td>
                      <td style={styles.td}>{tx.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SITES */}
        {activeTab === 'sites' && (
          <div>
            <h1 style={styles.pageTitle}>Sites & Warehouses</h1>
            <div style={styles.cardGrid}>
              {sites.map(site => (
                <div key={site.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{site.name}</h3>
                  <p style={styles.cardText}>📍 {site.city}</p>
                  <p style={styles.cardText}>👤 {site.manager_name}</p>
                  <p style={styles.cardText}>📞 {site.phone}</p>
                  <span style={{
                    ...styles.badge,
                    background: site.site_type === 'warehouse' ? '#dbeafe' : '#d1fae5',
                    color: site.site_type === 'warehouse' ? '#1e40af' : '#065f46',
                  }}>
                    {site.site_type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VENDORS */}
        {activeTab === 'vendors' && (
          <div>
            <h1 style={styles.pageTitle}>Vendors & Suppliers</h1>
            <div style={styles.cardGrid}>
              {vendors.map(vendor => (
                <div key={vendor.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{vendor.name}</h3>
                  <p style={styles.cardText}>📍 {vendor.city}</p>
                  <p style={styles.cardText}>👤 {vendor.contact_person}</p>
                  <p style={styles.cardText}>📞 {vendor.phone}</p>
                  <p style={styles.cardText}>⭐ Rating: {vendor.rating}/5</p>
                  <p style={{
                    ...styles.cardText,
                    color: vendor.outstanding_amount > 0 ? '#ef4444' : '#10b981',
                    fontWeight: 'bold'
                  }}>
                    💰 Outstanding: ₹{vendor.outstanding_amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  app: { display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif', background: '#f3f4f6' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  sidebar: { width: 220, background: '#111827', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 8 },
  logo: { marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #374151' },
  logoText: { color: '#f9fafb', margin: 0, fontSize: 18 },
  logoSub: { color: '#6b7280', margin: '4px 0 0', fontSize: 11 },
  navBtn: { width: '100%', padding: '10px 14px', border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 500, marginBottom: 4 },
  main: { flex: 1, padding: 24, overflowY: 'auto' },
  pageTitle: { fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: '#111827', margin: '24px 0 12px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' },
  statNumber: { fontSize: 32, fontWeight: 800, color: '#f59e0b' },
  statLabel: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  table: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  tableEl: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#f9fafb' },
  tableRow: { borderTop: '1px solid #f3f4f6' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280' },
  td: { padding: '12px 16px', fontSize: 13, color: '#374151' },
  badge: { padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardTitle: { margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#111827' },
  cardText: { margin: '6px 0', fontSize: 13, color: '#6b7280' },
};

export default App;
