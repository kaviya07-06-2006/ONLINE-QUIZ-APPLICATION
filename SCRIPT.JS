loadQuiz();
async function loadQuiz() {
  const res = await fetch('/api/quiz');
  const questions = await res.json();

  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  questions.forEach(q => {
    const div = document.createElement('div');
    div.className = 'question';

    const questionText = document.createElement('p');
    questionText.textContent = q.question;
    div.appendChild(questionText);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    q.options.forEach(opt => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = q.id;
      radio.value = opt;
      label.appendChild(radio);
      label.appendChild(document.createTextNode(opt));
      optionsDiv.appendChild(label);
    });

    div.appendChild(optionsDiv);
    container.appendChild(div);
  });
}

async function submitQuiz(event) {
  event.preventDefault();

  const form = document.getElementById('quiz-form');
  const formData = new FormData(form);
  const answers = {};

  for (const [key, value] of formData.entries()) {
    answers[key] = value;
  }

  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers)
  });

  const result = await res.json();

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<p>Your score: ${result.score} / ${result.total}</p>`;

  result.results.forEach(r => {
    resultDiv.innerHTML += `<p>Question ${r.questionId}: Your answer: ${r.yourAnswer || 'No answer'}, Correct answer: ${r.correctAnswer} — ${r.correct ? '✔️' : '❌'}</p>`;
  });
}

document.getElementById('quiz-form').addEventListener('submit', submitQuiz);

