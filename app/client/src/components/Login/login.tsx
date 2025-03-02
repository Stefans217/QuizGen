import React, {useEffect, useRef, useState} from 'react';
import { X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { login } from '../../services/login/loginService';

interface Props {
    closeLoginModal: () => void;
}

const LoginForm: React.FC<Props> = ({closeLoginModal}) => {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    //const [showPassword, setShowPassword] = useState(false);

    //const navigate = useNavigate(); // Initialize navigate function
    const modalRef = useRef<HTMLDivElement | null>(null);
   
    const closeModal = (e: React.MouseEvent<HTMLElement>) => {
        if(modalRef.current === e.target){
            closeLoginModal();
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submit clicked");
        setLoading(true);
        setError("");

        try {
            await login(email, password);
          } catch (error) {
            console.log("Login failed:", error);
            //alert("Invalid credentials");
          }

    }


    return (
        <div ref={modalRef} onClick={closeModal} className='fixed inset-0 bg-black bg-opacity-30 backdrop-brightness-50 flex justify-center items-center z-50'>
            <div className='text-xs bg-white p-8 rounded-lg shadow-lg max-w-md w-50px'>
                <button onClick={closeLoginModal} className="text-xl">
                    <X />
                </button>
                <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <input
                            className='appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='email'
                            type='email'
                            placeholder='Email'
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className='mb-6'>

                        <input
                            className='appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='password'
                            type='password'
                            placeholder='Password'
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <button
                            className='bg-slate-800 hover:bg-slate-500 text-white font-bold w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                            type='submit'
                        >
                            Login
                        </button>
                    </div>
                    
                </form>
                
            </div>
        </div>
    )
}

export default LoginForm