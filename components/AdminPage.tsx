import React, { useState } from 'react';

interface AdminPageProps {
  onLogout: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  React.useEffect(() => {
    fetchBookings();
    // Refresh every 10 seconds
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin-bookings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status })
      });
      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const deleteBooking = async (id: number) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch('/api/admin-bookings', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      fetchBookings();
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <main className="bg-[#F5EEDC] min-h-screen text-[#4A2C21] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#B48A4D]">RHI Admin</h1>
            {pendingCount > 0 && (
              <p className="text-red-600 font-bold mt-2">
                {pendingCount} pending appointment{pendingCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={onLogout}
            className="bg-[#B45339] text-white px-6 py-2 rounded-lg hover:bg-opacity-80"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex gap-4 mb-6">
            {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  filter === f
                    ? 'bg-[#B45339] text-white'
                    : 'bg-gray-200 text-[#4A2C21] hover:bg-gray-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'pending' && ` (${pendingCount})`}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : filteredBookings.length === 0 ? (
            <p className="text-gray-500">No {filter === 'all' ? 'bookings' : filter + ' bookings'}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#B48A4D]">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-[#F5EEDC]">
                      <td className="py-3 px-4">{booking.name}</td>
                      <td className="py-3 px-4 text-sm">{booking.email}</td>
                      <td className="py-3 px-4">{booking.service}</td>
                      <td className="py-3 px-4">{booking.date}</td>
                      <td className="py-3 px-4">{booking.time}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                          booking.status === 'approved' ? 'bg-green-200 text-green-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'approved')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'rejected')}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
