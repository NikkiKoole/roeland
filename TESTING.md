# Testing Guide

## Overview

This project uses **Vitest** for unit testing, with support for Svelte components via `@testing-library/svelte`.

## Running Tests

```bash
# Run tests in watch mode (for development)
npm test

# Run tests once (for CI/CD)
npm run test:run

# Run tests with UI
npm run test:ui
```

## Test Structure

```
roeland/
├── src/
│   ├── services/
│   │   ├── dataService.js
│   │   └── dataService.test.js       # Tests for dataService
│   ├── stores/
│   │   ├── progressStore.js
│   │   └── progressStore.test.js     # Tests for progressStore
│   └── tests/
│       └── setup.js                   # Global test setup
├── vitest.config.js                   # Vitest configuration
└── TESTING.md                         # This file
```

## What's Tested

### DataService (`dataService.test.js`)

Tests for the main data service that handles:
- ✅ Loading user progress from localStorage
- ✅ Falling back to default data when localStorage is empty
- ✅ Marking videos as complete
- ✅ Adding points correctly (no double-counting)
- ✅ Leveling up based on points
- ✅ Saving progress to localStorage
- ✅ Clearing user progress
- ✅ Checking video completion status
- ✅ Unlocking achievements based on conditions
- ✅ Preventing duplicate achievements

### ProgressStore (`progressStore.test.js`)

Tests for the Svelte store that handles:
- ✅ Initializing from localStorage
- ✅ Loading default data when needed
- ✅ Handling corrupted localStorage data
- ✅ Saving progress to localStorage
- ✅ Updating store subscribers reactively
- ✅ Clearing progress
- ✅ Graceful error handling
- ✅ Reactivity (subscribers get notified)

## Test Examples

### Testing a Service Method

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import dataService from './dataService.js';

describe('DataService', () => {
  beforeEach(() => {
    // Clear cache before each test
    dataService.userProgress = null;
    localStorage.clear();
  });

  it('should add points when completing a video', async () => {
    const result = await dataService.markVideoComplete(
      'course-1',
      'chapter-1',
      'video-1'
    );

    expect(result.points).toBeGreaterThanOrEqual(10);
    expect(result.completedVideos).toContain('course-1-chapter-1-video-1');
  });
});
```

### Testing a Svelte Store

```javascript
import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { progressStore } from './progressStore.js';

describe('progressStore', () => {
  it('should update store value on save', () => {
    const progress = { points: 50, level: 1 };
    
    progressStore.save(progress);
    
    const value = get(progressStore);
    expect(value.points).toBe(50);
  });
});
```

## Mocked Dependencies

The test setup (`src/tests/setup.js`) provides mocks for:

### localStorage
```javascript
localStorage.getItem(key)
localStorage.setItem(key, value)
localStorage.removeItem(key)
localStorage.clear()
```

### fetch API
```javascript
global.fetch.mockResolvedValueOnce({
  json: async () => ({ data: 'mock' })
});
```

## Points System Testing

### Understanding the Points System

When a user completes their first video:
- **Video points**: 10 points (from the video)
- **Achievement bonus**: +10 points (from "First Steps" achievement)
- **Total**: 20 points ✅

This is **correct behavior**, not a bug!

### Testing Points Calculation

```javascript
it('should award video points plus achievement bonus on first video', async () => {
  const result = await dataService.markVideoComplete(
    'course-1',
    'chapter-1', 
    'video-1'
  );

  // First video = 10 points + 10 bonus = 20 total
  expect(result.points).toBe(20);
  expect(result.earnedAchievements).toContain('first-video');
});
```

## Best Practices

### 1. Clear State Between Tests
```javascript
beforeEach(() => {
  dataService.userProgress = null;
  localStorage.clear();
  global.fetch.mockReset();
});
```

### 2. Test Both Success and Failure Cases
```javascript
it('should handle localStorage errors gracefully', () => {
  localStorage.setItem.mockImplementation(() => {
    throw new Error('Storage quota exceeded');
  });

  expect(() => progressStore.save(progress)).not.toThrow();
});
```

### 3. Test Reactivity
```javascript
it('should notify subscribers on changes', (done) => {
  const unsubscribe = progressStore.subscribe((value) => {
    if (value && value.points === 25) {
      expect(value.points).toBe(25);
      unsubscribe();
      done();
    }
  });

  progressStore.save({ points: 25 });
});
```

## Coverage

To generate coverage reports:

```bash
npm run test:run -- --coverage
```

Coverage reports will be in `coverage/` directory.

## Adding New Tests

### 1. Create Test File
Place test files next to the code they test:
- `dataService.js` → `dataService.test.js`
- `myComponent.svelte` → `myComponent.test.js`

### 2. Write Tests
```javascript
import { describe, it, expect } from 'vitest';

describe('MyFeature', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### 3. Run Tests
```bash
npm test
```

## Debugging Tests

### Console Output
Use `console.log()` in tests - output will show in test results.

### Focused Tests
Run only specific tests:
```javascript
it.only('should run only this test', () => {
  // This test will run
});

it('should skip this test', () => {
  // This test is skipped
});
```

### Skipping Tests
```javascript
it.skip('should skip this test', () => {
  // This test is skipped
});
```

## CI/CD Integration

For continuous integration:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:run
```

## Known Issues

### First Video Points
When completing the first video, users get 20 points (10 + 10 achievement bonus). This is intentional!

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/svelte-testing-library/intro/)
- [Svelte Testing Best Practices](https://svelte.dev/docs/testing)

## Summary

- ✅ Tests run with `npm test`
- ✅ Mocked localStorage and fetch
- ✅ Tests for dataService progress tracking
- ✅ Tests for progressStore reactivity
- ✅ Ready for CI/CD integration

Happy testing! 🧪