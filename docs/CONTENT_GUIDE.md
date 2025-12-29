# Content Editing Guide

This guide will help you quickly update the course content with your own videos and structure.

## Quick Start: Adding Your Videos

### Step 1: Get YouTube Video IDs

1. Go to any YouTube video you want to use
2. Look at the URL: `https://www.youtube.com/watch?v=VIDEO_ID_HERE`
3. Copy the VIDEO_ID (the part after `v=`)

Example: 
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ`

### Step 2: Edit courses.json

Open `data/courses.json` and replace the placeholder video IDs with your own.

```json
{
  "id": "video-1-1-1",
  "title": "Your Video Title",
  "youtubeId": "YOUR_VIDEO_ID_HERE",
  "duration": "5:30",
  "description": "Description of what this video teaches",
  "points": 10
}
```

### Step 3: Organize Your Course Structure

The hierarchy is: **Course → Chapter → Video**

```
Course: "Fundamentals of Music Education"
  └─ Chapter: "Introduction to Music Education"
      ├─ Video 1: "Why Music Education Matters"
      ├─ Video 2: "Creating a Musical Classroom"
      └─ Video 3: "Age-Appropriate Activities"
```

## Detailed Examples

### Adding a New Video to an Existing Chapter

Find the chapter in `data/courses.json` and add to its `videos` array:

```json
{
  "id": "chapter-1-1",
  "title": "Introduction to Music Education",
  "videos": [
    {
      "id": "video-1-1-1",
      "title": "Existing Video",
      "youtubeId": "abc123",
      "duration": "5:30",
      "description": "First video",
      "points": 10
    },
    {
      "id": "video-1-1-NEW",
      "title": "Your New Video",
      "youtubeId": "xyz789",
      "duration": "8:00",
      "description": "This is my new video about...",
      "points": 15
    }
  ]
}
```

### Adding a New Chapter to an Existing Course

Find the course and add to its `chapters` array:

```json
{
  "id": "course-1",
  "title": "Fundamentals of Music Education",
  "chapters": [
    {
      "id": "chapter-1-1",
      "title": "Existing Chapter",
      "videos": [...]
    },
    {
      "id": "chapter-1-NEW",
      "title": "Your New Chapter Title",
      "description": "What this chapter covers",
      "videos": [
        {
          "id": "video-1-NEW-1",
          "title": "First Video in New Chapter",
          "youtubeId": "abc123",
          "duration": "7:30",
          "description": "Video description",
          "points": 15
        }
      ]
    }
  ]
}
```

### Adding a Completely New Course

Add a new course object to the `courses` array:

```json
{
  "courses": [
    {
      "id": "course-NEW",
      "title": "Advanced Music Pedagogy",
      "description": "Advanced techniques for experienced teachers",
      "thumbnail": "🎼",
      "requiredPoints": 200,
      "chapters": [
        {
          "id": "chapter-NEW-1",
          "title": "First Chapter",
          "description": "Chapter description",
          "videos": [
            {
              "id": "video-NEW-1-1",
              "title": "Video Title",
              "youtubeId": "VIDEO_ID",
              "duration": "10:00",
              "description": "Video description",
              "points": 25
            }
          ]
        }
      ]
    }
  ]
}
```

## Field Explanations

### Course Fields
- `id`: Unique identifier (e.g., "course-1", "course-advanced")
- `title`: Display name of the course
- `description`: Brief overview shown on course card
- `thumbnail`: Emoji or icon (🎵, 🎤, 🥁, etc.)
- `requiredPoints`: Points needed to unlock this course (0 = always available)
- `chapters`: Array of chapter objects

### Chapter Fields
- `id`: Unique identifier (e.g., "chapter-1-1")
- `title`: Chapter name
- `description`: Brief overview
- `videos`: Array of video objects

### Video Fields
- `id`: Unique identifier (e.g., "video-1-1-1")
- `title`: Video title shown in UI
- `youtubeId`: The YouTube video ID (REQUIRED)
- `duration`: Display duration like "5:30" or "12:45"
- `description`: Detailed description of video content
- `points`: Points awarded for completing this video

## Tips for Content Organization

### Naming Convention
Keep IDs consistent and hierarchical:
- Courses: `course-1`, `course-2`, `course-advanced`
- Chapters: `chapter-{courseNum}-{chapterNum}` → `chapter-1-1`, `chapter-1-2`
- Videos: `video-{courseNum}-{chapterNum}-{videoNum}` → `video-1-1-1`

### Points Distribution
- Introductory videos: 10-15 points
- Standard videos: 15-20 points
- Complex/longer videos: 20-30 points
- Capstone/advanced: 30-50 points

### Progressive Difficulty
Organize content from simple to complex:
1. Start with foundational concepts
2. Build on previous knowledge
3. End chapters with more challenging material

### Course Unlocking
Use `requiredPoints` to lock advanced courses:
- Course 1: `requiredPoints: 0` (always available)
- Course 2: `requiredPoints: 50` (unlock after ~5 videos)
- Course 3: `requiredPoints: 150` (unlock after completing most of course 1 & 2)

## Finding Music Education Videos

### Recommended YouTube Channels
- Teaching music concepts to kids
- Elementary music education
- Orff/Kodály method videos
- Children's music activities
- Classroom instrument tutorials

### Search Terms
- "elementary music education"
- "teaching music to children"
- "Orff instruments classroom"
- "primary school music lessons"
- "music pedagogy for teachers"

## Tracking Your Changes

Always test your changes:
1. Save your edited `courses.json`
2. Refresh the browser (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)
3. Check that all videos appear correctly
4. Try clicking through the course structure

## Common Mistakes to Avoid

❌ **Don't forget commas** between array items
❌ **Don't use duplicate IDs** - each must be unique
❌ **Don't forget quotes** around strings
❌ **Don't break the JSON structure** - use a JSON validator if unsure

✅ Use a JSON validator (search "JSON validator online")
✅ Keep backup copies before making big changes
✅ Test after each major edit

## Customizing Achievements

Edit `data/achievements.json` to add custom achievements:

```json
{
  "id": "rhythm-master",
  "name": "Rhythm Master",
  "description": "Complete all rhythm chapter videos",
  "icon": "🥁",
  "points": 100,
  "condition": {
    "type": "videos_watched",
    "count": 5
  }
}
```

## Resetting Progress

To start fresh:
1. Open `data/user-progress.json`
2. Reset the values:
```json
{
  "userId": "default-user",
  "username": "Music Teacher",
  "points": 0,
  "level": 1,
  "completedVideos": [],
  "earnedAchievements": [],
  "stats": {
    "totalVideosWatched": 0
  }
}
```

## Need Help?

- Check JSON syntax: https://jsonlint.com/
- Test YouTube embeds: Try the video ID at `youtube.com/watch?v=YOUR_ID`
- Browser console: Press F12 to see any error messages