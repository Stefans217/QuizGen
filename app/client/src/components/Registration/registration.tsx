import React, { useState } from "react";
import "./registration.css";
import { login } from "../../services/login/loginService";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const backendUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://quizgen-production.up.railway.app';

interface Props {
  closeRegistrationModal: () => void;
}

const RegistrationForm: React.FC<Props> = ({ closeRegistrationModal }) => {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      const response = await fetch(`${backendUrl}/api/registration/userupload`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({email, username, password}),
      });
      
      if (response.ok) {
        console.log("User registration data submitted successfully");

        await login(email, password);
        window.location.href = "/";
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
    <Dialog open onOpenChange={(open) => !open && closeRegistrationModal()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center mb-4">Join with QuizGen</DialogTitle>
        </DialogHeader>
        {errorMessage && <p className="text-red-500 text-xs mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="mb-4">
            <Input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <div className="mb-6">
            <Input
              id="confirm-password"
              type="password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
            />
          </div>
          <div className="flex items-center justify-center">
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationForm;
