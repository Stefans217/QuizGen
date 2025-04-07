import React from "react";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/services/user/userService";
import { fetchQuizHistory } from "@/services/quiz/fetchQuizHistory";
import { Question } from "@/types/question";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchGenerateQuiz } from "@/services/quiz/fetchGeneratedQuiz";


const History: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [quizHistory, setQuizHistory] = useState<any[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchUserData(localStorage.getItem("token") || "")
            .then((userData) => {
                setUserId(userData.userId);
            })
            .catch((err) => console.error("Failed to fetch user data:", err))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (userId) {
            setIsLoading(true);
            fetchQuizHistory(userId)
                .then((history) => {
                    setQuizHistory(history);
                })
                .catch((err) => console.error("Failed to fetch quiz history:", err))
                .finally(() => setIsLoading(false));
        }
    }, [userId]);

    const handleDownloadQuiz = async (quizId: string) => {
        try {
            if (!quizId) {
                console.error("No quiz ID found.");
                return;
            }
            await fetchGenerateQuiz(quizId);
        } catch (error) {
            console.error("Error downloading quiz:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8">

            <Card className="w-full max-w-4xl border-none">
                <CardHeader>
                    <CardTitle>History</CardTitle>
                    <CardDescription>View your quiz history below</CardDescription>
                </CardHeader>
                {isLoading ? (
                <div>Loading...</div>
                ) : (
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>MasterPrompt</TableHead>
                                <TableHead>NumQuestions</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizHistory.length > 0 ? (
                                quizHistory.map((quiz, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="whitespace-normal break-words">{quiz.masterPrompt}</TableCell>
                                        <TableCell>{quiz.questions.length}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => setSelectedQuiz(quiz)} variant="default" className="">
                                                View Questions
                                            </Button>
                                            <Button onClick={() => handleDownloadQuiz(quiz.quizId)} variant="link" className="ml-4">
                                                Download
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-gray-500">
                                        No quiz history found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                )}
           </Card>
            
            {selectedQuiz && (
                <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
                    <DialogContent className="overflow-y-auto pr-2 w-full animate-fadeIn max-h-[60vh] overflow-hidden">
                        <DialogHeader>
                            <DialogTitle>Quiz Questions</DialogTitle>
                        </DialogHeader>
                        <div className="overflow-y-auto max-h-[calc(60vh-4rem)] pr-2 custom-scrollbar">
                        <ul className="list-disc pl-4">
                            {selectedQuiz.questions.map((question: Question, i: number) => (
                                <li key={i} className="mb-2">
                                    <strong>SubPrompt:</strong> {question.prompt},  
                                    <br />
                                    <strong>Difficulty:</strong> {question.difficulty},
                                    <br />
                                    <strong>Type:</strong> {question.type}
                                </li>
                            ))}
                        </ul></div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default History;
