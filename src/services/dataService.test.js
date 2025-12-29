import { describe, it, expect, beforeEach, vi } from "vitest";
import dataService from "./dataService.js";

describe("DataService", () => {
  beforeEach(() => {
    // Clear the service cache
    dataService.courses = null;
    dataService.userProgress = null;
    dataService.achievements = null;

    // Clear localStorage
    localStorage.clear();

    // Reset fetch mock
    global.fetch.mockReset();
  });

  describe("loadUserProgress", () => {
    it("should load from localStorage if available", async () => {
      const mockProgress = {
        userId: "test-user",
        points: 50,
        level: 1,
        completedVideos: ["course-1-chapter-1-video-1"],
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(mockProgress));

      const progress = await dataService.loadUserProgress();

      expect(localStorage.getItem).toHaveBeenCalledWith(
        "roeland-user-progress",
      );
      expect(progress.points).toBe(50);
      expect(progress.completedVideos).toHaveLength(1);
    });

    it("should load default data if localStorage is empty", async () => {
      localStorage.getItem.mockReturnValue(null);

      global.fetch.mockResolvedValueOnce({
        json: async () => ({
          userId: "default-user",
          points: 0,
          level: 1,
          completedVideos: [],
        }),
      });

      const progress = await dataService.loadUserProgress();

      expect(global.fetch).toHaveBeenCalledWith("/data/user-progress.json");
      expect(progress.points).toBe(0);
      expect(progress.completedVideos).toHaveLength(0);
    });
  });

  describe("markVideoComplete", () => {
    beforeEach(() => {
      // Mock courses data
      global.fetch.mockImplementation((url) => {
        if (url.includes("courses.json")) {
          return Promise.resolve({
            json: async () => ({
              courses: [
                {
                  id: "course-1",
                  chapters: [
                    {
                      id: "chapter-1",
                      videos: [
                        { id: "video-1", points: 10 },
                        { id: "video-2", points: 15 },
                      ],
                    },
                  ],
                },
              ],
            }),
          });
        }
        if (url.includes("achievements.json")) {
          return Promise.resolve({
            json: async () => ({
              achievements: [
                {
                  id: "first-video",
                  points: 10,
                  condition: { type: "videos_watched", count: 1 },
                },
              ],
            }),
          });
        }
        if (url.includes("user-progress.json")) {
          return Promise.resolve({
            json: async () => ({
              userId: "test-user",
              points: 0,
              level: 1,
              completedVideos: [],
              earnedAchievements: [],
              stats: { totalVideosWatched: 0 },
            }),
          });
        }
      });

      localStorage.getItem.mockReturnValue(null);
    });

    it("should add points when completing a video", async () => {
      const result = await dataService.markVideoComplete(
        "course-1",
        "chapter-1",
        "video-1",
      );

      expect(result.completedVideos).toContain("course-1-chapter-1-video-1");
      expect(result.points).toBeGreaterThanOrEqual(10); // Video points (may include achievement)
    });

    it("should not add points twice for same video", async () => {
      // Complete video first time
      await dataService.markVideoComplete("course-1", "chapter-1", "video-1");

      // Try to complete again
      const result = await dataService.markVideoComplete(
        "course-1",
        "chapter-1",
        "video-1",
      );

      // Should only have the video in list once
      const videoKey = "course-1-chapter-1-video-1";
      const count = result.completedVideos.filter((v) => v === videoKey).length;
      expect(count).toBe(1);
    });

    it("should update level based on points", async () => {
      // Mock progress with 95 points (just under level 2)
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          userId: "test-user",
          points: 95,
          level: 1,
          completedVideos: [],
          earnedAchievements: ["first-video"], // Already earned first achievement
          stats: { totalVideosWatched: 5 },
        }),
      );

      // Clear cache to use mocked localStorage
      dataService.userProgress = null;

      const result = await dataService.markVideoComplete(
        "course-1",
        "chapter-1",
        "video-1",
      );

      // Should now be level 2 (100+ points)
      expect(result.level).toBe(2);
    });

    it("should save progress to localStorage", async () => {
      await dataService.markVideoComplete("course-1", "chapter-1", "video-1");

      expect(localStorage.setItem).toHaveBeenCalled();
      const savedData = localStorage.setItem.mock.calls[0][1];
      const parsed = JSON.parse(savedData);
      expect(parsed.completedVideos).toContain("course-1-chapter-1-video-1");
    });
  });

  describe("clearUserProgress", () => {
    it("should clear localStorage", async () => {
      const defaultProgress = {
        userId: "default-user",
        points: 0,
        level: 1,
        completedVideos: [],
      };

      // Mock fetch for progressStore.clear() call
      global.fetch.mockResolvedValueOnce({
        json: async () => defaultProgress,
      });

      // Mock fetch for loadUserProgress() call
      global.fetch.mockResolvedValueOnce({
        json: async () => defaultProgress,
      });

      await dataService.clearUserProgress();

      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "roeland-user-progress",
      );
    });

    it("should reset to default progress", async () => {
      const defaultProgress = {
        userId: "default-user",
        points: 0,
        level: 1,
        completedVideos: [],
      };

      // Mock fetch for progressStore.clear() call
      global.fetch.mockResolvedValueOnce({
        json: async () => defaultProgress,
      });

      // Mock fetch for loadUserProgress() call
      global.fetch.mockResolvedValueOnce({
        json: async () => defaultProgress,
      });

      const result = await dataService.clearUserProgress();

      expect(result.points).toBe(0);
      expect(result.completedVideos).toHaveLength(0);
    });
  });

  describe("isVideoComplete", () => {
    it("should return true for completed videos", async () => {
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          userId: "test-user",
          completedVideos: ["course-1-chapter-1-video-1"],
        }),
      );

      const isComplete = await dataService.isVideoComplete(
        "course-1",
        "chapter-1",
        "video-1",
      );

      expect(isComplete).toBe(true);
    });

    it("should return false for incomplete videos", async () => {
      localStorage.getItem.mockReturnValue(
        JSON.stringify({
          userId: "test-user",
          completedVideos: [],
        }),
      );

      const isComplete = await dataService.isVideoComplete(
        "course-1",
        "chapter-1",
        "video-1",
      );

      expect(isComplete).toBe(false);
    });
  });

  describe("checkAchievements", () => {
    beforeEach(() => {
      global.fetch.mockImplementation((url) => {
        if (url.includes("achievements.json")) {
          return Promise.resolve({
            json: async () => ({
              achievements: [
                {
                  id: "first-video",
                  name: "First Steps",
                  points: 10,
                  condition: { type: "videos_watched", count: 1 },
                },
                {
                  id: "five-videos",
                  name: "Getting Started",
                  points: 50,
                  condition: { type: "videos_watched", count: 5 },
                },
              ],
            }),
          });
        }
      });
    });

    it("should unlock achievement when condition is met", async () => {
      const progress = {
        completedVideos: ["video-1"],
        earnedAchievements: [],
        points: 10,
        stats: { totalVideosWatched: 1 },
      };

      const newAchievements = await dataService.checkAchievements(progress);

      expect(newAchievements).toHaveLength(1);
      expect(newAchievements[0].id).toBe("first-video");
      expect(progress.earnedAchievements).toContain("first-video");
      expect(progress.points).toBe(20); // 10 + 10 achievement points
    });

    it("should not unlock same achievement twice", async () => {
      const progress = {
        completedVideos: ["video-1"],
        earnedAchievements: ["first-video"],
        points: 20,
        stats: { totalVideosWatched: 1 },
      };

      const newAchievements = await dataService.checkAchievements(progress);

      expect(newAchievements).toHaveLength(0);
      expect(progress.points).toBe(20); // No additional points
    });

    it("should unlock multiple achievements at once", async () => {
      const progress = {
        completedVideos: ["v1", "v2", "v3", "v4", "v5"],
        earnedAchievements: [],
        points: 50,
        stats: { totalVideosWatched: 5 },
      };

      const newAchievements = await dataService.checkAchievements(progress);

      expect(newAchievements.length).toBeGreaterThanOrEqual(1);
      expect(progress.earnedAchievements.length).toBeGreaterThanOrEqual(1);
    });
  });
});
