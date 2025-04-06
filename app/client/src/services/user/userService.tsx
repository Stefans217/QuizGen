import axios from "axios";

const backendUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : 'https://quizgen-production.up.railway.app';

export async function fetchUserData(token: string) {
    try{
        const response = await axios.get(`${backendUrl}/api/user/data`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('response', response.data);
        return response.data;
    }catch(error: any){
        throw new Error(`Failed to fetch user data. ${error.message}`);
    }
}