import React, { useState, useCallback, useMemo } from 'react';
import { Service } from './types';
import { SERVICES, TIME_SLOTS, MOCKED_BOOKINGS } from './constants';
import { Calendar } from './components/Calendar';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import appRhi from './images/appRhi.jpg';

type BookingStep = 'service' | 'datetime' | 'details' | 'confirmation';
type AppView = 'booking' | 'admin-login' | 'admin-dashboard';

const App: React.FC = () => {
    const [view, setView] = useState<AppView>('booking');
    const [adminToken, setAdminToken] = useState<string | null>(
      typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
    );
    const [step, setStep] = useState<BookingStep>('service');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '', address: '', notes: '' });

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setStep('datetime');
    };
    
    const handleDateTimeSelect = (date: Date, time: string) => {
        setSelectedDate(date);
        setSelectedTime(time);
        setStep('details');
    };

    const handleDetailsSubmit = (details: { name: string; phone: string; address: string; notes: string }) => {
        setCustomerDetails(details);
        setStep('confirmation');
    };

    const handleRestart = () => {
        setStep('service');
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setCustomerDetails({ name: '', email: '', phone: '', address: '', notes: '' });
    };

    const handleAdminLogin = (token: string) => {
        setAdminToken(token);
        setView('admin-dashboard');
    };

    const handleAdminLogout = () => {
        setAdminToken(null);
        localStorage.removeItem('adminToken');
        setView('booking');
    };
    
    const renderStep = () => {
        switch (step) {
            case 'service':
                return <ServiceSelectionStep onServiceSelect={handleServiceSelect} />;
            case 'datetime':
                return <DateTimeStep service={selectedService!} onDateTimeSelect={handleDateTimeSelect} />;
            case 'details':
                return <DetailsStep 
                    onDetailsSubmit={handleDetailsSubmit} 
                    service={selectedService!}
                    date={selectedDate!}
                    time={selectedTime!}
                />;
            case 'confirmation':
                return <ConfirmationStep 
                    service={selectedService!} 
                    date={selectedDate!} 
                    time={selectedTime!} 
                    details={customerDetails}
                    onRestart={handleRestart}
                />;
            default:
                return null;
        }
    };

    return (
        <>
            {view === 'admin-dashboard' ? (
                <AdminPage onLogout={handleAdminLogout} />
            ) : view === 'admin-login' ? (
                <LoginPage onLoginSuccess={handleAdminLogin} />
            ) : (
                <main className="bg-[#F5EEDC] min-h-screen text-[#4A2C21] flex items-center justify-center p-4">
                    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-lg overflow-hidden">
                        <div className="bg-[#F5EEDC] p-8 md:p-12 flex flex-col items-center justify-center">
                            <div className="w-full h-full flex items-center justify-center">
                               <img src={appRhi} alt="RHI Cleaning" className="w-full h-full object-cover rounded-lg" />
                            </div>
                        </div>
                        <div className="bg-[#B45339] p-8 md:p-12 text-[#F5EEDC] flex flex-col relative">
                            <button
                                onClick={() => setView('admin-login')}
                                className="absolute top-4 right-4 text-xs text-white opacity-50 hover:opacity-100"
                            >
                                Admin Login
                            </button>
                            {renderStep()}
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};


// Step Components (defined outside App to avoid re-creation on re-renders)

interface ServiceSelectionStepProps {
    onServiceSelect: (service: Service) => void;
}
const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({ onServiceSelect }) => (
    <div className="flex flex-col h-full">
        <h3 className="text-3xl font-bold mb-6 text-center">Choose Your Service</h3>
        <div className="space-y-4 overflow-y-auto flex-grow">
            {SERVICES.map(service => (
                <button 
                    key={service.id} 
                    onClick={() => onServiceSelect(service)}
                    className="w-full text-left p-4 bg-[#F5EEDC] text-[#4A2C21] rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1"
                >
                    <h4 className="font-bold text-lg">{service.name}</h4>
                    <p className="text-sm">{service.description}</p>
                    <p className="text-sm font-bold mt-2">{service.duration} - ${service.price}</p>
                </button>
            ))}
        </div>
    </div>
);


interface DateTimeStepProps {
    service: Service;
    onDateTimeSelect: (date: Date, time: string) => void;
}
const DateTimeStep: React.FC<DateTimeStepProps> = ({ service, onDateTimeSelect }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [currentTimeSlot, setCurrentTimeSlot] = useState<string | null>(null);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setCurrentTimeSlot(null);
    };

    const handleTimeSelect = (time: string) => {
        setCurrentTimeSlot(time);
    };

    const isSlotBooked = useCallback((time: string): boolean => {
        const dateKey = selectedDate.toISOString().split('T')[0];
        const bookedSlots = MOCKED_BOOKINGS[dateKey] || [];
        return bookedSlots.includes(time);
    }, [selectedDate]);
    
    return (
        <div className="flex flex-col h-full">
            <h3 className="text-3xl font-bold mb-2 text-center">Select Date & Time</h3>
            <p className="text-center mb-4 opacity-80">For: {service.name}</p>
            <Calendar onDateChange={handleDateChange} />
            <div className="my-4">
                <h4 className="font-bold text-lg mb-2 text-center">Available Slots</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIME_SLOTS.map(time => {
                        const isBooked = isSlotBooked(time);
                        return (
                            <button 
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                disabled={isBooked}
                                className={`p-2 rounded-lg text-center transition-all duration-200 ${
                                    isBooked 
                                        ? 'bg-white bg-opacity-10 text-gray-400 cursor-not-allowed line-through' 
                                        : currentTimeSlot === time 
                                            ? 'bg-[#4A2C21] text-white' 
                                            : 'bg-[#F5EEDC] text-[#4A2C21] hover:bg-opacity-80'
                                }`}
                            >
                                {time}
                            </button>
                        )
                    })}
                </div>
            </div>
            <button 
                onClick={() => onDateTimeSelect(selectedDate, currentTimeSlot!)}
                disabled={!currentTimeSlot}
                className="w-full mt-auto bg-[#F5EEDC] text-[#B45339] font-bold py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Continue
            </button>
        </div>
    );
};

interface DetailsStepProps {
    onDetailsSubmit: (details: { name: string; phone: string; address: string; notes: string }) => void;
    service: Service;
    date: Date;
    time: string;
}
const DetailsStep: React.FC<DetailsStepProps> = ({ onDetailsSubmit, service, date, time }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email && phone && address) {
            setIsSubmitting(true);
            try {
                // Save to Vercel API
                await fetch('/api/admin-bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        service: service.name,
                        date: date.toISOString().split('T')[0],
                        time,
                        name,
                        email,
                        phone,
                        address,
                        notes
                    })
                });
                onDetailsSubmit({ name, email, phone, address, notes });
            } catch (error) {
                console.error('Failed to save booking:', error);
                onDetailsSubmit({ name, email, phone, address, notes });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <h3 className="text-3xl font-bold mb-2 text-center">Your Details</h3>
            <p className="text-center mb-4 opacity-80">Confirm your selection and enter your details.</p>

            <div className="bg-[#F5EEDC] text-[#4A2C21] p-3 rounded-lg mb-6 w-full text-left text-sm shadow-inner">
                <p><strong>Service:</strong> {service.name}</p>
                <p><strong>Date:</strong> {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> {time}</p>
            </div>

            <div className="space-y-4 flex-grow">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold mb-1">Full Name</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 rounded-md bg-[#F5EEDC] text-[#4A2C21] focus:outline-none focus:ring-2 focus:ring-[#4A2C21]"/>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-bold mb-1">Email</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 rounded-md bg-[#F5EEDC] text-[#4A2C21] focus:outline-none focus:ring-2 focus:ring-[#4A2C21]"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-bold mb-1">Phone Number</label>
                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full p-2 rounded-md bg-[#F5EEDC] text-[#4A2C21] focus:outline-none focus:ring-2 focus:ring-[#4A2C21]"/>
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-bold mb-1">Service Address</label>
                    <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} required rows={3} className="w-full p-2 rounded-md bg-[#F5EEDC] text-[#4A2C21] focus:outline-none focus:ring-2 focus:ring-[#4A2C21]"></textarea>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-bold mb-1">Notes (optional)</label>
                    <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full p-2 rounded-md bg-[#F5EEDC] text-[#4A2C21] focus:outline-none focus:ring-2 focus:ring-[#4A2C21]"></textarea>
                </div>
            </div>
            <button type="submit" className="w-full mt-auto bg-[#F5EEDC] text-[#B45339] font-bold py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all">
                Book Appointment
            </button>
        </form>
    );
};

interface ConfirmationStepProps {
    service: Service;
    date: Date;
    time: string;
    details: { name: string; phone: string; address: string; notes: string };
    onRestart: () => void;
}
const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ service, date, time, details, onRestart }) => (
    <div className="flex flex-col h-full items-center justify-center text-center">
        <div className="bg-[#B48A4D] rounded-full p-3 mb-4 inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#F5EEDC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h3 className="text-3xl font-bold mb-4">Appointment Booked!</h3>
        <p className="text-lg">Thank you, {details.name}.</p>
        <div className="bg-[#F5EEDC] text-[#4A2C21] p-4 rounded-lg my-6 w-full text-left">
            <p><strong>Service:</strong> {service.name}</p>
            <p><strong>Date:</strong> {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> {time}</p>
            <p><strong>Email:</strong> {details.email}</p>
            <p><strong>Address:</strong> {details.address}</p>
            {details.notes && <p><strong>Notes:</strong> {details.notes}</p>}
        </div>
        <p className="opacity-80">We've received your booking request! Once our team reviews and approves your appointment, we'll send a confirmation email to {details.email}.</p>
        <button 
            onClick={onRestart}
            className="w-full mt-8 bg-[#F5EEDC] text-[#B45339] font-bold py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all"
        >
            Book Another Service
        </button>
    </div>
);

export default App;