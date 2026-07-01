import pool from '../config/db.js';

export const CompanyModel = {
  async getInfo() {
    const [rows] = await pool.query('SELECT * FROM company_information LIMIT 1');
    return rows[0] || null;
  },

  async updateAddresses(registeredOffice, manufacturingUnit) {
    const [rows] = await pool.query('SELECT id FROM company_information LIMIT 1');
    if (rows.length === 0) {
      const [result] = await pool.query(
        `INSERT INTO company_information (name, shortName, registeredOffice, manufacturingUnit)
         VALUES (?, ?, ?, ?)`,
        ['WinRender Systems LLP.', 'WinRender', registeredOffice, manufacturingUnit]
      );
      return result.insertId;
    } else {
      const id = rows[0].id;
      const [result] = await pool.query(
        'UPDATE company_information SET registeredOffice = ?, manufacturingUnit = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [registeredOffice, manufacturingUnit, id]
      );
      return result.affectedRows > 0;
    }
  }
};
