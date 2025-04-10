import React, { useState} from 'react';
import { login } from '../../services/login/loginService';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    closeLoginModal: () => void;
}

const LoginForm: React.FC<Props> = ({closeLoginModal}) => {

    const [error, setError] = useState("");
    //const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill in both email and password.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        //setLoading(true);
        setError("");

        try {
            await login(email, password);
            window.location.href = "/";
        } catch (error) {
            setError("Invalid credentials, please try again.");
        } finally {
            //setLoading(false);
        }
    }

    return (
        <Dialog open onOpenChange={(open) => {
            if (!open) closeLoginModal();
        }}>
            <DialogContent className="bg-white p-8 rounded-lg shadow-lg max-w-md w-[25rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Login
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="mb-6">
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            onChange={handlePasswordChange}
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 mb-4 text-sm text-center">
                            {error}
                        </p>
                    )}
                    <div className="flex items-center justify-between">
                        <Button
                            className="w-full"
                            type="submit"
                        >
                            Login
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default LoginForm