import React from "react";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/services/user/userService";
import { fetchQuizHistory } from "@/services/quiz/fetchQuizHistory";
import { Question } from "@/types/question";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const History: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [quizHistory, setQuizHistory] = useState<any[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);

    useEffect(() => {
        fetchUserData(localStorage.getItem("token") || "")
            .then((userData) => {
                setUserId(userData.userId);
            })
            .catch((err) => console.error("Failed to fetch user data:", err));
    }, []);

    useEffect(() => {
        if (userId) {
            fetchQuizHistory(userId)
                .then((history) => {
                    setQuizHistory(history);
                })
                .catch((err) => console.error("Failed to fetch quiz history:", err));
        }
    }, [userId]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle>History</CardTitle>
                    <CardDescription>View your quiz history below</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Quiz Title</TableHead>
                                <TableHead>Date Taken</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizHistory.length > 0 ? (
                                quizHistory.map((quiz, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{quiz.masterPrompt}</TableCell>
                                        <TableCell>{quiz.dateTaken}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => setSelectedQuiz(quiz)} className="">
                                                View Questions
                                            </Button>
                                            <a href={quiz.fileUrl} download className="text-blue-600 hover:underline ml-4">
                                                Download
                                            </a>
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
            </Card>

            {selectedQuiz && (
                <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Quiz Questions</DialogTitle>
                        </DialogHeader>
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
                        </ul>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default History;
