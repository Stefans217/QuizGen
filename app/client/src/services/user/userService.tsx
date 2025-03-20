import axios from "axios";

export async function fetchUserData(token: string) {
    try{
        const response = await axios.get("http://localhost:3001/api/user/data", {
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