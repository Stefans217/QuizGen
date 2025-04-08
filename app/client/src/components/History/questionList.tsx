import React from "react";
import { Question } from "@/types/question";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface QuestionListModalProps {
    open: boolean;
    onClose: () => void;
    questions: Question[];
}

const QuestionListModal: React.FC<QuestionListModalProps> = ({ open, onClose, questions }) => {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) onClose();
        }}>
            <DialogContent className="overflow-y-auto pr-2 w-full animate-fadeIn max-h-[60vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Quiz Questions</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[calc(60vh-4rem)] pr-2 custom-scrollbar">
                    <ul className="list-disc pl-4">
                        {questions.map((question: Question, i: number) => (
                            <li key={i} className="mb-2">
                                <strong>SubPrompt:</strong> {question.prompt},
                                <br />
                                <strong>Difficulty:</strong> {question.difficulty},
                                <br />
                                <strong>Type:</strong> {question.type}
                            </li>
                        ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QuestionListModal;
