# 🎵 Music Teacher Training Platform

A gamified learning platform for teaching primary school teachers how to be better music educators for children.

## Features

- 📚 **Structured Courses** - Organized into courses, chapters, and individual video lessons
- 🎥 **YouTube Video Integration** - Embedded video player for seamless learning
- 🏆 **Gamification** - Points, levels, achievements, and progress tracking
- 🔒 **Progressive Unlocking** - Content unlocks as you complete prerequisites
- 📊 **Progress Dashboard** - Visual tracking of your learning journey
- 🔙 **Browser Navigation** - Full routing support with working back/forward buttons
- 💾 **Local Data Storage** - All progress saved in easy-to-edit JSON files

## Tech Stack

- **Svelte 4** - Reactive frontend framework
- **Vite** - Fast build tool and dev server
- **svelte-spa-router** - Client-side routing with browser history support
- **Local JSON** - File-based data storage (easy to migrate to database later)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Project Structure

```
roeland/
├── src/
│   ├── App.svelte              # Main application component with router
│   ├── main.js                 # Application entry point
│   ├── app.css                 # Global styles
│   ├── routes/
│   │   ├── Courses.svelte      # Courses page route
│   │   ├── Video.svelte        # Video player route
│   │   └── Dashboard.svelte    # Dashboard route
│   ├── components/
│   │   ├── CourseList.svelte   # Display courses and chapters
│   │   ├── VideoPlayer.svelte  # YouTube video player
│   │   └── ProgressDashboard.svelte  # Progress tracking UI
│   └── services/
│       └── dataService.js      # Data abstraction layer
├── data/
│   ├── courses.json            # Course/chapter/video structure
│   ├── user-progress.json      # User progress tracking
│   └── achievements.json       # Achievements and levels
├── index.html
├── vite.config.js
└── package.json
```

## Data Structure

### Courses (`data/courses.json`)

Define your course structure with chapters and videos:

```json
{
  "courses": [
    {
      "id": "course-1",
      "title": "Course Title",
      "description": "Course description",
      "thumbnail": "🎵",
      "requiredPoints": 0,
      "chapters": [
        {
          "id": "chapter-1-1",
          "title": "Chapter Title",
          "description": "Chapter description",
          "videos": [
            {
              "id": "video-1-1-1",
              "title": "Video Title",
              "youtubeId": "dQw4w9WgXcQ",
              "duration": "5:30",
              "description": "Video description",
              "points": 10
            }
          ]
        }
      ]
    }
  ]
}
```

### User Progress (`data/user-progress.json`)

Track user achievements and progress:

```json
{
  "userId": "default-user",
  "username": "Music Teacher",
  "points": 0,
  "level": 1,
  "completedVideos": [],
  "completedQuizzes": [],
  "unlockedContent": [],
  "earnedAchievements": [],
  "videoProgress": {},
  "lastActive": null,
  "stats": {
    "totalVideosWatched": 0,
    "totalQuizzesPassed": 0,
    "totalTimeSpent": 0,
    "currentStreak": 0,
    "longestStreak": 0
  }
}
```

### Achievements (`data/achievements.json`)

Define achievements and level requirements:

```json
{
  "achievements": [
    {
      "id": "first-video",
      "name": "First Steps",
      "description": "Watch your first video",
      "icon": "🎵",
      "points": 10,
      "condition": {
        "type": "videos_watched",
        "count": 1
      }
    }
  ],
  "levels": [
    {
      "level": 1,
      "name": "Beginner",
      "pointsRequired": 0,
      "icon": "🌱"
    }
  ]
}
```

## Editing Content

All content is stored in JSON files in the `data/` directory. You can:

1. **Add new videos** - Edit `data/courses.json` and add video objects with YouTube IDs
2. **Create new courses** - Add new course objects to the courses array
3. **Modify achievements** - Edit `data/achievements.json` to add new achievements
4. **View progress** - Open `data/user-progress.json` to see your progress

✅ **Note**: Progress is automatically saved to browser localStorage. Your progress persists across page refreshes. You can clear progress from the "Mijn Voortgang" (My Progress) dashboard.

## Future Backend Migration

The `dataService.js` provides a clean abstraction layer. To migrate to a real backend:

1. Replace localStorage calls with API endpoints
2. Update `saveUserProgress()` to POST to your API instead of localStorage
3. Add authentication/authorization
4. All component code remains unchanged!

Example migration:

```javascript
// Current (localStorage)
async saveUserProgress(progress) {
  this.userProgress = progress;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

// Future (API)
async saveUserProgress(progress) {
  this.userProgress = progress;
  const response = await fetch('/api/user/progress', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(progress)
  });
  return await response.json();
}
```

## Customization

### Changing Colors

Edit the CSS variables in `src/app.css`:

```css
:root {
  --primary-color: #4f46e5;
  --secondary-color: #10b981;
  /* ... more variables */
}
```

### Adding YouTube Videos

1. Find a YouTube video
2. Get the video ID from the URL (e.g., `dQw4w9WgXcQ` from `youtube.com/watch?v=dQw4w9WgXcQ`)
3. Add it to `data/courses.json`

### Points and Leveling

- Each video awards points (defined in the video object)
- Levels are defined in `data/achievements.json`
- Customize the leveling formula in `dataService.js`

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Routing

The app uses hash-based routing (URLs like `/#/video/course-1/chapter-1-1/video-1-1-1`):

- `/` - Course list
- `/dashboard` - Progress dashboard  
- `/video/:courseId/:chapterId/:videoId` - Video player

Browser back/forward buttons work correctly, and you can bookmark specific videos!

## Roadmap

- [x] Browser navigation with routing
- [x] LocalStorage persistence for progress
- [x] Clear progress functionality
- [ ] Quiz system implementation
- [ ] Enhanced achievement conditions
- [ ] Export/import progress
- [ ] Multiple user profiles
- [ ] Backend API integration
- [ ] Video watch time tracking
- [ ] Certificate generation

## License

This project is for educational purposes.