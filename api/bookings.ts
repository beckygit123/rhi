import { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage (for demo - use a real DB for production)
let bookings: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { service, date, time, name, phone, address, notes } = req.body;
    
    const booking = {
      id: Date.now(),
      service,
      date,
      time,
      name,
      phone,
      address,
      notes,
      bookedAt: new Date().toISOString(),
    };
    
    bookings.push(booking);
    
    res.status(200).json({ 
      success: true, 
      message: 'Booking confirmed!',
      booking 
    });
  } else if (req.method === 'GET') {
    res.status(200).json(bookings);
  }
}
