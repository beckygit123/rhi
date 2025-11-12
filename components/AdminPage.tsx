import React, { useState } from 'react';

interface AdminPageProps {
  onLogout: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchBookings();
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

  const deleteBooking = async (id: number) => {
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

  return (
    <main className="bg-[#F5EEDC] min-h-screen text-[#4A2C21] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#B48A4D]">RHI Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="bg-[#B45339] text-white px-6 py-2 rounded-lg hover:bg-opacity-80"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Bookings ({bookings.length})</h2>

          {loading ? (
            <p>Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#B48A4D]">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-[#F5EEDC]">
                      <td className="py-3 px-4">{booking.name}</td>
                      <td className="py-3 px-4">{booking.email}</td>
                      <td className="py-3 px-4">{booking.phone}</td>
                      <td className="py-3 px-4">{booking.service}</td>
                      <td className="py-3 px-4">{booking.date}</td>
                      <td className="py-3 px-4">{booking.time}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-800 font-bold"
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
