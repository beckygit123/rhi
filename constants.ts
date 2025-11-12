import { Service } from './types';

export const SERVICES: Service[] = [
    {
        id: 1,
        name: 'Standard Clean',
        description: 'A thorough cleaning of all rooms, including dusting, vacuuming, and mopping.',
        price: 150,
        duration: 'Approx. 2-3 hours'
    },
    {
        id: 2,
        name: 'Deep Clean',
        description: 'Includes everything in the standard clean, plus baseboards, light fixtures, and inside cabinets.',
        price: 250,
        duration: 'Approx. 4-5 hours'
    },
    {
        id: 3,
        name: 'Move-in / Move-out Clean',
        description: 'A comprehensive clean to prepare a home for a new resident. Includes inside of oven and fridge.',
        price: 350,
        duration: 'Approx. 5-6 hours'
    },
    {
        id: 4,
        name: 'Kitchen & Bath Focus',
        description: 'A detailed cleaning focusing on the most used areas of your home.',
        price: 120,
        duration: 'Approx. 1.5-2 hours'
    },
];

export const TIME_SLOTS: string[] = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
];

// Helper to get date string in YYYY-MM-DD format
const getFutureDateString = (daysToAdd: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
};

// MOCKED DATA: Represents appointments that are already booked.
export const MOCKED_BOOKINGS: { [key: string]: string[] } = {
    [getFutureDateString(1)]: ['9:00 AM', '1:00 PM'], // Tomorrow
    [getFutureDateString(2)]: ['11:00 AM'], // Day after tomorrow
    [getFutureDateString(5)]: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'], // A fully booked day
};
