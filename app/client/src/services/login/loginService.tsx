import axios from "axios";

const backendUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://quizgen-production.up.railway.app';

export const login = async (email: string, password: string) => {
    try {
        const res = await axios.post(`${backendUrl}/api/login/login`, 
            { email, password }
        );
        localStorage.setItem("token", res.data.token);
        
        return res.data;
    } catch (error) {
        console.log("Login failed:", error);
        throw error;
    }
};
