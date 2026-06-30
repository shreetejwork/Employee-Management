import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.js';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforhrpayrollapp';

export const authController = {
  async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    try {
      const user = await UserModel.getByUsername(username);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
        expiresIn: '24h',
      });

      return res.status(200).json({
        success: true,
        token,
        user: { id: user.id, username: user.username, role: user.role, name: user.name }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Old and new passwords are required' });
    }

    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
      const user = rows[0];
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(userId, hashedNewPassword);

      return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};
