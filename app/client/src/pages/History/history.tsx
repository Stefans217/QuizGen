import React from 'react';
import { useEffect, useState } from 'react';
import { fetchUserData } from '@/services/user/userService';
import { fetchQuizHistory } from '@/services/quiz/fetchQuizHistory';

const History: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [quizHistory, setQuizHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchUserData(localStorage.getItem("token") || "")
            .then((userData) => {
                setUserId(userData.userId);
            })
            .catch((err) => console.error("Failed to fetch user data:", err));

        fetchQuizHistory(userId || 0)
            .then((history) => {
                setQuizHistory(history);
            })
            .catch((err) => console.error("Failed to fetch quiz history:", err));
    }, []);



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">History</h1>
        <p className="text-lg mb-6">View your quiz history here</p>
    </div>
  );
};


export default History;