import { writable } from 'svelte/store';

function createProgressStore() {
  const { subscribe, set, update } = writable(null);

  return {
    subscribe,
    set,
    update,

    // Initialize from localStorage or default
    async init() {
      const stored = localStorage.getItem('roeland-user-progress');
      if (stored) {
        try {
          set(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing stored progress:', e);
          const response = await fetch('/data/user-progress.json');
          const defaultData = await response.json();
          set(defaultData);
        }
      } else {
        const response = await fetch('/data/user-progress.json');
        const defaultData = await response.json();
        set(defaultData);
      }
    },

    // Save to localStorage and update store
    save(progress) {
      try {
        localStorage.setItem('roeland-user-progress', JSON.stringify(progress));
        set(progress);
      } catch (e) {
        console.error('Error saving progress:', e);
      }
    },

    // Clear progress
    async clear() {
      localStorage.removeItem('roeland-user-progress');
      const response = await fetch('/data/user-progress.json');
      const defaultData = await response.json();
      set(defaultData);
    }
  };
}

export const progressStore = createProgressStore();
