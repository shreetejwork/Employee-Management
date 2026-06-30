import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  try {
    console.log('Initializing database schema...');
    
    // Read db_init.sql
    const sqlPath = path.join(__dirname, '..', 'db_init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL queries by semicolon, ignoring comments and empty lines
    const queries = sqlContent
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--'));

    // Execute queries sequentially
    for (const query of queries) {
      await pool.query(query);
    }
    console.log('Database tables verified/created successfully.');

    // Seed default admin user if none exists
    const [users] = await pool.query('SELECT * FROM users LIMIT 1');
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'admin', 'Administrator']
      );
      console.log('Default admin user seeded successfully (admin/admin123).');
    }

    // Seed default company information if none exists
    const [company] = await pool.query('SELECT * FROM company_information LIMIT 1');
    if (company.length === 0) {
      await pool.query(
        `INSERT INTO company_information (name, shortName, tagline, website, email, phones, registeredOffice, manufacturingUnit)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'WinRender Systems LLP.',
          'WinRender',
          'MFG. OF INTERNATIONAL QUALITY METAL DETECTORS FOR PHARMA / API / FOOD & FMCG INDUSTRIES',
          'www.winrendersystems.com',
          'sales@winrendersystems.com',
          '+91 98220 17652, +91 97630 30625',
          'Regd. Office: 6, SHILPTULA, S. No 157/28, D.P. ROAD, AUNDH, PUNE (MH) - 411 007 (INDIA)',
          'Mfg. Unit: 201, MAHINDRAKAR COMPLEX, ABOVE SBI, S. No. 42/1, WARJE-MALWADI, NDA ROAD, PUNE (MH) - 411 058 (INDIA)'
        ]
      );
      console.log('Default company information seeded successfully.');
    }
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    throw error;
  }
};
