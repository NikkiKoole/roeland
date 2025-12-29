# Getting Started - Quick Checklist ✅

Follow these steps to get your Music Teacher Training platform up and running!

## 1️⃣ Install Dependencies

```bash
npm install
```

This installs Svelte, Vite, and all necessary packages.

## 2️⃣ Start the Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 3️⃣ Open in Browser

Open your browser and go to: **http://localhost:5173**

You should see:
- 🎵 Header with "Music Teacher Training"
- Navigation buttons (Courses, My Progress)
- Three courses listed with chapters and videos

## 4️⃣ Test the Basic Functionality

### Watch a Video
1. Click on any video (they start with ▶️ icon)
2. Video player should appear with YouTube embed
3. Click "Mark as Complete" button
4. Check browser console (F12) - you'll see JSON output

### View Progress
1. Click "My Progress" in the header
2. See your stats (points, level, videos watched)
3. View any achievements you've unlocked

### Navigate Courses
1. Click "Back to Courses" from video player
2. Browse through different courses and chapters
3. Notice progress bars showing completion

## 5️⃣ Add Your Own Videos

### Quick Method:
1. Open `data/courses.json`
2. Find a video entry like:
   ```json
   {
     "id": "video-1-1-1",
     "title": "Why Music Education Matters",
     "youtubeId": "dQw4w9WgXcQ",
     "duration": "5:30",
     "description": "...",
     "points": 10
   }
   ```
3. Replace `youtubeId` with your YouTube video ID
4. Update `title`, `description`, and `duration`
5. Save the file
6. Refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

### Get YouTube Video ID:
- From URL: `youtube.com/watch?v=ABC123xyz`
- Video ID is: `ABC123xyz` (everything after `v=`)

## 6️⃣ Progress is Automatically Saved!

**✅ Good news**: Progress is automatically saved to your browser's localStorage!

- Complete a video → Progress is saved automatically
- Refresh the page → Your progress is still there
- Close and reopen browser → Progress persists
- Want to start over? → Use the "Wis Alle Voortgang" button in the dashboard

## 🎨 Customization Quick Wins

### Change Colors
Edit `src/app.css` - lines 2-13:
```css
:root {
  --primary-color: #4f46e5;  /* Main purple */
  --secondary-color: #10b981; /* Success green */
  /* ... more colors */
}
```

### Change App Title
Edit `index.html` - line 7:
```html
<title>Music Teacher Training</title>
```

### Add More Achievements
Edit `data/achievements.json` and add entries like:
```json
{
  "id": "super-learner",
  "name": "Super Learner",
  "description": "Watch 10 videos in one day",
  "icon": "⚡",
  "points": 100,
  "condition": {
    "type": "videos_watched",
    "count": 10
  }
}
```

## 🔧 Troubleshooting

### Videos Not Loading
- Check that `youtubeId` is correct (no extra characters)
- Some videos may be blocked from embedding - try a different video
- Check browser console (F12) for errors

### Page is Blank
- Check browser console for errors
- Verify all JSON files are valid (use jsonlint.com)
- Make sure dev server is running (`npm run dev`)

### Changes Not Appearing
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
- Stop dev server (Ctrl+C) and restart (`npm run dev`)
- Clear browser cache

### JSON Syntax Errors
- Use https://jsonlint.com/ to validate JSON
- Common issues:
  - Missing comma between items
  - Extra comma after last item
  - Unmatched brackets or braces
  - Missing quotes around strings

## 📚 Next Steps

1. **Read the full README.md** - Detailed project documentation
2. **Check CONTENT_GUIDE.md** - Comprehensive guide to editing content
3. **Customize your courses** - Add your own videos and structure
4. **Style it** - Adjust colors, fonts, and layout
5. **Plan backend migration** - When ready, use the dataService abstraction

## 🚀 Production Build

When you're ready to deploy:

```bash
# Build optimized production files
npm run build

# Preview the production build locally
npm run preview
```

The build output goes to the `dist/` folder - deploy this to any static hosting service.

## 💡 Tips

- Start small: Get 1 course working perfectly before adding more
- Test frequently: Refresh after each change
- Keep backups: Copy JSON files before major edits
- Use the console: Browser DevTools (F12) shows helpful errors
- Valid JSON: Always validate JSON before saving

## 🆘 Getting Help

1. Check browser console for error messages (F12)
2. Validate JSON files at https://jsonlint.com/
3. Review the README.md and CONTENT_GUIDE.md
4. Check that YouTube video IDs are correct

---

**You're all set!** 🎉 Start adding your music education content and building your course platform.

Happy teaching! 🎵