<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { fly } from 'svelte/transition';
  import VideoPlayer from '../components/VideoPlayer.svelte';
  import dataService from '../services/dataService.js';

  export let params = {};

  let video = null;
  let course = null;
  let chapter = null;
  let userProgress = null;
  let loading = true;
  let isCompleted = false;
  let showSuccess = false;

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;

    const { courseId, chapterId, videoId } = params;

    if (!courseId || !chapterId || !videoId) {
      push('/');
      return;
    }

    try {
      const coursesData = await dataService.loadCourses();
      course = coursesData.courses.find(c => c.id === courseId);

      if (!course) {
        push('/');
        return;
      }

      chapter = course.chapters.find(ch => ch.id === chapterId);

      if (!chapter) {
        push('/');
        return;
      }

      video = chapter.videos.find(v => v.id === videoId);

      if (!video) {
        push('/');
        return;
      }

      userProgress = await dataService.loadUserProgress();

      // Check if this video is already completed
      const videoKey = `${course.id}-${chapter.id}-${video.id}`;
      isCompleted = userProgress.completedVideos?.includes(videoKey) || false;
    } catch (error) {
      console.error('Error loading video:', error);
      push('/');
    }

    loading = false;
  }

  async function handleVideoComplete() {
    if (isCompleted) {
      return; // Already completed
    }

    await dataService.markVideoComplete(course.id, chapter.id, video.id);
    userProgress = await dataService.loadUserProgress();

    isCompleted = true;
    showSuccess = true;

    // Hide success message after 3 seconds
    setTimeout(() => {
      showSuccess = false;
    }, 3000);
  }

  function handleBack() {
    push('/');
  }
</script>

{#if loading}
  <div class="loading">
    <p>Video laden...</p>
  </div>
{:else if video && course && chapter}
  {#if showSuccess}
    <div
      class="success-banner"
      transition:fly="{{ y: -20, duration: 300 }}"
    >
      ✅ Video voltooid! +{video.points} punten verdiend!
    </div>
  {/if}

  <VideoPlayer
    {video}
    {course}
    {chapter}
    {isCompleted}
    on:complete={handleVideoComplete}
    on:back={handleBack}
  />
{:else}
  <div class="error">
    <p>Video niet gevonden</p>
    <button on:click={() => push('/')}>Terug naar Cursussen</button>
  </div>
{/if}

<style>
  .loading, .error {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
  }

  .error button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }

  .error button:hover {
    background: #5568d3;
  }

  .success-banner {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--success);
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    box-shadow: var(--shadow-lg);
    font-weight: 600;
    font-size: 1.1rem;
    z-index: 1000;
    max-width: 90%;
    text-align: center;
  }

  @media (max-width: 768px) {
    .success-banner {
      top: 4.5rem;
      left: 1rem;
      right: 1rem;
      transform: none;
      padding: 1rem;
      font-size: 0.9375rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
</style>
