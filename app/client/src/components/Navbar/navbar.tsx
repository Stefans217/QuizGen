// Components/NavBar.js
import React from 'react';
import { Link } from "react-router-dom";


interface NavbarProps {
    onRegisterClick: () => void;
}

interface ModalProps {
    openRegistrationModal: () => void;
    openLoginModal: () => void;
}

const Navbar: React.FC<ModalProps> = ({openRegistrationModal, openLoginModal}) => {
    return (
        <nav className="fixed top-0 w-full flex justify-around p-4 bg-gray-800 z-10 h-12">
            <div className="flex justify-between items-center">

                <div className='text-sky-500 flex space-x-4'>
                    <Link to="/" className="link">Home</Link>
                    <Link to="/upload" className="link">Upload</Link>
                    <Link to="/display" className="link">Display</Link>
                    
                </div>
                <div className='text-flex space-x-4 ml-4'>
                    <button onClick={openLoginModal} className='bg-cyan-800 hover:bg-blue-600 text-white px-2 py-1 rounded-sm focus:outline-none'>Login</button>
                    <button onClick={openRegistrationModal} className='bg-cyan-600 hover:bg-blue-600 text-white px-2 py-1 rounded-sm focus:outline-none'>Register</button>
                </div>
                

            </div>
        </nav>
    );
};



export default Navbar