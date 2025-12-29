// Data Service Abstraction Layer
// This service provides a clean interface for data operations
// Currently uses local JSON files + localStorage, but can be swapped for API calls later

import { progressStore } from "../stores/progressStore.js";

const STORAGE_KEY = "roeland-user-progress";
const BASE_URL = import.meta.env.BASE_URL || "/";

class DataService {
  constructor() {
    this.courses = null;
    this.userProgress = null;
    this.achievements = null;
  }

  // ===== COURSES =====
  async loadCourses() {
    if (!this.courses) {
      const response = await fetch(`${BASE_URL}data/courses.json`);
      this.courses = await response.json();
    }
    return this.courses;
  }

  async getCourse(courseId) {
    const courses = await this.loadCourses();
    return courses.find((c) => c.id === courseId);
  }

  async getVideo(courseId, chapterId, videoId) {
    const course = await this.getCourse(courseId);
    if (!course) return null;

    const chapter = course.chapters.find((ch) => ch.id === chapterId);
    if (!chapter) return null;

    return chapter.videos.find((v) => v.id === videoId);
  }

  // ===== USER PROGRESS =====
  async loadUserProgress() {
    // Try to load from localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        this.userProgress = JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored progress:", e);
        // Fall back to default
        const response = await fetch(`${BASE_URL}data/user-progress.json`);
        this.userProgress = await response.json();
      }
    } else {
      // Load default from JSON file
      const response = await fetch(`${BASE_URL}data/user-progress.json`);
      this.userProgress = await response.json();
    }

    return this.userProgress;
  }

  async saveUserProgress(progress) {
    // Save to memory
    this.userProgress = progress;

    // Save to localStorage and update store for reactivity
    progressStore.save(progress);

    return progress;
  }

  async clearUserProgress() {
    // Clear via store (handles localStorage and reactivity)
    await progressStore.clear();

    // Store already loaded and set default data, just update local cache
    this.userProgress = null;
    return await this.loadUserProgress();
  }

  async markVideoComplete(courseId, chapterId, videoId) {
    const progress = await this.loadUserProgress();

    const videoKey = `${courseId}-${chapterId}-${videoId}`;
    if (!progress.completedVideos.includes(videoKey)) {
      progress.completedVideos.push(videoKey);

      // Get video to award points
      const coursesData = await this.loadCourses();
      const course = coursesData.courses.find((c) => c.id === courseId);
      if (course) {
        const chapter = course.chapters.find((ch) => ch.id === chapterId);
        if (chapter) {
          const video = chapter.videos.find((v) => v.id === videoId);
          if (video && video.points) {
            progress.points = (progress.points || 0) + video.points;
          }
        }
      }

      // Update stats
      progress.stats = progress.stats || {};
      progress.stats.totalVideosWatched = progress.completedVideos.length;
    }

    // Update last active
    progress.lastActive = new Date().toISOString();

    // Calculate level based on points
    progress.level = Math.floor(progress.points / 100) + 1;
    console.log("Level calculated after video:", {
      points: progress.points,
      level: progress.level,
    });

    // Check for new achievements before saving (pass progress object)
    await this.checkAchievements(progress);

    // Save once after all updates
    await this.saveUserProgress(progress);

    return progress;
  }

  async isVideoComplete(courseId, chapterId, videoId) {
    const progress = await this.loadUserProgress();
    const videoKey = `${courseId}-${chapterId}-${videoId}`;
    return progress.completedVideos.includes(videoKey);
  }

  async isVideoUnlocked(courseId, chapterId, videoId) {
    // First video is always unlocked
    const course = await this.getCourse(courseId);
    if (!course) return false;

    const chapter = course.chapters.find((ch) => ch.id === chapterId);
    if (!chapter) return false;

    const videoIndex = chapter.videos.findIndex((v) => v.id === videoId);
    if (videoIndex === 0) return true;

    // Check if previous video is complete
    const previousVideo = chapter.videos[videoIndex - 1];
    if (previousVideo) {
      return await this.isVideoComplete(courseId, chapterId, previousVideo.id);
    }

    return true;
  }

  // ===== ACHIEVEMENTS =====
  async loadAchievements() {
    if (!this.achievements) {
      const response = await fetch(`${BASE_URL}data/achievements.json`);
      this.achievements = await response.json();
    }
    return this.achievements;
  }

  async checkAchievements(progress) {
    // If no progress passed, load it
    if (!progress) {
      progress = await this.loadUserProgress();
    }

    const achievementsData = await this.loadAchievements();
    let newAchievements = [];

    // Get the achievements array from the loaded data
    const achievementsList = achievementsData.achievements || [];

    for (const achievement of achievementsList) {
      // Skip if already unlocked
      if (
        progress.earnedAchievements &&
        progress.earnedAchievements.includes(achievement.id)
      ) {
        continue;
      }

      let unlocked = false;

      // Check achievement criteria
      if (achievement.condition.type === "videos_watched") {
        const videosWatched =
          progress.stats?.totalVideosWatched || progress.completedVideos.length;
        unlocked = videosWatched >= achievement.condition.count;
      } else if (achievement.condition.type === "course_complete") {
        const coursesData = await this.loadCourses();
        const course = coursesData.courses.find(
          (c) => c.id === achievement.condition.courseId,
        );
        if (course) {
          const totalVideos = course.chapters.reduce(
            (sum, ch) => sum + ch.videos.length,
            0,
          );
          const completedInCourse = progress.completedVideos.filter((v) =>
            v.startsWith(achievement.condition.courseId),
          ).length;
          unlocked = completedInCourse >= totalVideos;
        }
      }

      if (unlocked) {
        progress.earnedAchievements = progress.earnedAchievements || [];
        progress.earnedAchievements.push(achievement.id);
        progress.points = (progress.points || 0) + achievement.points;
        newAchievements.push(achievement);
      }
    }

    // Don't save here - let the caller save after all modifications
    return newAchievements;
  }

  async getUnlockedAchievements() {
    const achievementsData = await this.loadAchievements();
    const progress = await this.loadUserProgress();

    const achievementsList = achievementsData.achievements || [];
    return achievementsList.filter(
      (a) =>
        progress.earnedAchievements &&
        progress.earnedAchievements.includes(a.id),
    );
  }

  // ===== QUIZZES =====
  async markQuizComplete(courseId, chapterId, quizId, score) {
    const progress = await this.loadUserProgress();

    const quizKey = `${courseId}-${chapterId}-${quizId}`;

    // Check if already completed
    const existingQuiz = progress.completedQuizzes?.find(
      (q) => q.quizKey === quizKey,
    );

    if (!existingQuiz) {
      // Add to completed quizzes
      progress.completedQuizzes = progress.completedQuizzes || [];
      progress.completedQuizzes.push({
        quizKey,
        score,
        completedAt: new Date().toISOString(),
      });

      // Get quiz to award points
      const response = await fetch(`${BASE_URL}data/quizzes.json`);
      const quizzesData = await response.json();
      const quiz = quizzesData.quizzes.find((q) => q.id === quizId);

      if (quiz && quiz.points) {
        progress.points = (progress.points || 0) + quiz.points;
      }

      // Update stats
      progress.stats = progress.stats || {};
      progress.stats.totalQuizzesPassed = progress.completedQuizzes.length;
    } else if (score > existingQuiz.score) {
      // Update score if better
      existingQuiz.score = score;
      existingQuiz.completedAt = new Date().toISOString();
    }

    // Update last active
    progress.lastActive = new Date().toISOString();

    // Calculate level based on points
    progress.level = Math.floor(progress.points / 100) + 1;
    console.log("Level calculated after quiz:", {
      points: progress.points,
      level: progress.level,
    });

    await this.saveUserProgress(progress);

    // Check for new achievements
    await this.checkAchievements(progress);

    return progress;
  }

  async isQuizComplete(courseId, chapterId, quizId) {
    const progress = await this.loadUserProgress();
    const quizKey = `${courseId}-${chapterId}-${quizId}`;
    return (
      progress.completedQuizzes?.some((q) => q.quizKey === quizKey) || false
    );
  }

  // ===== STATISTICS =====
  async getProgressStats() {
    const courses = await this.loadCourses();
    const progress = await this.loadUserProgress();

    const coursesData = await this.loadCourses();
    const totalVideos = coursesData.courses.reduce(
      (sum, course) =>
        sum +
        course.chapters.reduce((chSum, ch) => chSum + ch.videos.length, 0),
      0,
    );

    const videosWatched = progress.completedVideos.length;
    const percentComplete =
      totalVideos > 0 ? Math.round((videosWatched / totalVideos) * 100) : 0;

    return {
      totalVideos,
      watchedVideos: videosWatched,
      percentComplete,
      totalPoints: progress.points || 0,
      achievementsUnlocked: (progress.earnedAchievements || []).length,
    };
  }
}

// Export a singleton instance
export default new DataService();
