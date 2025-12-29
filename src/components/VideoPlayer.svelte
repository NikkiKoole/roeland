<script>
  import { createEventDispatcher } from 'svelte';

  export let video;
  export let course;
  export let chapter;
  export let isCompleted = false;

  const dispatch = createEventDispatcher();

  let youtubeUrl = '';

  $: if (video && video.youtubeId) {
    youtubeUrl = `https://www.youtube.com/embed/${video.youtubeId}?enablejsapi=1`;
  }

  function handleComplete() {
    dispatch('complete');
  }

  function handleBack() {
    dispatch('back');
  }
</script>

<div class="video-player">
  {#if video}
    <div class="breadcrumb">
      <button class="btn-back" on:click={handleBack}>← Terug naar Cursussen</button>
      <span class="breadcrumb-text">{course.title} / {chapter.title}</span>
    </div>

    <div class="video-header">
      <h2>{video.title}</h2>
      {#if video.description}
        <p class="description">{video.description}</p>
      {/if}
      <div class="video-meta">
        <span class="duration">⏱️ {video.duration}</span>
        <span class="points">⭐ {video.points} punten</span>
      </div>
    </div>

    <div class="video-container">
      <iframe
        src={youtubeUrl}
        title={video.title}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>

    <div class="video-actions">
      <button
        class="btn-complete"
        class:completed={isCompleted}
        disabled={isCompleted}
        on:click={handleComplete}
      >
        {#if isCompleted}
          ✅ Voltooid
        {:else}
          ✓ Markeer als Voltooid (+{video.points} punten)
        {/if}
      </button>
    </div>
  {:else}
    <div class="no-video">
      <p>Selecteer een video om te bekijken</p>
    </div>
  {/if}
</div>

<style>
  .video-player {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .btn-back {
    background: white;
    border: 2px solid #667eea;
    color: #667eea;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-back:hover {
    background: #667eea;
    color: white;
  }

  .breadcrumb-text {
    color: #666;
    font-size: 0.9rem;
  }

  .video-header {
    margin-bottom: 1.5rem;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .video-header h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 0.75rem;
  }

  .video-meta {
    display: flex;
    gap: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .duration, .points {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
    overflow: hidden;
    background: #000;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .video-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
  }

  .btn-complete {
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    color: white;
    border: none;
    padding: 0.875rem 2.5rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px rgba(76, 175, 80, 0.3);
  }

  .btn-complete:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
  }

  .btn-complete.completed {
    background: linear-gradient(135deg, #6b9e78 0%, #5a8a67 100%);
    cursor: default;
    opacity: 0.8;
  }

  .btn-complete:disabled {
    cursor: not-allowed;
  }

  .no-video {
    text-align: center;
    padding: 4rem 2rem;
    color: #999;
  }

  .no-video p {
    font-size: 1.2rem;
  }
</style>
