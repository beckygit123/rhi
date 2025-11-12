
import React, { useState } from 'react';

interface CalendarProps {
    onDateChange: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newSelectedDate);
        onDateChange(newSelectedDate);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        
        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        const today = new Date();
        const isSameDay = (d1: Date, d2: Date) => 
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();

        return [...blanks, ...days].map((day, index) => {
            if (day === null) {
                return <div key={`blank-${index}`} className="w-8 h-8"></div>;
            }
            const date = new Date(year, month, day);
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

            let classes = "w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ";
            if (isPast) {
                classes += "text-gray-400 cursor-not-allowed";
            } else if (isSelected) {
                classes += "bg-[#4A2C21] text-white";
            } else if (isToday) {
                classes += "bg-[#F5EEDC] text-[#4A2C21] ring-1 ring-[#4A2C21]";
            } else {
                classes += "text-white hover:bg-white hover:bg-opacity-20";
            }

            return (
                <div key={day} className={classes} onClick={() => !isPast && handleDateClick(day)}>
                    {day}
                </div>
            );
        });
    };

    return (
        <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-white hover:bg-opacity-20">&lt;</button>
                <div className="font-bold text-lg">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-white hover:bg-opacity-20">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center mt-2">
                {renderCalendar()}
            </div>
        </div>
    );
};
