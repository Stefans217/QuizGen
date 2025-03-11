"use client"

import React from 'react';
import './interface.css';
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { submitQuizDetails } from '@/services/quiz/submitQuizDetails';
import { Question } from '@/types/question';


const Home: React.FC = () => {
  const [masterPrompt, setMasterPrompt] = useState("")
  const [numQuestions, setNumQuestions] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])

  const handleQuestionChange = (id: number, field: keyof Question, value: string | number) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number.parseInt(e.target.value) || 0

    setNumQuestions(num)

    // Add or remove questions based on the new number
    if (num > questions.length) {
      const newQuestions = [...questions]
      for (let i = questions.length + 1; i <= num; i++) {
        newQuestions.push({ id: i, type: "", prompt: "", difficulty: 50 })
      }
      setQuestions(newQuestions)
    } else if (num < questions.length) {
      setQuestions(questions.slice(0, num))
    }
  }

  function handleSubmit(){
    submitQuizDetails(masterPrompt, numQuestions, questions);
    return;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Master Prompt</h2>
          <div className='className="min-h-[120px]"'>
            <Textarea
              placeholder="Enter general details about your quiz (ie. subject, key concepts, etc.)"
              
              value={masterPrompt}
              onChange={(e) => setMasterPrompt(e.target.value)}
            />
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

      <div className="mb-8">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-medium">Number of Questions</h2>
          <div className="w-32 text-center">
            <Input
              type="number"
              min="1"
              max="20"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
            />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">Tune Your Quiz Below</h1>

      <div className="h-1 bg-blue-500 mb-8"></div>

      <div className="space-y-8">
        {questions.map((question) => (
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
                  <SelectContent className='bg-white shadow-lg rounded-lg'>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                    <SelectItem value="short-answer">Short Answer</SelectItem>
                    <SelectItem value="essay">Essay</SelectItem>
                  </SelectContent>
                </Select>
                <div className=''>
                  <Textarea
                    placeholder="Enter your Prompt"
                    value={question.prompt}
                    onChange={(e) => handleQuestionChange(question.id, "prompt", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Label className="w-16 text-right">Difficulty</Label>
              <div className="flex-1">
                <Slider
                  value={[question.difficulty]}
                  min={0}
                  max={3}
                  step={1}
                  onValueChange={(value) => handleQuestionChange(question.id, "difficulty", value[0])}
                  className='w-[20%]'
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button className="px-8" variant="default" onClick={handleSubmit}>Generate Quiz</Button>
      </div>
    </div>
  )
};


export default Home;