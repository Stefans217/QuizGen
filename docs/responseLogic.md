# Quiz Builder API Logic

## Endpoint: `POST /generate-quiz`

### **Request Parameters**
- `masterPrompt` (string) - The main prompt that provides context for the quiz.
- `numQuestions` (integer) - The number of questions to generate.
- `questions` (array of objects) - A list of question configurations.
  - `subPrompt` (string) - Specific details for generating a question.
  - `difficulty` (string) - The difficulty level (e.g., easy, medium, hard).
  - `questionType` (string) - The type of question (e.g., multiple-choice, true/false, short answer).

### **Processing Steps**
1. **Validate Input**
   - Ensure `masterPrompt` is provided and is a valid string.
   - Check that `numQuestions` is a positive integer.
   - Verify that `questions` is an array with properly structured objects.

2. **Generate Questions**
   - Loop through the `questions` array.
   - For each question:
     - Extract `subPrompt`, `difficulty`, and `questionType`.
     - Pass this data along with `masterPrompt` to the quiz generation logic.
     - Generate a question based on the specified criteria.

3. **Format Quiz Output**
   - Structure the quiz with a title and properly formatted questions.
   - Include metadata such as difficulty and type for each question.

4. **Return Response**
   - If successful, return a JSON object with the generated quiz.
   - If an error occurs, return an error message with details.

### **Example Request**
```json
{
  "masterPrompt": "Physics Quiz on Newton's Laws",
  "numQuestions": 3,
  "questions": [
    {
      "subPrompt": "Explain Newton's First Law with an example.",
      "difficulty": "easy",
      "questionType": "short answer"
    },
    {
      "subPrompt": "What is the formula for Newton's Second Law?",
      "difficulty": "medium",
      "questionType": "multiple-choice"
    },
    {
      "subPrompt": "Describe an experiment to demonstrate Newton's Third Law.",
      "difficulty": "hard",
      "questionType": "short answer"
    }
  ]
}
```

### **Error Handling**
- Return a `400 Bad Request` if any parameters are missing or invalid.
- Return a `500 Internal Server Error` if quiz generation fails due to unforeseen issues.

