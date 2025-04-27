const themeToggle = document.querySelector('.theme-toggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  const icon = themeToggle.querySelector('i');
  if (document.body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
});

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    tabPanes.forEach(pane => pane.classList.remove('active'));
    const tab = button.getAttribute('data-tab');
    document.getElementById(tab).classList.add('active');
  });
});

const visitedLessons = JSON.parse(localStorage.getItem('visitedLessons')) || [];

document.querySelector('.search-bar').addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  document.querySelectorAll('.lesson').forEach(lesson => {
    const title = lesson.querySelector('.title').textContent.toLowerCase();
    const subtitle = lesson.querySelector('.subtitle').textContent.toLowerCase();
    lesson.style.display = (title.includes(searchTerm) || subtitle.includes(searchTerm)) ? 'block' : 'none';
  });
});

document.querySelectorAll('.view-lesson').forEach(button => {
  button.addEventListener('click', function() {
    const lessonElement = this.parentElement;
    const lessonId = lessonElement.getAttribute('data-lesson');
    const contentElement = lessonElement.querySelector('.lesson-content');
    
    if (!visitedLessons.includes(lessonId)) {
      visitedLessons.push(lessonId);
      localStorage.setItem('visitedLessons', JSON.stringify(visitedLessons));
      lessonElement.classList.add('visited');
    }
    
    if (contentElement.classList.contains('show')) {
      contentElement.classList.remove('show');
    } else {
      contentElement.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
      contentElement.classList.add('show');
      
      setTimeout(() => {
        contentElement.innerHTML = lessons[lessonId];
      }, 800);
    }
  });
});

document.querySelectorAll('.lesson').forEach(lesson => {
  const lessonId = lesson.getAttribute('data-lesson');
  if (visitedLessons.includes(lessonId)) {
    lesson.classList.add('visited');
  }
});

const quizQuestions = [
  {
    question: "Which HTML tag is used for the largest heading? 🏆",
    options: ["<h6>", "<heading>", "<h1>", "<head>"],
    answer: "<h1>"
  },
  {
    question: "What does CSS stand for? 🎨",
    options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
    answer: "Cascading Style Sheets"
  },
  {
    question: "Which keyword is used to declare a variable in JavaScript? 🔑",
    options: ["var", "let", "const", "All of the above"],
    answer: "All of the above"
  },

  {
    question: "Which function is used to print to the console in Python? 🐍",
    options: ["print()", "echo()", "log()", "console.print()"],
    answer: "print()"
},
{
  question: "What command is used to create a new Angular project? ⚡",
  options: ["ng new", "angular init", "ng start", "ng create"],
  answer: "ng new"
},
{
  question: "Which hook is used to manage state in React? ⚛️",
  options: ["useState()", "useEffect()", "setState()", "stateHook()"],
  answer: "useState()"
}

];

let currentQuestionIndex = 0;
let score = 0;

function loadQuizQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  document.getElementById('quiz-question').textContent = question.question;
  document.getElementById('quiz-options').innerHTML = '';
  document.getElementById('current-q').textContent = currentQuestionIndex + 1;
  document.getElementById('total-qs').textContent = quizQuestions.length;
  
  question.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(option, button));
    document.getElementById('quiz-options').appendChild(button);
  });
  
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('next-question').style.display = 'none';
}

function checkAnswer(selected, button) {
  const correct = quizQuestions[currentQuestionIndex].answer;
  const options = document.querySelectorAll('#quiz-options button');
  
  options.forEach(opt => {
    opt.disabled = true;
    if (opt.textContent === correct) {
      opt.classList.add('correct');
    } else if (opt === button && selected !== correct) {
      opt.classList.add('incorrect');
    }
  });
  
  if (selected === correct) {
    document.getElementById('quiz-feedback').textContent = 'Correct! 🎉';
    document.getElementById('quiz-feedback').className = 'correct';
    score++;
  } else {
    document.getElementById('quiz-feedback').textContent = `Incorrect. The correct answer is: ${correct}`;
    document.getElementById('quiz-feedback').className = 'incorrect';
  }
  
  document.getElementById('next-question').style.display = 'block';
}

document.getElementById('next-question').addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    loadQuizQuestion();
  } else {
    document.getElementById('quiz-question').textContent = `Quiz Complete! 🏁 Score: ${score}/${quizQuestions.length}`;
    document.getElementById('quiz-options').innerHTML = '';
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('next-question').style.display = 'none';
    
    setTimeout(() => {
      currentQuestionIndex = 0;
      score = 0;
      loadQuizQuestion();
    }, 3000);
  }
});

loadQuizQuestion();