"use client";

import React from 'react';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold mb-4">Welcome</h1>
            <p className="text-lg mb-6">Please log in to continue</p>
        </div>
    );
};

export default LandingPage;