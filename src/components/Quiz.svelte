<script>
  import { createEventDispatcher } from 'svelte';

  export let quiz;
  export let isUnlocked = true;
  export let chapter = null;

  const dispatch = createEventDispatcher();

  let currentQuestionIndex = 0;
  let userAnswers = {};
  let showResults = false;
  let score = 0;
  let showExplanation = false;
  let quizCompleted = false;
  let currentAnswerCorrect = false;

  $: currentQuestion = quiz?.questions[currentQuestionIndex];
  $: totalQuestions = quiz?.questions.length || 0;
  $: progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  $: isPassed = score >= quiz?.passingScore;

  // Check if current answer is correct (without side effects)
  $: {
    if (currentQuestion && userAnswers[currentQuestion.id] !== undefined) {
      currentAnswerCorrect = isAnswerCorrect(currentQuestion, userAnswers[currentQuestion.id]);
    } else {
      currentAnswerCorrect = false;
    }
  }

  function selectMultipleChoiceAnswer(optionIndex) {
    if (showResults || quizCompleted) return;

    userAnswers[currentQuestion.id] = optionIndex;
    userAnswers = userAnswers; // Trigger reactivity
  }

  function handleTextInput(event) {
    if (showResults || quizCompleted) return;

    userAnswers[currentQuestion.id] = event.target.value.trim();
    userAnswers = userAnswers;
  }

  function nextQuestion() {
    showExplanation = false;

    if (currentQuestionIndex < totalQuestions - 1) {
      currentQuestionIndex++;
    } else {
      submitQuiz();
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      showExplanation = false;
      currentQuestionIndex--;
    }
  }

  function isAnswerCorrect(question, answer) {
    if (answer === undefined || answer === '') return false;

    let isCorrect = false;

    if (question.type === 'multiple-choice') {
      isCorrect = answer === question.correctAnswer;
    } else if (question.type === 'text-input') {
      const normalizedAnswer = question.caseSensitive
        ? answer
        : answer?.toLowerCase();

      isCorrect = question.correctAnswers.some(correct => {
        const normalizedCorrect = question.caseSensitive
          ? correct
          : correct.toLowerCase();
        return normalizedAnswer === normalizedCorrect;
      });
    }

    return isCorrect;
  }

  function checkAnswer() {
    showExplanation = true;
  }

  function submitQuiz() {
    let correctCount = 0;

    quiz.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (isAnswerCorrect(question, userAnswer)) {
        correctCount++;
      }
    });

    score = Math.round((correctCount / totalQuestions) * 100);
    showResults = true;
    quizCompleted = true;

    if (isPassed) {
      dispatch('complete', {
        quizId: quiz.id,
        score,
        passed: true
      });
    }
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = {};
    showResults = false;
    score = 0;
    showExplanation = false;
    quizCompleted = false;
  }

  $: hasAnswered = userAnswers[currentQuestion?.id] !== undefined && userAnswers[currentQuestion?.id] !== '';
  $: isLastQuestion = currentQuestionIndex === totalQuestions - 1;
</script>

{#if quiz}
  <div class="quiz-container">
    {#if !isUnlocked}
      <div class="locked-quiz">
        <div class="lock-icon">🔒</div>
        <h3>Quiz Vergrendeld</h3>
        {#if quiz.unlockRequirement?.type === 'all-videos'}
          <p>Voltooi eerst alle video's in dit hoofdstuk om deze quiz te ontgrendelen.</p>
          {#if chapter}
            <div class="required-videos">
              <p class="videos-title">Vereiste video's:</p>
              <ul>
                {#each chapter.videos as video}
                  <li class="video-requirement">
                    {video.title}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        {:else if quiz.unlockRequirement?.type === 'specific-video'}
          <p>Voltooi de vereiste video om deze quiz te ontgrendelen.</p>
        {:else}
          <p>Deze quiz is nog niet beschikbaar.</p>
        {/if}
        <button class="btn-primary" on:click={() => dispatch('close')}>
          Terug naar Cursussen
        </button>
      </div>
    {:else if showResults}
      <!-- Results Screen -->
      <div class="results-screen">
        <div class="results-header">
          <div class="score-circle" class:passed={isPassed}>
            <span class="score-number">{score}%</span>
          </div>
          <h3>{isPassed ? '🎉 Gehaald!' : '😕 Nog Niet Gehaald'}</h3>
          <p class="score-message">
            {#if isPassed}
              Goed gedaan! Je hebt de quiz gehaald met {score}%.
            {:else}
              Je hebt {score}% behaald. Je hebt minimaal {quiz.passingScore}% nodig om te slagen.
            {/if}
          </p>
        </div>

        <div class="results-details">
          <div class="result-stat">
            <span class="stat-label">Correcte Antwoorden</span>
            <span class="stat-value">{Math.round(totalQuestions * (score / 100))} / {totalQuestions}</span>
          </div>
          <div class="result-stat">
            <span class="stat-label">Benodigde Score</span>
            <span class="stat-value">{quiz.passingScore}%</span>
          </div>
          {#if isPassed}
            <div class="result-stat success">
              <span class="stat-label">Punten Verdiend</span>
              <span class="stat-value">+{quiz.points} punten</span>
            </div>
          {/if}
        </div>

        <div class="results-actions">
          {#if isPassed}
            <button class="btn-primary" on:click={() => dispatch('close')}>
              Doorgaan
            </button>
          {:else}
            <button class="btn-primary" on:click={restartQuiz}>
              Opnieuw Proberen
            </button>
          {/if}
          <button class="btn-secondary" on:click={() => dispatch('close')}>
            Sluiten
          </button>
        </div>
      </div>
    {:else}
      <!-- Quiz Screen -->
      <div class="quiz-header">
        <h3>{quiz.title}</h3>
        <p class="quiz-description">{quiz.description}</p>

        <div class="progress-section">
          <div class="progress-info">
            <span>Vraag {currentQuestionIndex + 1} van {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: {progress}%"></div>
          </div>
        </div>
      </div>

      <div class="question-container">
        <div class="question-text">
          <span class="question-number">Vraag {currentQuestionIndex + 1}</span>
          <h4>{currentQuestion.question}</h4>
        </div>

        {#if currentQuestion.type === 'multiple-choice'}
          <div class="options-list">
            {#each currentQuestion.options as option, index}
              <button
                class="option-button"
                class:selected={userAnswers[currentQuestion.id] === index}
                class:correct={showExplanation && index === currentQuestion.correctAnswer}
                class:incorrect={showExplanation && userAnswers[currentQuestion.id] === index && index !== currentQuestion.correctAnswer}
                disabled={showExplanation}
                on:click={() => selectMultipleChoiceAnswer(index)}
              >
                <span class="option-letter">{String.fromCharCode(65 + index)}</span>
                <span class="option-text">{option}</span>
                {#if showExplanation}
                  {#if index === currentQuestion.correctAnswer}
                    <span class="check-icon">✓</span>
                  {:else if userAnswers[currentQuestion.id] === index}
                    <span class="check-icon">✗</span>
                  {/if}
                {/if}
              </button>
            {/each}
          </div>
        {:else if currentQuestion.type === 'text-input'}
        <div class="text-input-container">
          <input
            type="text"
            class="text-input"
            class:answered={hasAnswered && !showExplanation}
            class:correct={showExplanation && currentAnswerCorrect}
            class:incorrect={showExplanation && !currentAnswerCorrect}
            placeholder="Typ je antwoord hier..."
            value={userAnswers[currentQuestion.id] || ''}
            disabled={showExplanation}
            on:input={handleTextInput}
          />
          {#if showExplanation}
            {#if currentAnswerCorrect}
              <p class="input-hint correct">✓ Correct!</p>
            {:else}
              <p class="input-hint incorrect">✗ Niet correct. Acceptabele antwoorden: {currentQuestion.correctAnswers.join(', ')}</p>
            {/if}
          {:else}
            <p class="input-hint">Typ je antwoord en klik op "Controleer Antwoord"</p>
          {/if}
        </div>
        {/if}

        {#if showExplanation}
          <div class="explanation-box">
            <strong>💡 Uitleg:</strong>
            <p>{currentQuestion.explanation}</p>
          </div>
        {/if}
      </div>

      <div class="quiz-actions">
        <button
          class="btn-secondary"
          disabled={currentQuestionIndex === 0}
          on:click={previousQuestion}
        >
          ← Vorige
        </button>

        <div class="action-buttons">
          {#if !showExplanation && hasAnswered}
            <button class="btn-check" on:click={checkAnswer}>
              Controleer Antwoord
            </button>
          {/if}

          {#if showExplanation}
            {#if isLastQuestion}
              <button class="btn-primary" on:click={nextQuestion}>
                Quiz Voltooien
              </button>
            {:else}
              <button class="btn-primary" on:click={nextQuestion}>
                Volgende →
              </button>
            {/if}
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .quiz-container {
    max-width: 800px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .quiz-container {
      padding: 0;
    }
  }

  .locked-quiz {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--surface);
    border-radius: 0.75rem;
    border: 2px dashed var(--border);
  }

  @media (max-width: 768px) {
    .locked-quiz {
      padding: 2rem 1.25rem;
      border-radius: 0.5rem;
    }
  }

  .lock-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    .lock-icon {
      font-size: 3rem;
    }
  }

  .locked-quiz h3 {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .locked-quiz h3 {
      font-size: 1.25rem;
    }
  }

  .locked-quiz p {
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .locked-quiz p {
      font-size: 0.9375rem;
    }
  }

  .required-videos {
    margin-top: 1.5rem;
    text-align: left;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .videos-title {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .required-videos ul {
    list-style: none;
    padding: 0;
  }

  .video-requirement {
    padding: 0.5rem;
    background: var(--background);
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
    font-size: 0.9375rem;
  }

  .quiz-header {
    background: var(--surface);
    padding: 2rem;
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow);
  }

  @media (max-width: 768px) {
    .quiz-header {
      padding: 1.25rem 1rem;
      border-radius: 0;
      margin-bottom: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }

  .quiz-header h3 {
    margin: 0 0 0.5rem 0;
    color: var(--primary-color);
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    .quiz-header h3 {
      font-size: 1.25rem;
    }
  }

  .quiz-description {
    margin: 0 0 1.5rem 0;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .quiz-description {
      font-size: 0.9375rem;
      margin-bottom: 1rem;
    }
  }

  .progress-section {
    margin-top: 1.5rem;
  }

  @media (max-width: 768px) {
    .progress-section {
      margin-top: 1rem;
    }
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .progress-bar {
    height: 0.5rem;
    background: var(--border);
    border-radius: 0.25rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--accent) 100%);
    transition: width 0.3s ease;
  }

  .question-container {
    background: var(--surface);
    padding: 2rem;
    border-radius: 0.75rem;
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow);
  }

  @media (max-width: 768px) {
    .question-container {
      padding: 1.25rem 1rem;
      border-radius: 0;
      margin-bottom: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }

  .question-text {
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .question-text {
      margin-bottom: 1.5rem;
    }
  }

  .question-number {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(44, 95, 124, 0.1);
    color: var(--primary-color);
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .question-text h4 {
    margin: 0.5rem 0 0 0;
    font-size: 1.25rem;
    color: var(--text-primary);
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .question-text h4 {
      font-size: 1.125rem;
      line-height: 1.6;
    }
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .option-button {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    background: var(--background);
    border: 2px solid var(--border);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    position: relative;
    min-height: 44px;
  }

  @media (max-width: 768px) {
    .option-button {
      padding: 1rem 1.25rem;
      gap: 0.875rem;
      min-height: 56px;
    }

    .option-button:hover:not(:disabled) {
      transform: none;
    }

    .option-button:active:not(:disabled) {
      opacity: 0.9;
    }
  }

  .option-button:hover:not(:disabled) {
    border-color: var(--primary-color);
    background: var(--surface);
    transform: translateX(4px);
  }

  .option-button.selected {
    border-color: var(--primary-color);
    background: rgba(44, 95, 124, 0.1);
  }

  .option-button.correct {
    border-color: #10b981;
    border-width: 3px;
    background: #d1fae5;
  }

  .option-button.incorrect {
    border-color: #ef4444;
    border-width: 3px;
    background: #fee2e2;
  }

  .option-button:disabled {
    cursor: default;
  }

  .option-letter {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface);
    border-radius: 50%;
    font-weight: 700;
    color: var(--primary-color);
  }

  .option-button.correct .option-letter {
    background: #10b981;
    color: white;
  }

  .option-button.incorrect .option-letter {
    background: #ef4444;
    color: white;
  }

  .option-button.incorrect .option-letter {
    background: var(--error);
    color: white;
  }

  .option-text {
    flex: 1;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .option-text {
      font-size: 0.9375rem;
      line-height: 1.5;
    }
  }

  .check-icon {
    margin-left: auto;
    font-size: 1.75rem;
    font-weight: bold;
  }

  .option-button.correct .check-icon {
    color: #10b981;
  }

  .option-button.incorrect .check-icon {
    color: #ef4444;
  }

  .option-button.correct .check-icon {
    color: var(--success);
  }

  .option-button.incorrect .check-icon {
    color: var(--error);
  }

  .text-input-container {
    margin-bottom: 1rem;
  }

  .text-input {
    width: 100%;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    border: 2px solid var(--border);
    border-radius: 0.5rem;
    background: var(--background);
    color: var(--text-primary);
    transition: all 0.2s ease;
    min-height: 44px;
  }

  @media (max-width: 768px) {
    .text-input {
      padding: 0.875rem 1rem;
      font-size: 16px;
      min-height: 56px;
    }
  }

  .text-input:focus {
    outline: none;
    border-color: var(--primary-color);
    border-width: 3px;
    background: var(--surface);
  }

  .text-input.answered {
    border-color: var(--primary-color);
    border-width: 3px;
    background: rgba(44, 95, 124, 0.05);
  }

  .text-input.correct {
    border-color: #10b981;
    border-width: 3px;
    background: #d1fae5;
  }

  .text-input.incorrect {
    border-color: #ef4444;
    border-width: 3px;
    background: #fee2e2;
  }

  .text-input:disabled {
    background: var(--background);
    cursor: not-allowed;
  }

  .input-hint {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-style: italic;
  }

  .input-hint.correct {
    color: #10b981;
    font-weight: 600;
  }

  .input-hint.incorrect {
    color: #ef4444;
    font-weight: 600;
  }

  .explanation-box {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: #fef3c7;
    border: 2px solid #f59e0b;
    border-radius: 0.5rem;
  }

  .explanation-box strong {
    color: #d97706;
    display: block;
    margin-bottom: 0.75rem;
    font-size: 1.1rem;
  }

  .explanation-box p {
    margin: 0;
    color: #78350f;
    line-height: 1.6;
    font-weight: 500;
  }

  .quiz-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 768px) {
    .quiz-actions {
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
  }

  .btn-primary, .btn-secondary, .btn-check {
    padding: 0.875rem 1.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: var(--surface);
    color: var(--text-primary);
    border: 2px solid var(--border);
  }

  .btn-secondary:hover:not(:disabled) {
    border-color: var(--primary-color);
  }

  .btn-check {
    background: var(--secondary-color);
    color: white;
  }

  .btn-check:hover {
    background: #d68842;
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Results Screen */
  .results-screen {
    background: var(--surface);
    padding: 3rem 2rem;
    border-radius: 0.75rem;
    box-shadow: var(--shadow);
    text-align: center;
  }

  @media (max-width: 768px) {
    .results-screen {
      padding: 2rem 1.25rem;
      border-radius: 0;
    }
  }

  .results-header {
    margin-bottom: 2.5rem;
  }

  @media (max-width: 768px) {
    .results-header {
      margin-bottom: 2rem;
    }
  }

  .score-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2rem;
    background: var(--background);
    border: 8px solid var(--error);
    position: relative;
  }

  @media (max-width: 768px) {
    .score-circle {
      width: 160px;
      height: 160px;
      border-width: 6px;
      margin-bottom: 1.5rem;
    }
  }

  .score-circle.passed {
    border-color: var(--success);
  }

  .score-number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary-color);
  }

  @media (max-width: 768px) {
    .score-number {
      font-size: 2.5rem;
    }
  }

  .results-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
    color: var(--text-primary);
  }

  .score-message {
    color: var(--text-secondary);
    font-size: 1.125rem;
  }

  .results-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 2rem;
    background: var(--background);
    border-radius: 0.5rem;
  }

  .result-stat {
    text-align: center;
  }

  .result-stat.success {
    color: var(--success);
  }

  .stat-label {
    display: block;
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }

  .result-stat.success .stat-label {
    color: var(--success);
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .result-stat.success .stat-value {
    color: var(--success);
  }

  .results-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .results-actions {
      flex-direction: column;
      gap: 0.75rem;
    }
  }
</style>
