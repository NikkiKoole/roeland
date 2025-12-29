import { describe, it, expect, beforeEach, vi } from "vitest";
import { get } from "svelte/store";
import { progressStore } from "./progressStore.js";

describe("progressStore", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch.mockReset();
  });

  describe("init", () => {
    it("should load from localStorage if available", async () => {
      const mockProgress = {
        userId: "test-user",
        points: 100,
        level: 2,
        completedVideos: ["video-1", "video-2"],
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(mockProgress));

      await progressStore.init();

      const value = get(progressStore);
      expect(value.points).toBe(100);
      expect(value.level).toBe(2);
      expect(value.completedVideos).toHaveLength(2);
    });

    it("should load default data if localStorage is empty", async () => {
      localStorage.getItem.mockReturnValue(null);

      const defaultProgress = {
        userId: "default-user",
        points: 0,
        level: 1,
        completedVideos: [],
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => defaultProgress,
      });

      await progressStore.init();

      expect(global.fetch).toHaveBeenCalledWith("/data/user-progress.json");
      const value = get(progressStore);
      expect(value.points).toBe(0);
      expect(value.completedVideos).toHaveLength(0);
    });

    it("should handle corrupted localStorage data", async () => {
      localStorage.getItem.mockReturnValue("invalid-json{");

      const defaultProgress = {
        userId: "default-user",
        points: 0,
        level: 1,
        completedVideos: [],
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => defaultProgress,
      });

      await progressStore.init();

      // Should fall back to default
      const value = get(progressStore);
      expect(value.points).toBe(0);
    });
  });

  describe("save", () => {
    it("should save to localStorage", () => {
      const progress = {
        userId: "test-user",
        points: 50,
        level: 1,
        completedVideos: ["video-1"],
      };

      progressStore.save(progress);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "roeland-user-progress",
        JSON.stringify(progress),
      );
    });

    it("should update the store value", () => {
      const progress = {
        userId: "test-user",
        points: 75,
        level: 1,
        completedVideos: ["video-1", "video-2"],
      };

      progressStore.save(progress);

      const value = get(progressStore);
      expect(value.points).toBe(75);
      expect(value.completedVideos).toHaveLength(2);
    });

    it("should handle localStorage errors gracefully", () => {
      const progress = {
        userId: "test-user",
        points: 50,
      };

      localStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      // Should not throw
      expect(() => progressStore.save(progress)).not.toThrow();
    });
  });

  describe("clear", () => {
    it("should remove from localStorage", async () => {
      const defaultProgress = {
        userId: "default-user",
        points: 0,
        level: 1,
        completedVideos: [],
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => defaultProgress,
      });

      await progressStore.clear();

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
        earnedAchievements: [],
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => defaultProgress,
      });

      await progressStore.clear();

      const value = get(progressStore);
      expect(value.points).toBe(0);
      expect(value.level).toBe(1);
      expect(value.completedVideos).toHaveLength(0);
      expect(value.earnedAchievements).toHaveLength(0);
    });
  });

  describe("reactivity", () => {
    it("should notify subscribers on save", (done) => {
      const progress = {
        userId: "test-user",
        points: 25,
        level: 1,
      };

      const unsubscribe = progressStore.subscribe((value) => {
        if (value && value.points === 25) {
          expect(value.points).toBe(25);
          unsubscribe();
          done();
        }
      });

      progressStore.save(progress);
    });

    it("should notify subscribers on clear", async () => {
      const defaultProgress = {
        userId: "default-user",
        points: 0,
        level: 1,
        completedVideos: [],
      };

      global.fetch.mockResolvedValueOnce({
        json: async () => defaultProgress,
      });

      await progressStore.clear();

      const value = get(progressStore);
      expect(value.points).toBe(0);
      expect(value.completedVideos).toHaveLength(0);
    });
  });
});
