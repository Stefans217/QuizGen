"use client"

import React, { useEffect } from 'react';
import './interface.css';
import { fetchUserData } from '@/services/user/userService';
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, Plus, Trash } from "lucide-react"
import { submitQuizDetails } from '@/services/quiz/submitQuizDetails';
import { Question } from '@/types/question';
import { fetchGenerateQuiz } from '@/services/quiz/fetchGeneratedQuiz';
import { toast, Toaster } from 'react-hot-toast';
import ConfirmDeleteModal from '@/components/quiz/confirmDelete';

interface QuestionErrors {
  type?: string;
  prompt?: string;
}

interface FormErrors {
  masterPrompt?: string;
  questions?: Record<number, QuestionErrors>;
}

const Home: React.FC = () => {
  const [masterPrompt, setMasterPrompt] = useState("")
  const [numQuestions, setNumQuestions] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [userId, setUserId] = useState("")
  const [quizReady, setQuizReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizId, setQuizId] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [questionCounter, setQuestionCounter] = useState(1);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchUserData(localStorage.getItem('token') || "")
      .then(userData => {
        setUserId(userData.userId);
      })
      .catch(err => console.error("Failed to fetch user data:", err));
  }, []);

  const openDeleteModal = (id: number) => {
    setQuestionToDelete(id);
    setConfirmDeleteModalOpen(true);
  }

  const handleQuestionChange = (id: number, field: keyof Question, value: string | number) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const handleAddQuestion = () => {
    //const newId = questions.length + 1;
    setQuestions([...questions, { id: questionCounter, type: "", prompt: "", difficulty: 1 }]);
    setQuestionCounter(questionCounter + 1);
    setNumQuestions(prev => prev + 1);
  }

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      id: index + 1,
    }));
    setQuestions(reorderedQuestions);
    setNumQuestions(reorderedQuestions.length);
    // Update counter to the next sequential number
    setQuestionCounter(reorderedQuestions.length + 1);
  }

  // Validate master prompt and each question
  const validateForm = () => {
    const errors: FormErrors = {};

    if (!masterPrompt.trim()) {
      errors.masterPrompt = "Master prompt is required.";
    }

    if (questions.length === 0) {
      errors.questions = { 0: { prompt: "Please add at least one question." } };
    } else {
      const questionErrors: Record<number, QuestionErrors> = {};
      questions.forEach(q => {
        const qErrors: QuestionErrors = {};
        if (!q.type.trim()) {
          qErrors.type = "Select a question type.";
        }
        if (!q.prompt.trim()) {
          qErrors.prompt = "Question prompt is required.";
        }
        if (Object.keys(qErrors).length > 0) {
          questionErrors[q.id] = qErrors;
        }
      });
      if (Object.keys(questionErrors).length > 0) {
        errors.questions = questionErrors;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function handleSubmit(){
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try{
      const response = await submitQuizDetails(userId, masterPrompt, numQuestions, questions);
      setQuizId(response.quizId);
      setQuizReady(true);
      toast.success("Quiz generated successfully!");
    }catch(error){
      console.error("Failed to submit quiz details:", error);
      toast.error("Failed to generate quiz. Please try again.");
    }
    
    setIsSubmitting(false);
  }

  const handleDownloadQuiz = async () => {
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

  const handleResetQuiz = () => {
    setMasterPrompt("");
    setNumQuestions(0);
    setQuestions([]);
    setQuizId("");
    setQuizReady(false); 
    setFormErrors({});
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Toaster position="top-center" />

      {/* Master prompt and PDF upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Master Prompt</h2>
          <div className='className="min-h-[120px]"'>
            <Textarea
              placeholder="Enter general details about your quiz (ie. subject, key concepts, etc.)"
              
              value={masterPrompt}
              onChange={(e) => setMasterPrompt(e.target.value)}
            />
            {formErrors.masterPrompt && (
              <p className="text-red-500 text-sm">{formErrors.masterPrompt}</p>
            )}
          </div>

        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Input a PDF</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Choose a file
            </Button>
          </div>
        </div>
      </div>

 

      <h1 className="text-2xl font-bold text-center mb-6">Tune Your Quiz Below</h1>
      <div className="h-1 bg-blue-500 mb-8"></div>

      {/* Question generator */}
      <div className="space-y-8">
        {questions.map((question) => {
          const questionError = formErrors.questions?.[question.id];
          return (
            <div key={question.id} className="border-b pb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold w-16">Q{question.id}</h2>
                <div className="flex-1 space-y-4">
                  <Select
                    value={question.type}
                    onValueChange={(value) => handleQuestionChange(question.id, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Question Type" />
                    </SelectTrigger>
                    <SelectContent className=''>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                  {questionError?.type && (
                    <p className="text-red-500 text-sm">{questionError.type}</p>
                  )}
                  <div className=''>
                    <Textarea
                      placeholder="Enter your Prompt"
                      value={question.prompt}
                      onChange={(e) => handleQuestionChange(question.id, "prompt", e.target.value)}
                    />
                    {questionError?.prompt && (
                      <p className="text-red-500 text-sm">{questionError.prompt}</p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" onClick={() => openDeleteModal(question.id)}>
                    <Trash className="h-5 w-5 text-red-500" />
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Label className="w-16 text-right">Difficulty</Label>
                <div className="flex-1">
                  <Slider
                    value={[question.difficulty]}
                    min={1}
                    max={3}
                    step={1}
                    onValueChange={(value) => handleQuestionChange(question.id, "difficulty", value[0])}
                    className='w-[20%]'
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

     {/* Add question */}
      <div className="mt-8">
        <div className="flex flex-col items-center gap-2">
          <Button 
              onClick={handleAddQuestion}
              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600"
          >
              <Plus className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>

      
      {/* Action buttons */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {!quizReady && numQuestions > 0 && (
          !isSubmitting ? (
          <Button className="px-8" variant="default" onClick={handleSubmit}>
            Generate Quiz
          </Button>
        ) : (
          <Button className="px-8" variant="default" disabled>
            <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Generating Quiz...
          </Button>
          )
        )}
        {quizReady && (
          <>
            <div className="flex gap-4 w-full justify-center">
              <Button className="w-1/5 px-8" variant="outline" onClick={handleDownloadQuiz}>
                Download Quiz
              </Button>
              <Button className="w-1/5 px-8" variant="secondary" onClick={handleResetQuiz}>
                Generate Another Quiz
              </Button>
            </div>      
            <span className="flex items-center w-full my-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-gray-800 text-sm text-center">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </span>
            <div className="w-1/5 mb-4">
              {isSubmitting ? (
                <Button className="w-full px-8" variant="default" disabled>
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Generating Quiz...
                </Button>
              ) : (
                  <Button className="w-full px-8" variant="default" onClick={handleSubmit}>
                    Re-Generate Quiz
                  </Button>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmDeleteModal
        open={confirmDeleteModalOpen}
        message="Are you sure you want to delete this question?"
        onCancel={() => {
          setConfirmDeleteModalOpen(false);
          setQuestionToDelete(null);
        }}
        onConfirm={() => {
          if (questionToDelete !== null) {
            handleDeleteQuestion(questionToDelete);
          }
          setConfirmDeleteModalOpen(false);
          setQuestionToDelete(null);
      }}/>
    </div>
  )
};


export default Home;