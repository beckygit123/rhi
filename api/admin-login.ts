import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory admin store (in production, use a real database)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rhicleaning.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'RHI2025';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      res.status(200).json({
        success: true,
        token: 'admin-token-' + Date.now(),
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  }
}
