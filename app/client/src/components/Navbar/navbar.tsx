// Components/NavBar.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
    onRegisterClick: () => void;
}

interface ModalProps {
    openRegistrationModal: () => void;
    openLoginModal: () => void;
}

const Navbar: React.FC<ModalProps> = ({ openRegistrationModal, openLoginModal }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    //const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            console.log("User is logged in");
            setIsLoggedIn(true);
        } else {
            console.log("User is NOT logged in");
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        //navigate("/");
        setIsLoggedIn(false);
    };

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" /> */}
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">QuizGen</span>
                </Link>

                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link
                                to="/"
                                className={`block py-2 px-3 rounded-sm md:p-0 ${
                                    location.pathname === "/interface" ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                }`}
                                aria-current={location.pathname === "/interface" ? "page" : undefined}
                            >
                                Interface
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/content"
                                className={`block py-2 px-3 rounded-sm md:p-0 ${
                                    location.pathname === "/content" ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500" : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                                }`}
                                aria-current={location.pathname === "/content" ? "page" : undefined}
                            >
                                Content
                            </Link>
                        </li>
                        {!isLoggedIn ? (
                            <>
                                <li>
                                    <button onClick={openLoginModal} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        Login
                                    </button>
                                </li>
                                <li>
                                    <button onClick={openRegistrationModal} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        Register
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <button onClick={handleLogout} className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
