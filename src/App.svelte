<script>
  import { onMount } from 'svelte';
  import Router, { link, location } from 'svelte-spa-router';
  import { progressStore } from './stores/progressStore.js';

  // Route components
  import Courses from './routes/Courses.svelte';
  import Video from './routes/Video.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Profile from './routes/Profile.svelte';
  import QuizPage from './routes/QuizPage.svelte';

  let showUserMenu = false;

  // Define routes
  const routes = {
    '/': Courses,
    '/dashboard': Dashboard,
    '/profile': Profile,
    '/video/:courseId/:chapterId/:videoId': Video,
    '/quiz/:quizId': QuizPage,
  };

  onMount(async () => {
    await progressStore.init();
  });

  function toggleUserMenu() {
    showUserMenu = !showUserMenu;
  }

  function closeUserMenu() {
    showUserMenu = false;
  }

  // Close menu when clicking outside
  function handleClickOutside(event) {
    if (showUserMenu && !event.target.closest('.user-menu-container')) {
      closeUserMenu();
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<main>
  <header>
    <div class="header-content">
      <div class="header-left">
        <h1>Roeland Vrolijk</h1>
        <p class="subtitle">Muziekonderwijs Platform</p>
      </div>
      <nav>
        <a
          href="/"
          use:link
          class:active={$location === '/'}
        >
          Cursussen
        </a>
        <a
          href="/dashboard"
          use:link
          class:active={$location === '/dashboard'}
        >
          Mijn Voortgang
        </a>
      </nav>
      {#if $progressStore}
        <div class="header-stats">
          <span class="points">{$progressStore.points} punten</span>
          <span class="level">Level {$progressStore.level}</span>
        </div>
        <div class="user-menu-container">
          <button class="user-menu-button" on:click|stopPropagation={toggleUserMenu}>
            <span class="user-avatar">{$progressStore.avatar || '👨‍🎓'}</span>
            <span class="user-name">{$progressStore.username || 'Music Teacher'}</span>
            <span class="dropdown-arrow" class:open={showUserMenu}>▼</span>
          </button>

          {#if showUserMenu}
            <div class="user-menu-dropdown">
              <a href="/profile" use:link on:click={closeUserMenu} class="menu-item">
                <span class="menu-icon">👤</span>
                Mijn Profiel
              </a>
              <div class="menu-divider"></div>
              <button class="menu-item disabled" disabled>
                <span class="menu-icon">🔒</span>
                Uitloggen (binnenkort)
              </button>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </header>

  <div class="container">
    <Router {routes} />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  main {
    min-height: 100vh;
    background-color: var(--background);
  }

  header {
    background: var(--surface);
    box-shadow: var(--shadow);
    padding: 1.5rem 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid var(--border);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 3rem;
  }

  .header-left {
    flex-shrink: 0;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
    line-height: 1.2;
  }

  .subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 400;
  }

  nav {
    display: flex;
    gap: 0.5rem;
    flex: 1;
  }

  nav a {
    padding: 0.625rem 1.25rem;
    background: transparent;
    color: var(--text-primary);
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.9375rem;
    font-weight: 500;
    transition: all 0.25s ease;
    text-decoration: none;
    position: relative;
  }

  nav a:hover {
    background: var(--background);
    color: var(--primary-color);
  }

  nav a.active {
    background: var(--primary-color);
    color: white;
  }

  .header-stats {
    display: flex;
    gap: 1.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .points {
    color: var(--secondary-color);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .level {
    color: var(--primary-color);
    font-weight: 600;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .user-menu-container {
    position: relative;
    margin-left: 1rem;
  }

  .user-menu-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .user-menu-button:hover {
    border-color: var(--primary-color);
    background: var(--background);
  }

  .user-avatar {
    font-size: 1.5rem;
    line-height: 1;
  }

  .user-name {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .dropdown-arrow {
    font-size: 0.625rem;
    color: var(--text-secondary);
    transition: transform 0.2s ease;
  }

  .dropdown-arrow.open {
    transform: rotate(180deg);
  }

  .user-menu-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    min-width: 220px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    box-shadow: var(--shadow-lg);
    padding: 0.5rem;
    z-index: 1000;
    animation: slideDown 0.2s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-radius: 0.375rem;
    color: var(--text-primary);
    font-size: 0.9375rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s ease;
    text-align: left;
  }

  .menu-item:hover:not(:disabled) {
    background: var(--background);
  }

  .menu-item:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .menu-icon {
    font-size: 1.125rem;
  }

  .menu-divider {
    height: 1px;
    background: var(--border);
    margin: 0.5rem 0;
  }
</style>
