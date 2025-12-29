<script>
  import { onMount } from 'svelte';
  import { location } from 'svelte-spa-router';
  import ProgressDashboard from '../components/ProgressDashboard.svelte';
  import dataService from '../services/dataService.js';
  import { progressStore } from '../stores/progressStore.js';

  let courses = [];
  let achievements = [];

  onMount(async () => {
    await loadData();
  });

  // Reload data when navigating to dashboard
  $: if ($location === '/dashboard') {
    reloadData();
  }

  async function loadData() {
    courses = (await dataService.loadCourses()).courses;
    achievements = (await dataService.loadAchievements()).achievements;
  }

  async function reloadData() {
    // Force reload progress from localStorage
    await progressStore.init();
    await loadData();
  }

  async function handleClearProgress() {
    if (confirm('Weet je zeker dat je al je voortgang wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
      await dataService.clearUserProgress();
    }
  }
</script>

<ProgressDashboard {courses} userProgress={$progressStore} {achievements} on:clearProgress={handleClearProgress} />
