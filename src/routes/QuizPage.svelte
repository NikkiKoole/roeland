<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import Quiz from '../components/Quiz.svelte';
  import dataService from '../services/dataService.js';

  export let params = {};

  let quiz = null;
  let course = null;
  let chapter = null;
  let loading = true;
  let isUnlocked = false;

  onMount(async () => {
    await loadQuiz();
  });

  async function loadQuiz() {
    loading = true;

    const { quizId } = params;

    if (!quizId) {
      push('/');
      return;
    }

    try {
      // Load quiz data
      const response = await fetch('/data/quizzes.json');
      const quizzesData = await response.json();
      quiz = quizzesData.quizzes.find(q => q.id === quizId);

      if (!quiz) {
        push('/');
        return;
      }

      // Load course and chapter info
      const coursesData = await dataService.loadCourses();
      course = coursesData.courses.find(c => c.id === quiz.courseId);

      if (course) {
        chapter = course.chapters.find(ch => ch.id === quiz.chapterId);
      }

      // Check if quiz is unlocked based on requirement type
      const userProgress = await dataService.loadUserProgress();

      if (chapter && quiz.unlockRequirement) {
        const requirement = quiz.unlockRequirement;

        if (requirement.type === 'all-videos') {
          // Check if all videos in the chapter are completed
          const allVideosCompleted = chapter.videos.every(video => {
            const videoKey = `${quiz.courseId}-${quiz.chapterId}-${video.id}`;
            return userProgress.completedVideos?.includes(videoKey);
          });
          isUnlocked = allVideosCompleted;
        } else if (requirement.type === 'specific-video') {
          // Check if the specific video is completed
          const videoKey = `${quiz.courseId}-${quiz.chapterId}-${requirement.videoId}`;
          isUnlocked = userProgress.completedVideos?.includes(videoKey) || false;
        } else {
          isUnlocked = false;
        }
      } else {
        isUnlocked = false;
      }

    } catch (error) {
      console.error('Error loading quiz:', error);
      push('/');
    }

    loading = false;
  }

  async function handleQuizComplete(event) {
    const { quizId, score, passed } = event.detail;

    if (passed) {
      await dataService.markQuizComplete(quiz.courseId, quiz.chapterId, quizId, score);
    }
  }

  function handleClose() {
    push('/');
  }
</script>

{#if loading}
  <div class="loading">
    <p>Quiz laden...</p>
  </div>
{:else if quiz}
  <div class="quiz-page">
    <div class="quiz-breadcrumb">
      <button class="btn-back" on:click={handleClose}>
        ← Terug naar Cursussen
      </button>
      {#if course && chapter}
        <span class="breadcrumb-text">{course.title} / {chapter.title}</span>
      {/if}
    </div>

    <Quiz
      {quiz}
      {chapter}
      {isUnlocked}
      on:complete={handleQuizComplete}
      on:close={handleClose}
    />
  </div>
{:else}
  <div class="error">
    <p>Quiz niet gevonden</p>
    <button on:click={handleClose}>Terug naar Cursussen</button>
  </div>
{/if}

<style>
  .loading, .error {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
  }

  .error button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
  }

  .error button:hover {
    background: var(--primary-dark);
  }

  .quiz-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  .quiz-breadcrumb {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .btn-back {
    background: white;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-back:hover {
    background: var(--primary-color);
    color: white;
  }

  .breadcrumb-text {
    color: var(--text-secondary);
    font-size: 0.9375rem;
  }
</style>
