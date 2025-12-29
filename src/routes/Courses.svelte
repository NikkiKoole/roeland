<script>
  import { onMount } from 'svelte';
  import { push, location } from 'svelte-spa-router';
  import CourseList from '../components/CourseList.svelte';
  import dataService from '../services/dataService.js';

  let courses = [];
  let userProgress = null;
  let quizzes = [];
  let componentKey = 0;

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    // Load courses
    courses = (await dataService.loadCourses()).courses;

    // Load user progress
    userProgress = await dataService.loadUserProgress();

    // Load quizzes
    try {
      const response = await fetch('/data/quizzes.json');
      const quizzesData = await response.json();
      quizzes = quizzesData.quizzes;
    } catch (error) {
      console.error('Error loading quizzes:', error);
      quizzes = [];
    }
  }

  function handleVideoSelect(event) {
    const { course, chapter, video } = event.detail;
    push(`/video/${course.id}/${chapter.id}/${video.id}`);
  }
</script>

<div class="courses-page">
  {#key componentKey}
    <CourseList
      {courses}
      {userProgress}
      {quizzes}
      on:videoSelect={handleVideoSelect}
    />
  {/key}
</div>

<style>
  .courses-page {
    width: 100%;
  }
</style>
