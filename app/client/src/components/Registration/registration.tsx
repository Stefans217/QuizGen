import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import "./registration.css";
import { login } from "../../services/login/loginService";

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

  //const [error_passwordMismatch, setError_passwordMismatch] = useState('');
  //const [error_emailExists, setError_emailExists] = useState('');
  //const [error_invalidPasswordFormat, setError_invalidPasswordFormat] = useState('');
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);

  //1 uppercase, 1 number, 8 characters
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]?)[a-zA-Z\d!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]{8,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setErrorMessage('Passwords must match');
        return;
    }

    if(!passwordRegex.test(password)){
      setErrorMessage(
        <div className="text-red-600 text-sm">
          <p>Your password must contain:</p>
          <ul className="list-disc pl-5">
            <li>Minimum 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
          </ul>
        </div>
      );
      return;
    }

    setErrorMessage('');

    console.log(JSON.stringify({email, username, password}));

    try {
      const response = await fetch("http://localhost:3001/api/registration/userupload", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({email, username, password}),
      });
      
      if (response.ok) {
        console.log("User registration data submitted successfully");

        await login(email, password);
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
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

        <p className="text-xl font-semibold mb-10 text-center">Join with QuizGen</p>

        {errorMessage && <p className="text-red-500 text-xs mb-4">{errorMessage}</p>}
        
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
