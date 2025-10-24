const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Sample quiz questions
const quiz = [
  {
    id: 1,
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: "JavaScript"
  },
  {
    id: 2,
    question: "What does CSS stand for?",
    options: [
      "Central Style Sheets",
      "Cascading Style Sheets",
      "Cascading Simple Sheets",
      "Cars SUVs Sailboats"
    ],
    answer: "Cascading Style Sheets"
  }
];

// API: Get quiz questions (without answers)
app.get('/api/quiz', (req, res) => {
  const questions = quiz.map(({ id, question, options }) => ({ id, question, options }));
  res.json(questions);
});

// API: Submit answers and get score + results
app.post('/api/submit', (req, res) => {
  const userAnswers = req.body; // Expects { "1": "JavaScript", "2": "Cascading Style Sheets" }

  let score = 0;
  const results = quiz.map(q => {
    const userAnswer = userAnswers[q.id];
    const correct = userAnswer === q.answer;
    if (correct) score++;
    return {
      questionId: q.id,
      yourAnswer: userAnswer || null,
      correctAnswer: q.answer,
      correct
    };
  });

  res.json({ score, total: quiz.length, results });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
