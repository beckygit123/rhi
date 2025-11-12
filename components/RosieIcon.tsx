
import React from 'react';

export const RosieIcon: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="armGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#D9A370" />
                <stop offset="100%" stopColor="#B48A4D" />
            </linearGradient>
        </defs>
        <g transform="translate(5, 10)">
            <path 
                d="M 85,60 C 80,40 70,30 55,25 C 40,20 30,30 25,45 L 20,75 L 30,80 L 35,55 C 40,40 45,35 55,40 C 65,45 70,55 70,65 L 75,85 L 85,80 Z"
                fill="url(#armGradient)"
                stroke="#4A2C21"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            <path 
                d="M 55,25 C 58,15 65,5 75,5 C 85,5 90,15 88,25 C 86,35 80,40 75,38 C 70,36 60,30 55,25 Z"
                fill="url(#armGradient)"
                stroke="#4A2C21"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            <path
                d="M 25, 45 C 20, 35, 10, 25, 5, 30"
                fill="none"
                stroke="#4A2C21"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </g>
    </svg>
);
