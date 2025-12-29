<script>
  import { onMount } from 'svelte';
  import Router, { link, location } from 'svelte-spa-router';
  import { progressStore } from './stores/progressStore.js';

  // Check if we're on video page for mobile header hiding
  $: isVideoPage = $location && $location.startsWith('/video/');

  // Route components
  import Courses from './routes/Courses.svelte';
  import Video from './routes/Video.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Profile from './routes/Profile.svelte';
  import QuizPage from './routes/QuizPage.svelte';

  let showUserMenu = false;
  let showMobileMenu = false;

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

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu;
  }

  function closeMobileMenu() {
    showMobileMenu = false;
  }

  // Close menu when clicking outside
  function handleClickOutside(event) {
    if (showUserMenu && !event.target.closest('.user-menu-container')) {
      closeUserMenu();
    }
    if (showMobileMenu && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-button')) {
      closeMobileMenu();
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<main>
  <header class:minimal-on-video={isVideoPage}>
    <div class="header-content" class:minimal={isVideoPage}>
      <div class="header-left hide-mobile" class:hide-on-video={isVideoPage}>
        <h1 class="header-title">Roeland Vrolijk</h1>
        <p class="subtitle hide-medium">Muziekonderwijs Platform</p>
      </div>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav" class:hide-on-video={isVideoPage}>
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
        <div class="header-stats hide-mobile" class:hide-on-video={isVideoPage}>
          <span class="points">{$progressStore.points} punten</span>
          <span class="level">Level {$progressStore.level}</span>
        </div>
        <div class="user-menu-container hide-mobile" class:hide-on-video={isVideoPage}>
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

        <!-- Mobile Hamburger Button - Always visible -->
        <button class="hamburger-button show-mobile" on:click|stopPropagation={toggleMobileMenu} aria-label="Menu">
          <span class="hamburger-line" class:open={showMobileMenu}></span>
          <span class="hamburger-line" class:open={showMobileMenu}></span>
          <span class="hamburger-line" class:open={showMobileMenu}></span>
        </button>
      {/if}
    </div>

    <!-- Mobile Menu -->
    {#if showMobileMenu}
      <div class="mobile-menu show-mobile">
        <nav class="mobile-nav">
          <a
            href="/"
            use:link
            class:active={$location === '/'}
            on:click={closeMobileMenu}
          >
            📚 Cursussen
          </a>
          <a
            href="/dashboard"
            use:link
            class:active={$location === '/dashboard'}
            on:click={closeMobileMenu}
          >
            📊 Mijn Voortgang
          </a>
          <a
            href="/profile"
            use:link
            class:active={$location === '/profile'}
            on:click={closeMobileMenu}
          >
            👤 Mijn Profiel
          </a>
        </nav>
        {#if $progressStore}
          <div class="mobile-stats">
            <div class="mobile-stat">
              <span class="stat-icon">⭐</span>
              <span class="stat-text">{$progressStore.points} punten</span>
            </div>
            <div class="mobile-stat">
              <span class="stat-icon">🎵</span>
              <span class="stat-text">Level {$progressStore.level}</span>
            </div>
            <div class="mobile-stat">
              <span class="stat-icon">{$progressStore.avatar || '👨‍🎓'}</span>
              <span class="stat-text">{$progressStore.username || 'Music Teacher'}</span>
            </div>
          </div>
        {/if}
      </div>
    {/if}
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

  @media (max-width: 768px) {
    header {
      padding: 1rem 1rem;
    }
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 3rem;
  }

  @media (max-width: 768px) {
    .header-content {
      gap: 0.75rem;
    }
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

  .header-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.25rem;
    }

    .header-title {
      max-width: 150px;
    }
  }

  @media (max-width: 400px) {
    .header-title {
      max-width: 120px;
    }
  }

  .subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 400;
  }

  .desktop-nav {
    display: flex;
    gap: 0.5rem;
    flex: 1;
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }
  }

  .desktop-nav a {
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

  .desktop-nav a:hover {
    background: var(--background);
    color: var(--primary-color);
  }

  .desktop-nav a.active {
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

  /* Reduce spacing on medium screens */
  @media (max-width: 920px) and (min-width: 769px) {
    .header-stats {
      gap: 0.75rem;
      font-size: 0.875rem;
    }
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

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
  }

  /* Hide subtitle on medium screens to save space */
  @media (max-width: 920px) and (min-width: 769px) {
    .hide-medium {
      display: none;
    }
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

  /* Hide username on medium screens to save space */
  @media (max-width: 920px) and (min-width: 769px) {
    .user-name {
      display: none;
    }
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

  /* Minimal header on video pages on mobile - only show hamburger */
  @media (max-width: 768px) {
    header.minimal-on-video {
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    header.minimal-on-video .header-content.minimal {
      justify-content: flex-end;
      gap: 0;
    }

    .hide-on-video {
      display: none !important;
    }

    /* Ensure hamburger button is always visible */
    .hamburger-button.show-mobile {
      display: flex !important;
    }
  }

  /* Mobile Hamburger Menu */
  .hamburger-button {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 2.5rem;
    height: 2.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 101;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .hamburger-button {
      display: flex;
    }
  }

  .hamburger-line {
    width: 100%;
    height: 3px;
    background: var(--primary-color);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .hamburger-line.open:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
  }

  .hamburger-line.open:nth-child(2) {
    opacity: 0;
  }

  .hamburger-line.open:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -8px);
  }

  /* Mobile Menu */
  .mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    animation: slideDown 0.3s ease;
    display: none;
  }

  @media (max-width: 768px) {
    .mobile-menu {
      display: block;
    }
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

  .mobile-nav {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
  }

  .mobile-nav a {
    padding: 1rem 1.5rem;
    color: var(--text-primary);
    text-decoration: none;
    font-size: 1.125rem;
    font-weight: 500;
    border-left: 4px solid transparent;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .mobile-nav a:active {
    background: var(--background);
  }

  .mobile-nav a.active {
    background: rgba(44, 95, 124, 0.1);
    border-left-color: var(--primary-color);
    color: var(--primary-color);
  }

  .mobile-stats {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border);
    background: var(--background);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .mobile-stat {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .stat-text {
    font-weight: 500;
    color: var(--text-primary);
  }
</style>
