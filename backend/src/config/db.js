const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../buildtrack.db'), {
  verbose: console.log
});

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    site_type TEXT DEFAULT 'site',
    manager_name TEXT,
    phone TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER,
    sku TEXT UNIQUE NOT NULL,
    unit TEXT NOT NULL,
    min_stock INTEGER DEFAULT 0,
    unit_price REAL DEFAULT 0,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    site_id INTEGER,
    phone TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER,
    material_id INTEGER,
    quantity REAL DEFAULT 0,
    damaged_qty REAL DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    city TEXT,
    rating INTEGER DEFAULT 3,
    outstanding_amount REAL DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_type TEXT NOT NULL,
    material_id INTEGER,
    site_id INTEGER,
    vendor_id INTEGER,
    quantity REAL NOT NULL,
    unit_price REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    transaction_date DATE DEFAULT CURRENT_DATE,
    note TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id INTEGER,
    from_site_id INTEGER,
    to_site_id INTEGER,
    quantity REAL NOT NULL,
    transfer_date DATE DEFAULT CURRENT_DATE,
    note TEXT,
    status TEXT DEFAULT 'completed',
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Connected to SQLite database successfully!');

module.exports = db;