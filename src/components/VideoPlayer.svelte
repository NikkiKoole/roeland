<script>
  import { createEventDispatcher } from 'svelte';

  export let video;
  export let course;
  export let chapter;
  export let isCompleted = false;

  const dispatch = createEventDispatcher();

  let youtubeUrl = '';
  let showDescription = false;

  $: if (video && video.youtubeId) {
    youtubeUrl = `https://www.youtube.com/embed/${video.youtubeId}?enablejsapi=1`;
  }

  function handleComplete() {
    dispatch('complete');
  }

  function handleBack() {
    dispatch('back');
  }

  function toggleDescription() {
    showDescription = !showDescription;
  }
</script>

<div class="video-player">
  {#if video}
    <!-- Desktop breadcrumb -->
    <div class="breadcrumb hide-mobile">
      <button class="btn-back" on:click={handleBack}>← Terug naar Cursussen</button>
      <span class="breadcrumb-text">{course.title} / {chapter.title}</span>
    </div>

    <!-- Video container - prominent on mobile -->
    <div class="video-container">
      <!-- Floating back button (mobile only) - overlays video -->
      <button class="btn-back-floating" on:click={handleBack} aria-label="Terug">
        ←
      </button>

      <iframe
        src={youtubeUrl}
        title={video.title}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Video info - collapsible on mobile -->
    <div class="video-info">
      <div class="video-header">
        <h2>{video.title}</h2>
        <div class="video-meta">
          <span class="duration">⏱️ {video.duration}</span>
          <span class="points">⭐ {video.points} punten</span>
        </div>
      </div>

      {#if video.description}
        <button class="description-toggle show-mobile" on:click={toggleDescription}>
          {showDescription ? '▼' : '▶'} Beschrijving
        </button>

        <div class="description-container" class:expanded={showDescription}>
          <p class="description">{video.description}</p>
        </div>
      {/if}
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

  @media (max-width: 768px) {
    .video-player {
      padding: 0;
    }
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

  /* Floating back button (mobile only) - fixed to viewport */
  .btn-back-floating {
    display: none;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1000;
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: none;
    border-radius: 50%;
    color: #1a1a1a;
    font-size: 1.5rem;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    .btn-back-floating {
      display: flex;
    }
  }

  .btn-back-floating:active {
    background: rgba(255, 255, 255, 1);
    transform: scale(0.95);
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

  @media (max-width: 768px) {
    .video-container {
      border-radius: 0;
      box-shadow: none;
    }
  }

  .video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .video-info {
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    .video-info {
      margin-top: 0;
    }
  }

  .video-header {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .video-header {
      border-radius: 0;
      padding: 1rem;
      box-shadow: none;
      border-bottom: 1px solid var(--border);
    }
  }

  .video-header h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  @media (max-width: 768px) {
    .video-header h2 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }
  }

  .video-meta {
    display: flex;
    gap: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  @media (max-width: 768px) {
    .video-meta {
      gap: 1rem;
      font-size: 0.875rem;
    }
  }

  .duration, .points {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  /* Description toggle button (mobile only) */
  .description-toggle {
    display: none;
    width: 100%;
    background: var(--surface);
    border: none;
    border-bottom: 1px solid var(--border);
    padding: 1rem;
    text-align: left;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    transition: background 0.2s;
  }

  @media (max-width: 768px) {
    .description-toggle {
      display: block;
    }
  }

  .description-toggle:active {
    background: var(--background);
  }

  /* Description container */
  .description-container {
    background: white;
    padding: 0 1.5rem;
    border-radius: 8px;
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    .description-container {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      padding: 0 1rem;
      margin-top: 0;
      border-radius: 0;
    }

    .description-container.expanded {
      max-height: 500px;
      padding: 1rem;
      border-bottom: 1px solid var(--border);
    }
  }

  .description {
    color: #666;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .description {
      font-size: 0.9375rem;
      line-height: 1.5;
    }
  }

  .video-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    padding: 0 1rem;
  }

  @media (max-width: 768px) {
    .video-actions {
      margin-top: 1rem;
      padding: 1rem;
    }
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
    min-height: 44px;
  }

  @media (max-width: 768px) {
    .btn-complete {
      width: 100%;
      padding: 1rem 1.5rem;
      font-size: 1rem;
      min-height: 56px;
    }
  }

  .btn-complete:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
  }

  @media (max-width: 768px) {
    .btn-complete:hover:not(:disabled) {
      transform: none;
    }

    .btn-complete:active:not(:disabled) {
      opacity: 0.9;
    }
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
