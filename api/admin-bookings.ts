import { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory bookings storage
let bookings: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Verify admin token
  const token = req.headers.authorization?.replace('Bearer ', '');
  const isAdmin = token && token.startsWith('admin-token-');

  if (req.method === 'POST') {
    // Client booking - create with pending status
    const { service, date, time, name, email, phone, address, notes } = req.body;

    const booking = {
      id: Date.now(),
      service,
      date,
      time,
      name,
      email,
      phone,
      address,
      notes,
      status: 'pending', // pending, approved, rejected
      bookedAt: new Date().toISOString(),
    };

    bookings.push(booking);

    res.status(200).json({
      success: true,
      message: 'Booking submitted! Waiting for approval.',
      booking
    });
  } else if (req.method === 'GET') {
    // Admin view all bookings
    if (!isAdmin) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    res.status(200).json(bookings);
  } else if (req.method === 'PUT') {
    // Admin approve/reject booking
    if (!isAdmin) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id, status } = req.body;
    const booking = bookings.find(b => b.id === id);

    if (booking) {
      booking.status = status; // 'approved' or 'rejected'
      booking.updatedAt = new Date().toISOString();
      
      // TODO: Send email to client here when approved
      
      res.status(200).json({ success: true, message: `Booking ${status}`, booking });
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } else if (req.method === 'DELETE') {
    // Admin delete booking
    if (!isAdmin) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.body;
    bookings = bookings.filter(b => b.id !== id);

    res.status(200).json({ success: true, message: 'Booking deleted' });
  }
}
