<script>
  import { createEventDispatcher } from 'svelte';
  import { push } from 'svelte-spa-router';

  export let courses = [];
  export let userProgress = {};
  export let quizzes = [];

  const dispatch = createEventDispatcher();

  function selectVideo(course, chapter, video) {
    dispatch('videoSelect', { course, chapter, video });
  }

  function selectQuiz(quizId) {
    push(`/quiz/${quizId}`);
  }

  // Make this reactive to quizzes changes
  $: getChapterQuiz = (courseId, chapterId) => {
    return quizzes.find(q => q.courseId === courseId && q.chapterId === chapterId);
  };

  function isQuizUnlocked(quiz, chapter) {
    if (!quiz || !chapter) return false;

    const requirement = quiz.unlockRequirement;

    if (requirement.type === 'all-videos') {
      // Check if all videos in the chapter are completed
      return chapter.videos.every(video => {
        const videoKey = `${quiz.courseId}-${quiz.chapterId}-${video.id}`;
        return userProgress?.completedVideos?.includes(videoKey) || false;
      });
    } else if (requirement.type === 'specific-video') {
      // Check if the specific video is completed
      const videoKey = `${quiz.courseId}-${quiz.chapterId}-${requirement.videoId}`;
      return userProgress?.completedVideos?.includes(videoKey) || false;
    }

    return false;
  }

  function isQuizCompleted(quiz) {
    if (!quiz) return false;
    const quizKey = `${quiz.courseId}-${quiz.chapterId}-${quiz.id}`;
    return userProgress?.completedQuizzes?.some(q => q.quizKey === quizKey) || false;
  }

  $: isVideoWatched = (courseId, chapterId, videoId) => {
    const videoKey = `${courseId}-${chapterId}-${videoId}`;
    return userProgress?.completedVideos?.includes(videoKey) || false;
  };

  $: isVideoUnlocked = (courseId, chapterId, videoId, videoIndex) => {
    // First video is always unlocked
    if (videoIndex === 0) return true;

    // Check if previous video in same chapter is complete
    // For now, just return true (we'll implement proper unlocking later)
    return true;
  };

  // Make this reactive to userProgress changes
  $: getCourseProgress = (course) => {
    if (!userProgress) return 0;

    let totalVideos = 0;
    let watchedVideos = 0;

    course.chapters.forEach(chapter => {
      totalVideos += chapter.videos.length;
      chapter.videos.forEach(video => {
        if (isVideoWatched(course.id, chapter.id, video.id)) {
          watchedVideos++;
        }
      });
    });

    return totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;
  }
</script>

<div class="course-list">
  <h2>Jouw Cursussen</h2>

  {#each courses as course}
    <div class="course-card">
      <div class="course-header">
        <h3>{course.title}</h3>
        <p class="course-description">{course.description}</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {getCourseProgress(course)}%"></div>
        </div>
        <span class="progress-text">{getCourseProgress(course)}% Voltooid</span>
      </div>

      <div class="chapters">
        {#each course.chapters as chapter}
          <div class="chapter">
            <h4>📚 {chapter.title}</h4>
            <ul class="video-list">
              {#each chapter.videos as video, videoIndex}
                <li class="video-item">
                  <button
                    class="video-button"
                    class:watched={isVideoWatched(course.id, chapter.id, video.id)}
                    class:locked={!isVideoUnlocked(course.id, chapter.id, video.id, videoIndex)}
                    disabled={!isVideoUnlocked(course.id, chapter.id, video.id, videoIndex)}
                    on:click={() => selectVideo(course, chapter, video)}
                  >
                    <span class="video-status">
                      {#if !isVideoUnlocked(course.id, chapter.id, video.id, videoIndex)}
                        🔒
                      {:else if isVideoWatched(course.id, chapter.id, video.id)}
                        ✅
                      {:else}
                        ▶️
                      {/if}
                    </span>
                    <span class="video-title">{video.title}</span>
                    {#if isVideoWatched(course.id, chapter.id, video.id)}
                      <span class="video-points">+{video.points} punten</span>
                    {/if}
                    <span class="video-duration">{video.duration}</span>
                  </button>
                </li>
              {/each}
            </ul>

            <!-- Quiz button after videos -->
            {#if getChapterQuiz(course.id, chapter.id)}
              {@const quiz = getChapterQuiz(course.id, chapter.id)}
              {@const unlocked = isQuizUnlocked(quiz, chapter)}
              {@const completed = isQuizCompleted(quiz)}
              <button
                class="quiz-button"
                class:locked={!unlocked}
                class:completed={completed}
                on:click={() => selectQuiz(quiz.id)}
              >
                <span class="quiz-icon">
                  {#if !unlocked}
                    🔒
                  {:else if completed}
                    ✅
                  {:else}
                    📝
                  {/if}
                </span>
                <span class="quiz-content">
                  <span class="quiz-title">{quiz.title}</span>
                  <span class="quiz-meta">
                    {#if !unlocked}
                      {#if quiz.unlockRequirement.type === 'all-videos'}
                        <span class="quiz-locked-text">🔒 Voltooi eerst alle video's in dit hoofdstuk</span>
                      {:else if quiz.unlockRequirement.type === 'specific-video'}
                        <span class="quiz-locked-text">🔒 Voltooi eerst de vereiste video</span>
                      {/if}
                    {:else}
                      <span class="quiz-points">+{quiz.points} punten</span>
                      <span class="quiz-passing">·</span>
                      <span class="quiz-passing">{quiz.passingScore}% vereist</span>
                    {/if}
                  </span>
                </span>
                {#if completed}
                  {@const completedQuiz = userProgress.completedQuizzes.find(q => q.quizKey === `${quiz.courseId}-${quiz.chapterId}-${quiz.id}`)}
                  {#if completedQuiz}
                    <span class="quiz-score">{completedQuiz.score}%</span>
                  {/if}
                {/if}
              </button>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .course-list {
    padding: 20px;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;
  }

  .course-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .course-header h3 {
    font-size: 1.5rem;
    margin-bottom: 8px;
    color: #2c3e50;
  }

  .course-description {
    color: #666;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: #666;
    font-weight: 600;
  }

  .chapters {
    margin-top: 24px;
  }

  .chapter {
    margin-bottom: 24px;
  }

  .chapter h4 {
    font-size: 1.125rem;
    margin-bottom: 12px;
    color: #444;
  }

  .video-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .video-item {
    margin-bottom: 8px;
  }

  .video-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #f8f9fa;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1rem;
  }

  .video-button:hover:not(:disabled) {
    background: #e9ecef;
    border-color: #667eea;
    transform: translateX(4px);
  }

  .video-button.watched {
    background: linear-gradient(135deg, rgba(107, 158, 120, 0.15) 0%, rgba(107, 158, 120, 0.25) 100%);
    border-color: var(--success);
    border-width: 2px;
  }

  .video-button.watched:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(107, 158, 120, 0.25) 0%, rgba(107, 158, 120, 0.35) 100%);
    border-color: var(--success);
  }

  .video-button.watched .video-title {
    color: var(--success);
    font-weight: 600;
  }

  .video-button.locked {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .video-status {
    font-size: 1.25rem;
    flex-shrink: 0;
    min-width: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-title {
    flex: 1;
    text-align: left;
    font-weight: 500;
    color: #333;
    transition: color 0.2s ease;
  }

  .video-duration {
    font-size: 0.875rem;
    color: #666;
    flex-shrink: 0;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 0.25rem;
  }

  .video-button.watched .video-duration {
    background: rgba(107, 158, 120, 0.15);
    color: var(--success);
  }

  .video-points {
    font-size: 0.8125rem;
    color: var(--success);
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    background: rgba(107, 158, 120, 0.2);
    border-radius: 0.25rem;
    flex-shrink: 0;
  }

  /* Quiz Button Styles */
  .quiz-button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    margin-top: 1rem;
    background: linear-gradient(135deg, rgba(232, 151, 78, 0.1) 0%, rgba(232, 151, 78, 0.2) 100%);
    border: 2px solid var(--secondary-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1rem;
  }

  .quiz-button:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(232, 151, 78, 0.2) 0%, rgba(232, 151, 78, 0.3) 100%);
    border-color: var(--warning);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(232, 151, 78, 0.2);
  }

  .quiz-button.completed {
    background: linear-gradient(135deg, rgba(107, 158, 120, 0.15) 0%, rgba(107, 158, 120, 0.25) 100%);
    border-color: var(--success);
  }

  .quiz-button.completed:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(107, 158, 120, 0.25) 0%, rgba(107, 158, 120, 0.35) 100%);
    border-color: var(--success);
  }

  .quiz-button.locked {
    background: #f5f5f5;
    border-color: var(--border);
    cursor: pointer;
    opacity: 0.8;
  }

  .quiz-button.locked:hover {
    opacity: 1;
    border-color: var(--text-secondary);
  }

  .quiz-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .quiz-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: left;
  }

  .quiz-title {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1rem;
  }

  .quiz-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  .quiz-points {
    font-weight: 600;
    color: var(--secondary-color);
  }

  .quiz-button.completed .quiz-points {
    color: var(--success);
  }

  .quiz-locked-text {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-style: italic;
  }

  .quiz-score {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--success);
    padding: 0.25rem 0.75rem;
    background: rgba(107, 158, 120, 0.2);
    border-radius: 0.25rem;
  }
</style>
