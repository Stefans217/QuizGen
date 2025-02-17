import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import registration from "./registration.css";

interface Props {
  closeRegistrationModal: () => void;
}

const RegistrationForm: React.FC<Props> = ({ closeRegistrationModal }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);


  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === modalRef.current) {
      closeRegistrationModal();
    }
  };

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error_passwordMismatch, setError_passwordMismatch] = useState('');
  const [error_emailExists, setError_emailExists] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setError_passwordMismatch('Passwords must match');
        return;
    }

    setError_passwordMismatch('');

    console.log(email, username, password);

    try {
      const response = await fetch("http://localhost:80/api/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({email, username, password}),
      });

      if (response.ok) {
        console.log("User registration data submitted successfully");
      } else {
        const data = await response.json();
        setError_emailExists(data.message);
        console.error("Error submitting user registration data");
      }

    } catch (error) {
        
      console.error("Error submitting user registration data", error);
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-brightness-50 flex justify-center items-center z-50"
    >
      <div className="text-xs bg-white p-8 rounded-lg shadow-lg max-w-64 w-full">
        <button onClick={closeRegistrationModal} className="text-xl">
          <X />
        </button>

        <p className="text-xl font-semibold mb-10 text-center">Join with CPD</p>
        <p className="text-center mb-4">Join with</p>
        <div className="mt-7 flex flex-col gap-2">
          <button className="inline-flex h-8 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-xs font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-[18px] w-[18px]"
            />
            Continue with Google
          </button>
        </div>
        <br />
        <a href="http://www.apple.com" className="text-cyan-500 underline">
          Apple
        </a>

        <div className="flex w-full items-center gap-2 py-6 text-xs text-slate-600">
          <div className="h-px w-full bg-slate-200"></div>
          OR
          <div className="h-px w-full bg-slate-200"></div>
        </div>
        {error_emailExists && <p className="text-red-500 text-xs mb-4">{error_emailExists}</p>}

        {error_passwordMismatch && <p className="text-red-500 text-xs mb-4">{error_passwordMismatch}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} required
              placeholder="Username"
            />
          </div>
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} required
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} required
              placeholder="Password"
            />
          </div>
          <div className="mb-6">
            <input
              className="appearance-none border rounded w-full mb-3 py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required
              placeholder="Confirm Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" 
            className="inline-flex w-full items-center justify-center bg-slate-800 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
