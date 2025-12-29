<script>
  import { createEventDispatcher } from 'svelte';

  export let courses = [];
  export let userProgress = null;
  export let achievements = [];

  const dispatch = createEventDispatcher();

  function handleClearProgress() {
    dispatch('clearProgress');
  }

  $: totalVideos = courses.reduce((acc, course) => {
    return acc + course.chapters.reduce((chAcc, chapter) => {
      return chAcc + chapter.videos.length;
    }, 0);
  }, 0);

  $: watchedVideos = userProgress?.completedVideos?.length || 0;
  $: totalPoints = userProgress?.points || 0;
  $: unlockedAchievements = achievements?.filter(a =>
    userProgress?.earnedAchievements?.includes(a.id)
  ) || [];

  $: progressPercentage = totalVideos === 0 ? 0 : Math.round((watchedVideos / totalVideos) * 100);

  $: currentLevel = userProgress?.level || 1;
  $: pointsForNextLevel = 100; // Always 100 points per level
  $: pointsForPreviousLevel = (currentLevel - 1) * 100;
  $: pointsInCurrentLevel = totalPoints - pointsForPreviousLevel;
  $: levelProgress = Math.min(Math.round((pointsInCurrentLevel / pointsForNextLevel) * 100), 100);
</script>

<div class="dashboard">
  <div class="dashboard-header">
    <h2>Jouw Voortgang</h2>
    <button class="btn-clear" on:click={handleClearProgress}>
      🗑️ Wis Alle Voortgang
    </button>
  </div>

  {#if userProgress}
    <!-- Level & Points -->
    <div class="stats-grid">
      <div class="stat-card level-card">
        <div class="stat-icon">🎵</div>
        <div class="stat-content">
          <div class="stat-label">Niveau</div>
          <div class="stat-value">{userProgress.level}</div>
          <div class="stat-sublabel">{totalPoints} punten</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📺</div>
        <div class="stat-content">
          <div class="stat-label">Video's Bekeken</div>
          <div class="stat-value">{watchedVideos} / {totalVideos}</div>
          <div class="stat-sublabel">{progressPercentage}% voltooid</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <div class="stat-content">
          <div class="stat-label">Prestaties</div>
          <div class="stat-value">{unlockedAchievements.length} / {achievements.length}</div>
        </div>
      </div>
    </div>

    <!-- Overall Progress Bar -->
    <div class="progress-section">
      <h3>Totale Cursusvoortgang</h3>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progressPercentage}%"></div>
      </div>
      <div class="progress-text">{progressPercentage}% Voltooid</div>
    </div>

    <!-- Level Progress Bar -->
    <div class="progress-section">
      <h3>Voortgang naar Niveau {currentLevel + 1}</h3>
      <div class="progress-bar level-bar">
        <div class="progress-fill level-fill" style="width: {levelProgress}%"></div>
      </div>
      <div class="progress-text">
        {pointsInCurrentLevel} / {pointsForNextLevel} punten
      </div>
    </div>

    <!-- Achievements -->
    {#if unlockedAchievements.length > 0}
      <div class="achievements-section">
        <h3>🏆 Jouw Prestaties</h3>
        <div class="achievements-grid">
          {#each unlockedAchievements as achievement}
            <div class="achievement-card unlocked">
              <div class="achievement-icon">{achievement.icon}</div>
              <div class="achievement-name">{achievement.name}</div>
              <div class="achievement-description">{achievement.description}</div>
              <div class="achievement-points">+{achievement.points} punten</div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Locked Achievements Preview -->
    {#if achievements.length > unlockedAchievements.length}
      <div class="achievements-section">
        <h3>🔒 Vergrendelde Prestaties</h3>
        <div class="achievements-grid">
          {#each achievements.filter(a => !userProgress.earnedAchievements.includes(a.id)) as achievement}
            <div class="achievement-card locked">
              <div class="achievement-icon locked-icon">🔒</div>
              <div class="achievement-name">{achievement.name}</div>
              <div class="achievement-description">{achievement.description}</div>
              <div class="achievement-points">+{achievement.points} punten</div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

  {:else}
    <p>Voortgang laden...</p>
  {/if}
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 2rem;
    margin: 0;
    color: #333;
  }

  .btn-clear {
    padding: 0.625rem 1.25rem;
    background: transparent;
    color: var(--error);
    border: 2px solid var(--error);
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .btn-clear:hover {
    background: var(--error);
    color: white;
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #555;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: transform 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .level-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .stat-icon {
    font-size: 3rem;
  }

  .stat-content {
    flex: 1;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 0.3rem;
  }

  .level-card .stat-label {
    opacity: 0.9;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.2rem;
  }

  .stat-sublabel {
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .progress-section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .progress-bar {
    height: 30px;
    background: #e0e0e0;
    border-radius: 15px;
    overflow: hidden;
    margin: 1rem 0 0.5rem 0;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
    transition: width 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    color: white;
    font-weight: bold;
  }

  .level-bar {
    height: 25px;
  }

  .level-fill {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }

  .progress-text {
    text-align: center;
    font-size: 0.9rem;
    color: #666;
  }

  .achievements-section {
    margin-bottom: 2rem;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .achievement-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .achievement-card.unlocked {
    border: 2px solid #FFD700;
  }

  .achievement-card.locked {
    opacity: 0.6;
    background: #f5f5f5;
  }

  .achievement-card:hover {
    transform: translateY(-2px);
  }

  .achievement-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .locked-icon {
    opacity: 0.5;
  }

  .achievement-name {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .achievement-description {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .achievement-points {
    font-size: 0.85rem;
    color: #667eea;
    font-weight: bold;
  }
</style>
