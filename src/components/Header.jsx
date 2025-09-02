
import React from 'react';

const Header = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                    Team Event Registrar
                </span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
                The smartest way to organize your team for the grand competition.
            </p>
        </header>
    );
};

export default Header;
