import axios from "axios";

export const login = async (email: string, password: string) => {
    try {
        console.log(email, password);
        const res = await axios.post("http://localhost:3001/api/login/login", { email, password });
        localStorage.setItem("token", res.data.token);
        console.log("Login successful");
        window.location.reload();
        //navigate('/dashboard');
    } catch (error) {
        console.log("Login failed:", error);
        //alert("Invalid credentials");
    }
};
