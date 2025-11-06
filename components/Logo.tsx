import React from 'react';

const Logo: React.FC = () => (
    <div className="flex items-center space-x-2">
        <svg
            width="36"
            height="36"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-teal-600"
        >
            <rect width="40" height="40" rx="8" fill="currentColor" />
            <path
                d="M20 12V28"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 20H28"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
        <span className="font-bold text-xl text-gray-800 dark:text-gray-100">Pharma Garde</span>
    </div>
);

export default Logo;