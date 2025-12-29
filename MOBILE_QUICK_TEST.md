# Mobile Quick Test Guide 🚀

## 30-Second Test on Your Phone

1. **Open the site** on your mobile browser
2. **Tap the hamburger menu** (☰) - Does it slide down?
3. **Tap a video** - Is the button easy to hit?
4. **Start a quiz** - Can you easily select answers?
5. **Check readability** - Can you read without zooming?

✅ **Pass**: All 5 work smoothly  
❌ **Fail**: Hard to tap or text too small

---

## 5-Minute Full Test

### Navigation (1 min)
- [ ] Hamburger menu opens/closes smoothly
- [ ] Menu items are easy to tap
- [ ] Can see points and level in mobile menu
- [ ] Navigation takes you to correct pages

### Course List (1 min)
- [ ] Course cards display full-width
- [ ] Video buttons are easy to tap (not too small)
- [ ] Video titles don't overflow/cut off
- [ ] Quiz buttons are visible and tappable

### Quiz Taking (2 min)
- [ ] Questions display clearly
- [ ] Answer buttons are easy to tap
- [ ] Text input is easy to type in (no zoom on focus)
- [ ] Can see full question without scrolling horizontally
- [ ] "Controleer Antwoord" button works
- [ ] Results screen displays nicely

### Dashboard (1 min)
- [ ] Stats cards stack vertically
- [ ] Progress bars display correctly
- [ ] Achievements show in grid (not broken)
- [ ] All text is readable

---

## Device Testing Sizes

### Priority 1 (Must Test)
- **iPhone 12/13/14** (390px) - Most common
- **Any Android phone** (360-414px) - Common range

### Priority 2 (Should Test)
- **iPhone SE** (375px) - Smallest modern iPhone
- **iPad** (768px) - Tablet breakpoint

### Priority 3 (Nice to Test)
- **iPhone 14 Pro Max** (430px) - Largest phone
- **Small Android** (360px) - Smaller devices

---

## Red Flags 🚩

### Stop and Fix If You See:
- ❌ Horizontal scrolling
- ❌ Text cut off mid-word
- ❌ Buttons too small to tap easily
- ❌ Overlapping content
- ❌ Page zooms when tapping input fields
- ❌ Menu items off-screen

---

## Quick Browser Test

### Chrome DevTools (Desktop Testing)
1. Open DevTools: `F12` or `Cmd+Opt+I` (Mac)
2. Toggle device toolbar: `Cmd+Shift+M` (Mac) or `Ctrl+Shift+M` (Windows)
3. Select device: "iPhone 12 Pro" or "Pixel 5"
4. Test the 5-minute checklist above

### Responsive Dimensions to Test
- **320px** - Tiny phone (min supported)
- **375px** - iPhone SE
- **390px** - iPhone 12/13/14
- **414px** - iPhone Plus models
- **768px** - iPad (breakpoint)

---

## Expected Mobile Experience

### Header
```
┌──────────────────────┐
│ 🎵 Roeland  ☰       │  ← Tap ☰ to open menu
└──────────────────────┘
```

### Mobile Menu (Open)
```
┌──────────────────────┐
│ 🎵 Roeland  ✕       │  ← Tap ✕ to close
├──────────────────────┤
│ 📚 Cursussen         │  ← Easy to tap
│ 📊 Mijn Voortgang    │
│ 👤 Mijn Profiel      │
├──────────────────────┤
│ ⭐ 120 punten        │
│ 🎵 Level 2           │
│ 👨‍🎓 Music Teacher    │
└──────────────────────┘
```

### Course Cards
```
┌────────────────────────────┐
│ Basis Muziekonderwijs      │
│ ████████████░░░ 75%        │
│                            │
│ 📚 Introductie             │
│ ▶️ Video 1          5:30   │ ← 56px tap area
│ ✅ Video 2          8:45   │
│ 📝 Quiz: Test...    +20    │ ← 64px tap area
└────────────────────────────┘
```

### Quiz
```
┌────────────────────────────┐
│ Vraag 1 van 5              │
│ ████████░░░░░░░░ 20%       │
│                            │
│ What is a beat?            │
│                            │
│ ┌────────────────────────┐ │
│ │ A  Regular pulse      ✓│ │ ← Selected (green)
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ B  Loud sound          │ │ ← 56px height
│ └────────────────────────┘ │
│                            │
│ [Controleer Antwoord]      │ ← Full width button
└────────────────────────────┘
```

---

## Performance Check ⚡

### Load Time
- **Expected**: < 2 seconds on 4G
- **Acceptable**: < 3 seconds on 3G
- **Poor**: > 5 seconds

### Smoothness
- **Scrolling**: Should be smooth (60fps)
- **Menu open/close**: Animated smoothly
- **Tap response**: Immediate feedback

---

## Common Issues & Quick Fixes

### Issue: Text Too Small
**Check**: Is base font size 16px?
**Location**: `src/app.css`

### Issue: Buttons Hard to Tap
**Check**: Are buttons at least 44px tall?
**Location**: Component styles, look for `min-height`

### Issue: Zoom on Input Focus (iOS)
**Check**: Are input fields using `font-size: 16px`?
**Location**: Quiz component, input styles

### Issue: Horizontal Scrolling
**Check**: Is `overflow-x: hidden` on body?
**Location**: `src/app.css`

### Issue: Menu Not Opening
**Check**: Is hamburger button visible on mobile?
**Location**: `src/App.svelte`, check `.show-mobile` class

---

## Screenshot Checklist 📸

Take screenshots of:
- [ ] Homepage (course list)
- [ ] Mobile menu (open)
- [ ] Course chapter with videos
- [ ] Quiz question
- [ ] Quiz results
- [ ] Dashboard

Compare with desktop version to verify:
- All content is accessible
- Nothing is cut off
- Layout adapts appropriately

---

## Pass/Fail Criteria

### ✅ PASS if:
- No horizontal scrolling anywhere
- All buttons easy to tap (44px+ height)
- Text readable without zooming
- Navigation works smoothly
- All features accessible
- No content cut off or overlapping

### ❌ FAIL if:
- Any horizontal scrolling exists
- Buttons too small to tap comfortably
- Must zoom to read text
- Content off-screen or cut off
- Features unusable on mobile

---

## Report Template

```
# Mobile Test Report

Date: ___________
Device: ___________
Browser: ___________
Screen Size: ___________

## Results
- Navigation: ☐ Pass ☐ Fail
- Course List: ☐ Pass ☐ Fail
- Quiz: ☐ Pass ☐ Fail
- Dashboard: ☐ Pass ☐ Fail

## Issues Found:
1. 
2. 
3. 

## Screenshots:
- [ ] Homepage
- [ ] Menu
- [ ] Quiz

Overall: ☐ PASS ☐ FAIL
```

---

**Quick Test Time**: 30 seconds  
**Full Test Time**: 5 minutes  
**Report Time**: 2 minutes  

**Total**: < 10 minutes to fully verify mobile responsiveness ✅