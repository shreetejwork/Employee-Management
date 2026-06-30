import pool from '../config/db.js';

export const UserModel = {
  async getByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT id, username, role, name FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async updatePassword(id, hashedPassword) {
    const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return result.affectedRows > 0;
  }
};
