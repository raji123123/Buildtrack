const db = require('./src/config/db');

// Add Categories
const addCategories = db.prepare(`INSERT OR IGNORE INTO categories (name) VALUES (?)`);
const categories = [
  'Cement & Concrete', 'Steel & Metal', 'Bricks & Blocks',
  'Sand & Aggregates', 'Plumbing', 'Electrical',
  'Wood & Timber', 'Paint & Chemicals', 'Safety Equipment'
];
categories.forEach(c => addCategories.run(c));
console.log('Categories added!');

// Add Sites
const addSite = db.prepare(`INSERT OR IGNORE INTO sites (name, city, site_type, manager_name, phone) VALUES (?,?,?,?,?)`);
addSite.run('Sector 12 Residential', 'Hyderabad', 'site', 'Ravi Kumar', '9876543210');
addSite.run('IT Park Block B', 'Pune', 'site', 'Meena Iyer', '8765432109');
addSite.run('Highway Bridge NH-65', 'Vijayawada', 'site', 'Suresh Rao', '7654321098');
addSite.run('Central Warehouse', 'Hyderabad', 'warehouse', 'Admin', '9988776655');
console.log('Sites added!');

// Add Materials
const addMaterial = db.prepare(`INSERT OR IGNORE INTO materials (name, category_id, sku, unit, min_stock, unit_price) VALUES (?,?,?,?,?,?)`);
addMaterial.run('OPC Cement 53 Grade', 1, 'CEM-001', 'Bags', 500, 380);
addMaterial.run('TMT Steel Bars 12mm', 2, 'STL-012', 'Tons', 20, 62000);
addMaterial.run('Red Clay Bricks', 3, 'BRK-001', 'Pieces', 5000, 8);
addMaterial.run('River Sand Fine', 4, 'SND-001', 'Tons', 50, 1800);
addMaterial.run('PVC Pipes 4 inch', 5, 'PLB-004', 'Pieces', 100, 420);
addMaterial.run('Electrical Wire 2.5mm', 6, 'ELC-025', 'Meters', 2000, 45);
addMaterial.run('Teak Wood Planks', 7, 'WD-001', 'Sheets', 50, 2800);
addMaterial.run('Asian Paints Exterior', 8, 'PNT-001', 'Liters', 200, 380);
addMaterial.run('Safety Helmets', 9, 'SFT-001', 'Pieces', 30, 350);
addMaterial.run('M-Sand Manufactured', 4, 'SND-002', 'Tons', 30, 2200);
console.log('Materials added!');

// Add Users
const addUser = db.prepare(`INSERT OR IGNORE INTO users (full_name, email, password_hash, role, phone) VALUES (?,?,?,?,?)`);
addUser.run('Rajasuhasini', 'raja@buildco.in', 'admin123', 'super_admin', '9999999999');
addUser.run('Ravi Kumar', 'ravi@buildco.in', 'admin123', 'site_manager', '9876543210');
addUser.run('Meena Iyer', 'meena@buildco.in', 'admin123', 'store_manager', '8765432109');
addUser.run('Suresh Rao', 'suresh@buildco.in', 'admin123', 'site_manager', '7654321098');
addUser.run('Priya Sharma', 'priya@buildco.in', 'admin123', 'accountant', '6543210987');
console.log('Users added!');

// Add Vendors
const addVendor = db.prepare(`INSERT OR IGNORE INTO vendors (name, category_id, contact_person, phone, city, rating, outstanding_amount) VALUES (?,?,?,?,?,?,?)`);
addVendor.run('Ramco Cements Ltd', 1, 'Rajesh M', '9811223344', 'Chennai', 5, 145000);
addVendor.run('SAIL Steel Suppliers', 2, 'Vikram S', '8722334455', 'Mumbai', 4, 0);
addVendor.run('Hyderabad Brick Works', 3, 'Srinivas R', '7633445566', 'Hyderabad', 4, 28000);
addVendor.run('Krishna River Sands', 4, 'Prasad K', '6544556677', 'Vijayawada', 3, 56000);
console.log('Vendors added!');

console.log('All sample data added successfully!');